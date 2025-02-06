// import multer from 'multer';
// import path from 'path';
// import { NextApiRequestWithFiles } from '@/app/types/next-env';
// import type { NextApiResponse } from 'next';
// import { db } from '@/app/_lib/prisma';
// import fs from 'fs';
// import { promisify } from 'util';
// import { v4 as uuidv4 } from 'uuid';

// const mkdir = promisify(fs.mkdir);

// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), 'public/uploads');
//     try {
//       await mkdir(uploadDir, { recursive: true });
//     } catch (err) {
//       // Diretório já existe ou erro ao criar
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage: storage });

// const runMiddleware = (req: NextApiRequestWithFiles, res: NextApiResponse, fn: Function) => {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result: any) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// };

// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

// export default async function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Método não permitido' });
//   }

//   await runMiddleware(req, res, upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'images', maxCount: 10 }]));

//   try {
//     const { profileId } = req.query as { profileId: string };
    
//     // Busca o perfil atual para obter as imagens existentes
//     const existingProfile = await db.memoriaProfiles.findUnique({
//       where: { id: profileId },
//       select: { images: true }
//     });

//     // Processa a imagem de perfil
//     const profileImg = req.files?.profileImg ? req.files.profileImg[0].path.replace('public/', '') : null;

//     // Processa novas imagens
//     const newImages = req.files?.images ? req.files.images.map(file => file.path.replace('public/', '')) : [];

//     // Se houver imagens existentes no banco, concatene com as novas, caso contrário, use apenas as novas
//     const updatedImages = existingProfile?.images ? [...existingProfile.images, ...newImages] : newImages;

//     // Atualiza o perfil no banco de dados
//     await db.memoriaProfiles.update({
//       where: { id: profileId },
//       data: {
//         profileImg: profileImg || undefined, // Atualiza o profileImg apenas se um novo for enviado
//         images: updatedImages // Sempre atualiza o campo `images`
//       }
//     });

//     res.status(200).json({ message: 'Upload realizado com sucesso!', profileImg, images: updatedImages });
//   } catch (error) {
//     console.error('Erro ao fazer upload:', error);
//     res.status(500).json({ message: 'Erro ao fazer upload' });
//   }
// }
