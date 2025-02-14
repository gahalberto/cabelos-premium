"use client";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Trash2 } from "lucide-react";
import { MemoriaProfiles, ProfilePhotos } from "@prisma/client";
import Image from "next/image";
import { DeleteImage } from "@/app/_actions/deleteImage";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MakeAvatarPhoto } from "@/app/_actions/MakeAvatarPhoto";

type PropsType = {
  profile: MemoriaProfiles & {
    ProfilePhotos: ProfilePhotos[];
  };
};

interface DatePickerProps {
  label: string;
  date: Date | null;
  setDate: (date: Date | null) => void;
}

const EditPerfilForm = ({ profile }: PropsType) => {
  const router = useRouter();
  const [name, setName] = useState(profile.name || "");
  const [birthday, setBirthday] = useState<Date | null>(profile.birthday ? new Date(profile.birthday) : null);
  const [deathday, setDeathday] = useState<Date | null>(profile.deathday ? new Date(profile.deathday) : null);
  const [biography, setBiography] = useState(profile.biography || "");
  const [musicLink, setMusicLink] = useState(profile.videoUrl || "");
  const [images, setImages] = useState(profile.ProfilePhotos || []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 9) {
      alert("Você pode enviar no máximo 9 imagens.");
      return;
    }

    const maxImages = profile.plan === "Basic" ? 3 : 9;
    const totalImages = images.length + files.length; // Total de imagens já enviadas + novas

    if (totalImages > maxImages) {
      alert(`Seu plano ${profile.plan}, Você só pode enviar no máximo ${maxImages} imagens.`);
      return; 
    }

    setSelectedFiles(Array.from(files)); // Armazena os arquivos para envio posterior
    setImageUrls(Array.from(files).map((file) => URL.createObjectURL(file))); // Cria prévias das imagens
  };

  const handleDeleteImage = async (imageId: number) => {
    setImages(images.filter((img) => img.id !== imageId));
    await DeleteImage(imageId);
  };

  const handleAvatarPhoto = async (id: string, profileImg: string) => {
    const update = await MakeAvatarPhoto(id, profileImg);
    if (update) {
      router.push(`/dashboard/profile/${profile.id}`);
    }
  }

  const handleUpdateButton = async () => {
    const formData = new FormData();
    formData.append("id", profile.id);
    formData.append("name", name);
    formData.append("birthday", birthday?.toISOString() || "");
    formData.append("deathday", deathday?.toISOString() || "");
    formData.append("biography", biography);
    formData.append("videoUrl", musicLink);
    formData.append("userId", profile.userId);

    // Adiciona as imagens ao FormData
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Envia os dados para a API
    const response = await axios.post("/api/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response) {
      router.push(`/dashboard/profile/${profile.id}`);
    }
  };

  return (
    <div className="w-full min-h-screen pt-4 bg-[#030D20]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left">
          Editar Memorial
        </h1>

        {/* Formulário e Galeria */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Coluna do Formulário */}
          <div className="space-y-6">
            {/* Nome */}
            <div className="space-y-1">
              <Label className="text-white text-sm">Nome do falecido:</Label>
              <Input
                type="text"
                placeholder="Ex: Huilton Nascimento"
                className="text-white border-red-500 focus:border-yellow-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker label="Data de nascimento:" date={birthday} setDate={setBirthday} />
              <DatePicker label="Data de falecimento:" date={deathday} setDate={setDeathday} />
            </div>

            {/* Biografia */}
            <div className="space-y-2">
              <Label className="text-white text-sm">Biografia/Mensagem:</Label>
              <Textarea
                placeholder="Digite aqui sua mensagem ou biografia."
                className="h-40 text-white border-red-500 focus:border-yellow-400"
                maxLength={2000}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
            </div>

            {/* Link da Música */}
            <div className="space-y-1">
              <Label className="text-white text-sm">Link da música (YouTube/Spotify):</Label>
              <Input
                type="url"
                placeholder="Cole o link da música aqui"
                className="text-white border-red-500 focus:border-yellow-400"
                value={musicLink}
                onChange={(e) => setMusicLink(e.target.value)}
              />
            </div>
          </div>

          {/* Coluna das Imagens */}
          <div className="space-y-6">
            {/* Upload de Novas Fotos */}
            <div className="space-y-2">
              <Label className="text-white">Escolher novas fotos</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-white w-full border-red-500 focus:border-yellow-400"
                multiple
              />
            </div>

            {/* Galeria de Fotos Atuais */}
            <div className="space-y-2">
              <Label className="text-white">Fotos atuais</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative aspect-square">
                    <Image
                      src={img.imageUrl}
                      alt="Foto"
                      fill
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className={`absolute text-xs top-1 left-1 
                        ${profile.profileImg === img.imageUrl ? "bg-green-600" : "bg-red-600"}
                        text-white p-1 rounded-sm hover:bg-red-700 transition-colors`}
                      onClick={() => handleAvatarPhoto(profile.id, img.imageUrl)}
                    >
                      Tornar Foto Principal
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-center md:justify-start">
          <Button
            onClick={handleUpdateButton}
            className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 text-lg"
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  );
};

const DatePicker = ({ label, date, setDate }: DatePickerProps) => (
  <div className="flex flex-col">
    <Label className="text-white mb-2 text-sm">{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal text-white border-red-500 hover:border-yellow-400 ${
            !date && "text-muted-foreground"
          }`}
        >
          <CalendarIcon className="mr-2" />
          {date ? format(date, "PPP", { locale: ptBR }) : "Escolha uma data"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(day) => setDate(day || null)}
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  </div>
);

export default EditPerfilForm;