import Image from 'next/image';
import { FaInfoCircle, FaHistory, FaCamera, FaHeart } from 'react-icons/fa'; // Importa os ícones
import { db } from '../_lib/prisma';

type ParamsType = {
  params: {
    id: string;
  };
};

const ProfilePage = async ({ params }: ParamsType) => {
  const { id } = params;

  // Carregar dados com base no `id`, aqui estou simulando a busca do perfil
  const profile = await db.memoriaProfiles.findUnique({
    where: {
      id
    }
  });

  if (!profile) {
    return <p>Perfil não encontrado</p>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Cabeçalho com imagem e nome */}
      <div className="text-center">
        <div className="relative h-64 w-full">
          {/* <Image
            src={profile.name}
            alt={`${profile.name}'s Profile Image`}
            fill
            className="rounded-lg object-cover"
          /> */}
        </div>
        <div className="relative -mt-12">
          {/* <Image
            src={profile.imageUrl}
            alt={profile.name}
            width={120}
            height={120}
            className={`rounded-full border-4 border-white mx-auto`}
          /> */}
        </div>
        <h1 className="text-3xl font-bold mt-4">{profile.name}</h1>
        <p className="text-gray-500">
          {profile.birthDate} - {profile.deathDate}
        </p>
        <p className="italic text-gray-700 mt-2">{profile.quote}</p>
      </div>

      {/* Biografia */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Biography</h2>
        <p className="text-lg text-gray-800 leading-relaxed">
          {profile.biography}
        </p>
      </div>

      {/* Rodapé com Navegação (Biografia, Linha do Tempo, Mídia, Tributo) */}
      <div className="fixed bottom-0 left-0 right-0 bg-orange-400 text-white shadow p-4 flex justify-around border-t">
        <button className="text-center" aria-label="Biography" title="Biography">
          <FaInfoCircle className="text-2xl" />
          <p className="text-sm">Biography</p>
        </button>
        <button className="text-center" aria-label="Timeline" title="Timeline">
          <FaHistory className="text-2xl" />
          <p className="text-sm">Timeline</p>
        </button>
        <button className="text-center" aria-label="Media" title="Media">
          <FaCamera className="text-2xl" />
          <p className="text-sm">Media</p>
        </button>
        <button className="text-center" aria-label="Tribute" title="Tribute">
          <FaHeart className="text-2xl" />
          <p className="text-sm">Tribute</p>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;