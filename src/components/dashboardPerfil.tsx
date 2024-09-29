import Image from "next/image";
import { FollowerPointerCard } from "./ui/following-pointer";

type ProfilePropsType = {
    profile: {
        id: string;
        name: string;
        birthDate: string;
        deathDate: string;
        biography: string;
        imageUrl: string;
        status: string
    };
};

export function FollowingPointerDemo({ profile }: ProfilePropsType) {
    return (
        <div className="w-80 mx-auto">
            <FollowerPointerCard
                title={
                    <TitleComponent title={profile.name} avatar={profile.imageUrl} />
                }
            >
                <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
                    <div className="w-full aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
                        <Image
                            src={profile.imageUrl}
                            alt="thumbnail"
                            layout="fill"
                            objectFit="cover"
                            className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 `}
                        />
                    </div>
                    <div className="p-4">
                        <h2 className="font-bold my-4 text-lg text-zinc-700">
                            {profile.name}
                        </h2>
                        <h2 className="font-normal my-4 text-sm text-zinc-500">
                        {(profile.status === 'Paid' && profile.name == '') ? 'Seu perfil foi aprovado, comece agora mesmo editando abaixo!' : `${profile.biography.slice(0, 100)}...`}
                        {(profile.status === 'Pending') ? 'O Pagamento do seu perfil está pendente! Tente novamente mais tarde, enviaremos um  e-mail quando for aprovado! Mas enquanto isso você pode começar a editar o perfil!' : `${profile.biography.slice(0, 100)}...`}
                        </h2>
                        <div className="flex flex-row justify-between items-center mt-10">
                            <span className="text-sm text-gray-500">

                            

                            </span>
                            <div className="relative z-10 px-6 py-2 bg-black text-white font-bold rounded-xl block text-xs">
                            {profile.name != '' ? 'Editar Perfil' : 'Finalize o perfil '}
                            </div>
                        </div>
                    </div>
                </div>
            </FollowerPointerCard>
        </div>
    );
}

const TitleComponent = ({
    title,
    avatar,
}: {
    title: string;
    avatar: string;
}) => (
    <div className="flex space-x-2 items-center">
        <Image
            src={avatar}
            height="20"
            width="20"
            alt="thumbnail"
            className="rounded-full border-2 border-white"
        />
        <p>{title}</p>
    </div>
);
