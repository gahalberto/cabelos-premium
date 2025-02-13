import { getProfile } from "@/app/_actions/getProfileById";
import EditPerfilForm from "./EditarPerfil";
// import EditarPerfil from "./EditarPerfil";

type ParamsType = {
  params: {
    id: string
  };
}

export default async function ProfilePage({params}: ParamsType){
  const profile = await getProfile(params.id);
  return (
    <>
    <EditPerfilForm profile={profile} />
    </>
  );
}
