/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ChangeEvent, useState } from "react";
import "aos/dist/aos.css";
import { format } from "date-fns";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/app/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ptBR } from "date-fns/locale";
import BrowserFrame from "./BrowserFrame";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMercadoPago from "@/app/hooks/useMercadoPago";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { registerUser } from "@/app/_actions/register/postRegister";

const CriarPerfil = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [deathDate, setDeathDate] = useState<Date | null>(null);
  const [bio, setBio] = useState("");
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setUserEmail] = useState("");
  // const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [musicLink, setMusicLink] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPlan, setSelectedPlan] = useState("Basic"); // 'basic' ou 'premium'
  const [price, setPrice] = useState(29); // Valor inicial para o plano 'basic'
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlanChange = (plan: any) => {
    setSelectedPlan(plan);
    setPrice(plan === "Basic" ? 29 : 49);
  };

  const { createCheckout } = useMercadoPago(); // ← Nome correto

  // Processar upload de imagens e armazenar arquivos no estado
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 9) {
      alert("Você pode enviar no máximo 9 imagens.");
      return;
    }

    setSelectedFiles(Array.from(files)); // Armazena os arquivos para envio posterior
    setImageUrls(Array.from(files).map((file) => URL.createObjectURL(file))); // Cria prévias das imagens
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.value;
    setName(inputName);
    setSlug(slugify(inputName));
  };

  const handleBioChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length <= 2000) {
      setBio(e.target.value);
    }
  };

  // Cria um perfil e envia as imagens junto
  const createAccount = async () => {
    setLoading(true);

    if (!name || !bio) {
      alert("Preencha as informações do formulário para a criação do perfil.");
      setLoading(false);
      return;
    }

    if (!userName || !email) {
      alert("Digite um nome e um e-mail para as opções de pagamento.");
      setLoading(false);
      return;
    }

    const newUser = await registerUser(email, name);

    const formattedBirthday = date ? date.toISOString() : "";
    const formattedDeathday = deathDate ? deathDate.toISOString() : "";

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("biography", bio);
      formData.append("birthday", formattedBirthday);
      formData.append("deathday", formattedDeathday);
      formData.append("videoUrl", musicLink);
      formData.append("userId", newUser.user.id);
      formData.append("plan", selectedPlan);

      // Adiciona as imagens ao FormData
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Envia os dados para a API
      const response = await axios.post("/api/create-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        console.log("Perfil criado com sucesso!", response.data);
        await createCheckout(userName, email, price);
      } else {
        alert("Erro ao criar perfil.");
      }
    } catch (error) {
      console.error("Erro ao criar o perfil:", error);
      alert("Erro ao criar o perfil.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#030D20]">
      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-8">
        {/* Coluna Esquerda - Formulário */}
        <div className="space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white">Quase lá!</h1>
            <p className="text-white mt-2 text-sm">
              Preencha os dados para criar o perfil
            </p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-600 text-white">
              <TabsTrigger
                className="bg-slate-700 text-black"
                value="basic"
                onClick={() => handlePlanChange("Basic")}
              >
                R$ 29 - Básico
              </TabsTrigger>
              <TabsTrigger
                className="bg-slate-700 text-black"
                value="premium"
                onClick={() => handlePlanChange("Premium")}
              >
                R$ 49 - Completo
              </TabsTrigger>
            </TabsList>

            {/* Aba R$29 */}
            <TabsContent value="basic" className="pt-4">
              <div className="mt-4 space-y-1">
                <Label className="text-white text-sm">Nome do falecido:</Label>
                <Input
                  type="email"
                  placeholder="Ex: Huilton Nascimento"
                  className="text-white border-red-500 focus-within:border-yellow-400"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="mt-4 flex gap-4">
                <div className="flex flex-col">
                  <Label className="text-white mb-2 text-sm">
                    Data de nascimento:
                  </Label>
                  <Input
                    type="date"
                    value={date ? date.toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDate(value ? new Date(value) : null); // Trata o caso de valor vazio
                    }}
                    className="text-white border-red-500 focus-within:border-yellow-400"
                  />
                </div>

                <div className="flex flex-col">
                  <Label className="text-white mb-2 text-sm">
                    Data de falecimento:
                  </Label>
                  <Input
                    type="date"
                    value={
                      deathDate ? deathDate.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setDeathDate(value ? new Date(value) : null); // Trata o caso de valor vazio
                    }}
                    className="text-white border-red-500 focus-within:border-yellow-400"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Label className="text-white mb-2 text-sm">
                  Biografia/Mensagem:
                </Label>
                <Textarea
                  placeholder="Digite aqui sua mensagem ou biografia."
                  className="h-40 text-white border-red-500 focus-within:border-yellow-400"
                  maxLength={2000}
                  value={bio}
                  onChange={handleBioChange}
                />
                <p className="text-gray-400 text-xs text-right">
                  {bio.length} / 2000 caracteres
                </p>
              </div>

              <div className="grid w-full items-center space-y-2 mt-4">
                <Label className="text-white" htmlFor="picture">
                  Escolher fotos (Máximo 3)
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-white w-full border-red-500 focus-within:border-yellow-400"
                  multiple
                />
              </div>
            </TabsContent>

            {/* Aba R$49 */}
            <TabsContent value="premium" className="pt-4">
              <div className="mt-4 space-y-1">
                <Label className="text-white text-sm">Nome do falecido:</Label>
                <Input
                  type="email"
                  placeholder="Ex: Huilton Nascimento"
                  className="text-white border-red-500 focus-within:border-yellow-400"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="mt-4 flex gap-4">
                <div className="flex flex-col">
                  <Label className="text-white mb-2 text-sm">
                    Data de nascimento:
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal text-white border-red-500 focus-within:border-yellow-400",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        
                        mode="single"
                        selected={date || undefined} // Converte `null` para `undefined`
                        onSelect={(day) => setDate(day || null)} // Converte `undefined` para `null`
                        initialFocus
                        locale={ptBR}
                      />{" "}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col">
                  <Label className="text-white mb-2 text-sm">
                    Data de falecimento:
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal text-white border-red-500 focus-within:border-yellow-400",
                          !deathDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {deathDate ? (
                          format(deathDate, "PPP")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deathDate || undefined} // Converte `null` para `undefined`
                        onSelect={(day) => setDeathDate(day || null)} // Converte `undefined` para `null`
                        initialFocus
                        locale={ptBR}
                      />{" "}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label className="text-white mb-2 text-sm">
                  Biografia/Mensagem:
                </Label>
                <Textarea
                  placeholder="Digite aqui sua mensagem ou biografia."
                  className="h-40 text-white border-red-500 focus-within:border-yellow-400"
                  maxLength={2000}
                  value={bio}
                  onChange={handleBioChange}
                />
                <p className="text-gray-400 text-xs text-right">
                  {bio.length} / 2000 caracteres
                </p>
              </div>

              <div className="grid w-full items-center space-y-2 mt-4">
                <Label className="text-white" htmlFor="picture">
                  Escolher fotos (Máximo 3)
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-white w-full border-red-500 focus-within:border-yellow-400"
                  multiple
                />
              </div>

              {/* Campo adicional para música */}
              <div className="mt-4 space-y-1">
                <Label className="text-white text-sm">
                  Link da música (YouTube/Spotify):
                </Label>
                <Input
                  type="url"
                  placeholder="Cole o link da música aqui"
                  className="text-white border-red-500 focus-within:border-yellow-400"
                  value={musicLink}
                  onChange={(e) => setMusicLink(e.target.value)}
                />
                <p className="text-gray-400 text-xs mt-1">
                  Exemplo: https://youtube.com/watch?v=...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-col justify-center items-center space-y-8 sticky top-4 ">
          <BrowserFrame slug={slug}>
            <div className="mx-0">
              <div className="relative h-64 w-full">
                <Image
                  src={`/images/capa.jpg`}
                  alt={`${imageUrl}'s Profile Image`}
                  fill
                  className="w-full rounded-b-xl object-cover"
                />
              </div>

              <div className="relative mx-auto -mt-24 w-36">
                <Image
                  src={imageUrl || "/images/no-avatar.webp"}
                  alt={name}
                  width={200}
                  height={200}
                  className="h-36 w-36 rounded-full border-4 border-white object-cover"
                />
              </div>

              <div className="text-center mt-6 px-4">
                <h1 className="text-3xl font-bold font-cinzel">
                  {name || "Huilton Nascimento"}
                </h1>
                <p className="text-gray-500 mt-2">
                  {date ? format(date, "dd/MM/yyyy") : ""}
                  {deathDate && ` - ${format(deathDate, "dd/MM/yyyy")}`}
                </p>
                <p className="italic text-gray-700 mt-2">
                  Não viva para que a sua presença seja notada, mas para que a
                  sua falta seja sentida
                </p>
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Biografia</h2>
                  <p className="text text-gray-700 leading-relaxed pb-10">
                    {bio || `Huilton Nascimento foi um homem de estrada...`}
                  </p>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                Criar Memorial e Receber QR CODE
              </Button>
            </DialogTrigger>

            <DialogContent className="flex flex-col  justify-center bg-white max-w-[90vw] md:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Finalizar Compra</DialogTitle>
                <DialogDescription>
                  Digite seu e-mail para receber acesso de edição
                </DialogDescription>
              </DialogHeader>
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-left">
                        Nome
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Pedro Pascal"
                        className="w-full"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-left">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full"
                        name={email}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => createAccount()}
                    className="w-full bg-blue-400 hover:bg-blue-700 text-white text-lg py-6"
                  >
                    Pagar com Mercado Pago
                  </Button>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CriarPerfil;
