"use client"
import { Button, Card, CardContent, CardHeader, ImageList, ImageListItem } from "@mui/material";
import { CardDescription, CardTitle } from "./ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useEffect, useState } from "react";
import { fetchProfileData } from "@/app/_actions/fetchProfileData";

const imageUploadSchema = z.object({
    profileImg: z.any().optional(), // Campo para imagem de perfil
    images: z.any().optional() // Campo para múltiplas imagens
})

type ProfilePropsType = {
    profileId: string
}

const formSchema = z.object({
    profileName: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    phrase: z.string(),
    biography: z.string().min(1, {
        message: "Escreva um resumo sobre seu ente-querido e deixe nossa inteligência artificial cuidar.",
    }),
    profileImg: z.any().optional(), // Campo para imagem de perfil
    images: z.any().optional(), // Campo para múltiplas imagens
    birthDay: z.number().min(1).max(31, { message: "Selecione um dia válido." }),
    birthMonth: z.number().min(1).max(12, { message: "Selecione um mês válido." }),
    birthYear: z.number().min(1900).max(new Date().getFullYear(), { message: "Selecione um ano válido." }),
    deathDay: z.number().min(1).max(31, { message: "Selecione um dia válido." }),
    deathMonth: z.number().min(1).max(12, { message: "Selecione um mês válido." }),
    deathYear: z.number().min(1900).max(new Date().getFullYear(), { message: "Selecione um ano válido." }),
})


const ImageUploud = ({ profileId }: ProfilePropsType) => {

    const { toast } = useToast()
    const [profileData, setProfileData] = useState<z.infer<typeof formSchema> | null>(null)

    useEffect(() => {
        async function loadProfileData() {
            try {
                const profile = await fetchProfileData(profileId);

                const birthday = profile.birthday ? new Date(profile.birthday) : new Date();
                const deathday = profile.deathday ? new Date(profile.deathday) : null;

                setProfileData({
                    profileName: profile.name || "",
                    phrase: profile.phrase || "",
                    biography: profile.biography || "",
                    birthDay: birthday.getDate(),
                    birthMonth: birthday.getMonth() + 1,
                    birthYear: birthday.getFullYear(),
                    deathDay: deathday ? deathday.getDate() : 1,
                    deathMonth: deathday ? deathday.getMonth() + 1 : 1,
                    deathYear: deathday ? deathday.getFullYear() : 1900,
                    images: profile.images || [] // Certifique-se de que está buscando as imagens corretamente
                });
            } catch (error) {
                console.error("Erro ao carregar os dados do perfil:", error);
            }
        }

        loadProfileData();
    }, [profileId]);

    const { register: imageRegister, handleSubmit: handleImageSubmit } = useForm<z.infer<typeof imageUploadSchema>>({
        resolver: zodResolver(imageUploadSchema),
    })

    async function onImageSubmit(values: z.infer<typeof imageUploadSchema>) {
        const formData = new FormData();

        if (values.profileImg && values.profileImg[0]) {
            formData.append("profileImg", values.profileImg[0] as File); // Imagem de perfil
        }

        if (values.images) {
            Array.from(values.images as File[]).forEach((image) => {
                formData.append("images", image); // Múltiplas imagens
            });
        }

        try {
            await fetch(`/api/profile/${profileId}`, {
                method: 'POST',
                body: formData,
            });

            toast({
                variant: "destructive",
                title: "Imagens Atualizadas com Sucesso",
                description: "As imagens foram atualizadas!",
                action: <ToastAction altText="Visualizar Perfil">Visualizar</ToastAction>,
            });
        } catch (error) {
            console.error("Erro ao atualizar as imagens:", error);
            toast({
                variant: "destructive",
                title: "Erro ao atualizar as imagens",
                description: "Ocorreu um problema ao tentar atualizar as imagens.",
                action: <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>,
            });
        }
    }

    return (
        <>
            {/* Card de Upload de Imagens */}
            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>Upload de Imagens</CardTitle>
                    <CardDescription>Envie a imagem de perfil e outras imagens.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleImageSubmit(onImageSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="profileImg">Imagem de Perfil</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...imageRegister('profileImg')}
                                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="images">Imagens Adicionais</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                {...imageRegister('images')}
                                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                            />
                        </div>

                        {/* Botão de Submissão */}
                        <Button type="submit" variant="contained" color="primary">
                            Atualizar Informações
                        </Button>
                    </form>

                    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                        {profileData?.images?.map((item: string, index: number) => (
                            <ImageListItem key={index}>
                                <img
                                    src={`/uploads/${item}`} // Corrigindo a fonte da imagem
                                    alt={`Imagem ${index + 1}`} // Dando um valor padrão para o alt
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </CardContent>
            </Card>

        </>
    )
}

export default ImageUploud;