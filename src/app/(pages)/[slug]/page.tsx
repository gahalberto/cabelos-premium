import { getProfilesBySlug } from "@/app/_actions/getProfileBySlug";
import ProfileComponent from "./ProfileComponent";
import { Metadata } from "next";

type ParamsType = {
  params: {
    slug: string;
  };
};

// Função para gerar metadados dinâmicos
export async function generateMetadata({ params }: ParamsType): Promise<Metadata> {
  const profile = await getProfilesBySlug(params.slug);

  if (!profile) {
    return {
      title: "Perfil não encontrado - InMemorian",
      description: "Perfil não encontrado.",
    };
  }

  const title = `${profile.name} - InMemorian`;
  const description = profile.biography || "Eternize as memórias de quem você ama.";
  const imageUrl = profile.profileImg
    ? `https://inmemorian.com.br/${profile.profileImg}` // URL absoluta
    : "https://inmemorian.com.br/images/no-avatar.webp"; // Imagem padrão
  const pageUrl = `https://inmemorian.com.br/${profile.slug}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [{ url: imageUrl }],
      url: pageUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [{ url: imageUrl }],
    },
  };
}

export default async function ProfilePage({ params }: ParamsType) {
  const profile = await getProfilesBySlug(params.slug);

  if (!profile) {
    return <p>Profile not found</p>;
  }

  return <ProfileComponent profile={profile} />;
}