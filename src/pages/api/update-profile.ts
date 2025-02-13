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

    const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const biography = Array.isArray(fields.biography) ? fields.biography[0] : fields.biography;
    const birthday = Array.isArray(fields.birthday) ? fields.birthday[0] : fields.birthday;
    const deathday = Array.isArray(fields.deathday) ? fields.deathday[0] : fields.deathday;
    const videoUrl = Array.isArray(fields.videoUrl) ? fields.videoUrl[0] : fields.videoUrl;
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;

    if (!name || !userId) {
      return res.status(400).json({ error: "Nome e usuário são obrigatórios." });
    }
    const profile = await db.memoriaProfiles.update({
        where: { id },
      data: {
        name,
        biography,
        birthday: birthday ? new Date(birthday) : null,
        deathday: deathday ? new Date(deathday) : null,
        videoUrl,
        userId,
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
