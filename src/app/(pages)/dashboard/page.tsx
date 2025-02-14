"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { CardContent, Skeleton } from "@mui/material";
import { getProfilesByUser } from "@/app/_actions/getProfilesByUser";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { MemoriaProfiles, ProfilePhotos } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Link2,
  QrCode,
  Edit,
  Eye,
  X,
  Download,
  Share2,
  Copy,
  LinkedinIcon,
} from "lucide-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaFacebook, FaTwitter } from "react-icons/fa";

type ProfileType = MemoriaProfiles & {
  ProfilePhotos: ProfilePhotos[];
};

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const qrRef = useRef<HTMLCanvasElement>(null); // Referência para o QR Code

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      getProfilesByUser(session.user.id).then(setProfiles);
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current;
      const image = canvas.toDataURL("image/png"); // Converte para PNG
      const link = document.createElement("a");
      link.href = image;
      link.download = "qrcode.png";
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-800/50 shadow-xl">
        <h1 className="text-2xl font-light mb-4 md:mb-0">
          Olá{" "}
          <span className="font-semibold text-blue-300">
            {session?.user.name}
          </span>
          , bem-vindo ao seu memorial!
        </h1>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 transition-colors">
          <PlusCircle size={18} />
          Criar Novo Perfil
        </Button>
      </header>

      <main className="container mx-auto px-4 py-8">
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => {
                      const shareUrl = `https://inmemorian.com.br/${profile.slug}`;
                      const shareText = `Veja esse memorial incrível: ${shareUrl}`;              
              return (
              <Card
                key={profile.id}
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all group"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        className="w-20 h-20 rounded-full object-cover border-4 border-slate-700 group-hover:border-blue-500 transition-colors"
                        src={
                          profile.ProfilePhotos?.[0]?.imageUrl ||
                          "/images/no-avatar.webp"
                        }
                        alt="Imagem do perfil"
                        width={96}
                        height={96}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-blue-100">
                        {profile.name}
                      </CardTitle>
                      <div className="text-sm text-slate-400 mt-1">
                        <p>{profile.birthday?.toLocaleDateString()}</p>
                        <p>{profile.deathday?.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/${profile.slug}`}>
                      <Button
                        variant="outline"
                        className="gap-2 text-blue-100 border-slate-600 hover:bg-blue-900/20"
                      >
                        <Eye size={16} />
                        Visualizar
                      </Button>
                    </Link>
                    <Link href={`/dashboard/profile/${profile.id}`}>
                      <Button
                        variant="outline"
                        className="gap-2 text-blue-100 border-slate-600 hover:bg-blue-900/20"
                      >
                        <Edit size={16} />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="gap-2 text-blue-100 border-slate-600 hover:bg-blue-900/20"
                    >
                      <Link2 size={16} />
                      Link
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-blue-100 border-slate-600 hover:bg-blue-900/20"
                      onClick={() =>
                        setQrUrl(`https://inmemorian.com.br/${profile.slug}`)
                      }
                    >
                      <QrCode size={16} />
                      QR Code
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-blue-100 border-green-500 hover:bg-blue-900/20"
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <Share2 size={16} />
                            Compartilhar
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
                              window.open(
                                `https://wa.me/?text=${shareText}`,
                                "_blank"
                              )
                            }
                          >
                            <Share2 size={18} /> WhatsApp
                          </Button>

                          <Button
                            variant="outline"
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-200"
                            onClick={() => {
                              navigator.clipboard.writeText(shareUrl);
                              alert(
                                "Link copiado para a área de transferência!"
                              );
                            }}
                          >
                            <Copy size={18} /> Copiar Link
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </Button>
                  </div>
                </CardContent>
              </Card>
)})}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Image
              src="/images/empty-state.svg"
              alt="Nenhum perfil encontrado"
              width={200}
              height={200}
              className="opacity-75"
            />
            <p className="text-xl text-slate-400">Nenhum memorial encontrado</p>
            <p className="text-slate-500">
              Comece criando seu primeiro perfil memorial
            </p>
          </div>
        )}
      </main>

      {/* Modal QR Code */}
      {qrUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setQrUrl(null)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              QR Code para o perfil
            </h2>
            <QRCodeCanvas ref={qrRef} value={qrUrl} size={200} />
            <p className="text-gray-600 mt-4">{qrUrl}</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={downloadQRCode}
            >
              <Download size={16} />
              Baixar QR Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
