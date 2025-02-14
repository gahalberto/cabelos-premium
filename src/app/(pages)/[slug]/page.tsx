"use client";
import Image from "next/image";
import {
  FaCamera,
  FaFacebook,
  FaHeart,
  FaHome,
  FaTwitter,
} from "react-icons/fa";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  MemoriaProfiles,
  ProfilePhotos,
  ProfileTributes,
} from "@prisma/client";
import { getProfilesBySlug } from "@/app/_actions/getProfileBySlug";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTribute } from "@/app/_actions/saveTribute";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Copy, LinkedinIcon, Share2 } from "lucide-react";
import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";

type ParamsType = {
  params: {
    slug: string;
  };
};

type MemoriaProfilesType = MemoriaProfiles & {
  ProfilePhotos: ProfilePhotos[];
  ProfileTributes?: ProfileTributes[];
};

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = (await params).slug
 
  // fetch data
  const profile = await getProfilesBySlug(slug);
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: profile?.name,
    openGraph: {
      images: `http://inmemorian.com.br/${profile?.profileImg}`,
    },
  }
}


// Schema de validação com Zod
const TributeSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório"),
  email: z.string().email({ message: "E-mail inválido" }),
  message: z
    .string({ required_error: "Mensagem é obrigatória" })
    .min(1, "Mensagem é obrigatória"),
});

type TributeFormData = z.infer<typeof TributeSchema>;

const ProfilePage = ({ params }: ParamsType) => {
  const { slug } = params;
  const [profile, setProfile] = useState<MemoriaProfilesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("inicio");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false); // Estado para controlar o Dialog da foto
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Estado para armazenar a imagem selecionada
  const { toast } = useToast();
  const shareUrl = profile?.slug
    ? `https://inmemorian.com.br/${profile.slug}`
    : "#";
  const shareText = `Veja esse memorial incrível: ${shareUrl}`;

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfilesBySlug(params.slug);
      setProfile(data);
      if (data?.name) {
        document.title = `${data.name} - InMemorian`;
      }
    };
    fetchProfile();
  }, [params.slug]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TributeFormData>({
    resolver: zodResolver(TributeSchema),
  });

  // Função para enviar o tributo
  const onSubmit: SubmitHandler<TributeFormData> = async (data) => {
    try {
      if (profile?.id === undefined) return;
      await CreateTribute({
        data: { ...data, profileId: profile?.id },
      });
      reset();
      setDialogOpen(false);
      toast({
        variant: "default",
        title: "Tributo salvo com sucesso!",
        className: "bg-green-500 text-white",
        description: new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error("Erro ao enviar tributo:", error);
      alert("Ocorreu um erro ao enviar o tributo.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const data = await getProfilesBySlug(slug);
      setProfile(data);
      setIsLoading(false);
    };
    fetchProfile();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-center text-gray-500 mt-10">Perfil não encontrado</p>
    );
  }

  return (
    <>
{profile && (
  <Head>
    <title>{profile.name} - InMemorian</title>
    <meta
      name="description"
      content={profile.biography || "Eternize as memórias de quem você ama."}
    />

    {/* Open Graph para Facebook e WhatsApp */}
    <meta
      property="og:title"
      content={`${profile.name} - InMemorian`}
    />
    <meta
      property="og:description"
      content={profile.biography || "Eternize as memórias de quem você ama."}
    />
    <meta
      property="og:image"
      content={profile.profileImg || "/images/no-avatar.webp"}
    />
    <meta
      property="og:url"
      content={`https://inmemorian.com.br/${profile.slug}`}
    />
    <meta property="og:type" content="website" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content={`${profile.name} - InMemorian`}
    />
    <meta
      name="twitter:description"
      content={profile.biography || "Eternize as memórias de quem você ama."}
    />
    <meta
      name="twitter:image"
      content={profile.profileImg || "/images/no-avatar.webp"}
    />
  </Head>
)}
      <div className="mx-0">
        <div className="relative h-64 w-full">
          <Image
            src={`/images/capa.jpg`}
            alt="Profile Image"
            fill
            className="w-full rounded-b-xl object-cover"
          />
        </div>

        <div className="relative mx-auto -mt-24 w-36">
          <Image
            src={profile.profileImg || "/images/no-avatar.webp"}
            alt="Foto de perfil"
            width={200}
            height={200}
            className="h-36 w-36 rounded-full border-4 border-white object-cover"
          />
        </div>

        {/* Seções */}
        <div className="mt-8 px-4">
          {activeSection === "inicio" && (
            <div className="text-center mt-6 px-4">
              <h1 className="text-3xl font-bold font-cinzel">
                {profile.name || "Huilton Nascimento"}
              </h1>
              <p className="text-gray-500 mt-2">
                {profile.birthday ? format(profile.birthday, "dd/MM/yyyy") : ""}
                {profile.deathday &&
                  ` - ${format(profile.deathday, "dd/MM/yyyy")}`}
              </p>
              <p className="italic text-gray-700 mt-2">
                Não viva para que a sua presença seja notada, mas para que a sua
                falta seja sentida
              </p>
              <div className="mt-8">
                <p className="text text-gray-700 leading-relaxed pb-10">
                  {profile.biography ||
                    `Huiltoon Nascimento foi um homem de estrada...`}
                </p>
              </div>
            </div>
          )}

          {activeSection === "galeria" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Galeria de Fotos</h2>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {profile.ProfilePhotos.map(({ imageUrl }, index) => (
                  <div key={index}>
                    <Image
                      className="h-40 w-full mb-4 max-w-full rounded-lg object-cover object-center cursor-pointer"
                      src={imageUrl}
                      width={100}
                      height={100}
                      alt="gallery-photo"
                      onClick={() => {
                        setSelectedImage(imageUrl); // Define a imagem selecionada
                        setImageDialogOpen(true); // Abre o Dialog
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Dialog para exibir a foto em tamanho maior */}
              <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="sm:max-w-[90%] md:max-w-[70%] lg:max-w-[50%] rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Foto</DialogTitle>
                  </DialogHeader>
                  <div className="relative w-full h-[50vh]">
                    <Image
                      src={selectedImage || "/images/no-avatar.webp"} // Exibe a imagem selecionada
                      alt="Foto em tamanho maior"
                      fill
                      className="rounded-lg object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeSection === "tributos" && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold mb-4">Tributos/Mensagens</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => setDialogOpen(true)}
                    >
                      Deixar uma mensagem
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white rounded-xl">
                    <DialogHeader>
                      <DialogTitle>Escrever Tributo</DialogTitle>
                      <DialogDescription>
                        Deixe a sua eterna mensagem para {profile.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Nome
                          </Label>
                          <Input
                            id="name"
                            {...register("name")}
                            className="col-span-3"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm col-span-4 text-right">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            E-mail
                          </Label>
                          <Input
                            id="email"
                            {...register("email")}
                            className="col-span-3"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm col-span-4 text-right">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="message" className="text-right">
                            Mensagem
                          </Label>
                          <Textarea
                            id="message"
                            {...register("message")}
                            className="col-span-3"
                          />
                          {errors.message && (
                            <p className="text-red-500 text-sm col-span-4 text-right">
                              {errors.message.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Enviar Tributo</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4">
                {profile.ProfileTributes?.map((tribute) => (
                  <div
                    key={tribute.id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <p className="font-semibold">{tribute.name}</p>
                    <p className="text-gray-700">{tribute.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navegação Inferior */}
        <div className="fixed w-full bottom-0 left-0 right-0 bg-slate-900 text-white shadow p-4 space-x-12 border-t">
          <div className="flex justify-center space-x-12">
            <button
              className={`flex flex-col items-center ${
                activeSection === "inicio" ? "text-blue-500" : "text-white"
              }`}
              onClick={() => setActiveSection("inicio")}
            >
              <FaHome className="text-2xl" />
              <p className="text-sm">Início</p>
            </button>
            <button
              className={`flex flex-col items-center ${
                activeSection === "galeria" ? "text-blue-500" : "text-white"
              }`}
              onClick={() => setActiveSection("galeria")}
            >
              <FaCamera className="text-2xl" />
              <p className="text-sm">Galeria</p>
            </button>
            <button
              className={`flex flex-col items-center ${
                activeSection === "tributos" ? "text-blue-500" : "text-white"
              }`}
              onClick={() => setActiveSection("tributos")}
            >
              <FaHeart className="text-2xl" />
              <p className="text-sm">Tributos</p>
            </button>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="gap-2 text-blue-100 border-green-500 hover:bg-blue-900/20"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Share2 size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-white p-3 rounded-lg shadow-md flex flex-col space-y-2">
            <h3 className="text-gray-800 text-sm font-semibold mb-2">
              Compartilhar perfil
            </h3>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-blue-600 hover:bg-blue-100"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  "_blank"
                )
              }
            >
              <FaFacebook size={18} /> Facebook
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-blue-400 hover:bg-blue-100"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${shareText}`,
                  "_blank"
                )
              }
            >
              <FaTwitter size={18} /> Twitter
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-blue-700 hover:bg-blue-100"
              onClick={() =>
                window.open(
                  `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`,
                  "_blank"
                )
              }
            >
              <LinkedinIcon size={18} /> LinkedIn
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-green-500 hover:bg-green-100"
              onClick={() =>
                window.open(`https://wa.me/?text=${shareText}`, "_blank")
              }
            >
              <Share2 size={18} /> WhatsApp
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-200"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Link copiado para a área de transferência!");
              }}
            >
              <Copy size={18} /> Copiar Link
            </Button>
          </PopoverContent>
        </Popover>
      </Button>
    </>
  );
};

export default ProfilePage;
