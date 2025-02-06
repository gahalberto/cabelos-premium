// import multer from 'multer';
// import path from 'path';
// import { NextApiRequestWithFiles } from '@/app/types/next-env'; // Supondo que você crie essa tipagem personalizada
// import type { NextApiResponse } from 'next';
// import { db } from '@/app/_lib/prisma';
// import fs from 'fs';
// import { promisify } from 'util';
// import { v4 as uuidv4 } from 'uuid';

// const mkdir = promisify(fs.mkdir);

// // Configurar o armazenamento e limites de upload
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), 'public/uploads');

//     try {
//       // Verificar se o diretório existe, se não, criar
//       await mkdir(uploadDir, { recursive: true });
//     } catch (err) {
//       // Diretório já existe ou erro ao criar
//     }

//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName); // Salva apenas o nome do arquivo
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

// // Desativar o bodyParser padrão do Next.js
// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

// // API de Upload de imagens
// export default async function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Método não permitido' });
//   }

//   // Executar middleware do Multer
//   await runMiddleware(req, res, upload.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'images', maxCount: 10 }]));

//   try {
//     const { profileId } = req.query as { profileId: string };

//     // Salvar apenas os nomes dos arquivos
//     const profileImg = req.files?.profileImg ? req.files.profileImg[0].filename : null; 
//     const images = req.files?.images ? req.files.images.map(file => file.filename) : [];

//     // Atualizar banco de dados
//     await db.memoriaProfiles.update({
//       where: { id: profileId },
//       data: {
//         profileImg,  // Nome da imagem de perfil
//         images       // Nomes das imagens
//       }
//     });

//     res.status(200).json({ message: 'Upload realizado com sucesso!', profileImg, images });
//   } catch (error) {
//     console.error('Erro ao fazer upload:', error);
//     res.status(500).json({ message: 'Erro ao fazer upload' });
//   }
// }
