"use client";

import { getProfilesByUser } from "@/app/_actions/getProfilesByUser";
import { FollowingPointerDemo } from "@/components/dashboardPerfil";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProfileType {
  id: string;
  name: string | null;
  birthday: Date | null;
  deathday: Date | null;
  biography: string | null;
  profileImg: string | null;
  orders?: { status: string }[]; // Adiciona o campo de orders para acessar status
}

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [profiles, setProfiles] = useState<ProfileType[]>([]);

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
      <div className="flex justify-between items-center mb-10 px-4">
        <div className="text-xl font-roboto">Seus Perfis</div>
        <Button variant="contained" color="primary">Criar Perfil</Button>
      </div>

      {profiles.map((item, index) => (
        <div
          key={index}
          className="h-[40rem] relative space-y-4 flex-col items-center justify-center"
        >
          <FollowingPointerDemo
            profile={{
              id: item.id,
              name: item.name || '',
              birthDate: item.birthday ? item.birthday.toLocaleDateString() : "",
              deathDate: item.deathday ? item.deathday.toLocaleDateString() : "",
              biography: item.biography ?? "",
              imageUrl: item.profileImg ?? "",
              status: item.orders?.[0]?.status ?? "Sem status", // Agora acessando o status da primeira ordem, se existir
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
