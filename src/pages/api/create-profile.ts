import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/_lib/prisma";
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const uploadDir = path.join(process.cwd(), "public/photos");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 9,
    allowEmptyFiles: false,
    filter: (part) => part.mimetype?.startsWith("image/") ?? false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filename: (name, ext, part, form) => {
      return `${Date.now()}-${part.originalFilename?.replace(/\s+/g, "-")}`;
    },
  });

  try {
    const [fields, files] = await form.parse(req);

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const biography = Array.isArray(fields.biography) ? fields.biography[0] : fields.biography;
    const birthday = Array.isArray(fields.birthday) ? fields.birthday[0] : fields.birthday;
    const deathday = Array.isArray(fields.deathday) ? fields.deathday[0] : fields.deathday;
    const videoUrl = Array.isArray(fields.videoUrl) ? fields.videoUrl[0] : fields.videoUrl;
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const plan = Array.isArray(fields.plan) ? fields.plan[0] : fields.plan;
    console.log("PLANO: ",plan);
    if (!name || !userId) {
      return res.status(400).json({ error: "Nome e usuário são obrigatórios." });
    }

    // 🔍 **1. Verificar se o usuário existe**
    // const userExists = await db.user.findUnique({
    //   where: { id: userId },
    // });

    // if (!userExists) {
    //   return res.status(400).json({ error: "Usuário não encontrado." });
    // }

    // 🔹 **2. Criar slug única**
    const generateSlug = (name: string) => {
      return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .replace(/-+/g, "-")
        .trim();
    };

    let slug = generateSlug(name);
    const originalSlug = slug;
    let count = 1;

    while (await db.memoriaProfiles.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${count}`;
      count++;
    }

    // 🔹 **3. Criar o perfil no banco**
    const profile = await db.memoriaProfiles.create({
      data: {
        slug,
        name,
        biography,
        birthday: birthday ? new Date(birthday) : null,
        deathday: deathday ? new Date(deathday) : null,
        videoUrl,
        userId,
        plan: plan === "Basic" ? "Basic" : "Premium",
      },
    });


    // 🔹 **4. Processar e salvar múltiplas imagens**
    const imageUrls: string[] = [];

    if (files.images) {
      const imagesArray = Array.isArray(files.images) ? files.images : [files.images];

      imagesArray.forEach((file) => {
        const filePath = `/photos/${path.basename(file.filepath)}`;
        imageUrls.push(filePath);
      });

      // **Salvar as imagens no banco de dados**
      await Promise.all(
        imageUrls.map((imageUrl) =>
          db.profilePhotos.create({
            data: {
              profileId: profile.id,
              imageUrl,
            },
          })
        )
      );
    }

    return res.status(201).json({ profile, imageUrls });
  } catch (error) {
    console.error("Erro ao criar o perfil:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
