  "use client";
  import { getProfilesByUser } from "@/app/_actions/getProfilesByUser";
  import { FollowingPointerDemo } from "@/components/dashboardPerfil";
  import { Button } from "@mui/material";
  import { MemoriaProfiles } from "@prisma/client";
  import { useSession } from "next-auth/react";
  import { useEffect, useState } from "react";

  const DashboardPage = () => {
    const { data: session, status } = useSession();
    const [profiles, setProfiles] = useState<MemoriaProfiles[]>([]);

    useEffect(() => {
      const fetchProfiles = async () => {
        if (session?.user.id) {
          const profiles = await getProfilesByUser(session.user.id);
          setProfiles(profiles);
        }
      };

      if (status === "authenticated") {
        fetchProfiles();
      }
    }, [status, session]);

    if (status === "loading") {
      return <div>Carregando...</div>;
    }

    return (
      <div className="mt-14 bg-teal-50">
        {/* Contêiner flex para o título e botão */}
        <div className="flex justify-between items-center mb-10 px-4">
          <div className="text-xl font-roboto">Seus Perfis</div>
          <Button variant="contained" color="primary">Criar Perfil</Button>
        </div>

        {/* Perfis */}
        {profiles.map((item, index) => (
          <div
            key={index}
            className="h-[40rem] relative space-y-4 flex-col items-center justify-center"
          >
            <FollowingPointerDemo
              profile={{
                id: item.id,
                name: item.name,
                birthDate: item.birthday.toLocaleDateString(), // Exibindo as datas formatadas
                deathDate: item.deathday.toLocaleDateString(),
                biography: item.biography ?? "", // Atribui uma string vazia se biography for null
                imageUrl: item.profileImg ?? "", // Ajustar para a imagem real
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  export default DashboardPage;
