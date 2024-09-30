"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, TextField, Button, MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { CardDescription, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { useEffect, useState } from "react"
import { EditProfile } from "@/app/_actions/editProfile"
import { fetchProfileData } from "@/app/_actions/fetchProfileData"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Definindo o esquema de validação com Zod
const formSchema = z.object({
    profileName: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    phrase: z.string(),
    biography: z.string().min(1, {
        message: "Escreva um resumo sobre seu ente-querido e deixe nossa inteligência artificial cuidar.",
    }),
    birthDay: z.number().min(1).max(31, { message: "Selecione um dia válido." }),
    birthMonth: z.number().min(1).max(12, { message: "Selecione um mês válido." }),
    birthYear: z.number().min(1900).max(new Date().getFullYear(), { message: "Selecione um ano válido." }),
    deathDay: z.number().min(1).max(31, { message: "Selecione um dia válido." }),
    deathMonth: z.number().min(1).max(12, { message: "Selecione um mês válido." }),
    deathYear: z.number().min(1900).max(new Date().getFullYear(), { message: "Selecione um ano válido." }),
})

type ProfilePropsType = {
    profileId: string
}

export function EditProfileForm({ profileId }: ProfilePropsType) {
    const { toast } = useToast()

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i)

    const [profileData, setProfileData] = useState<z.infer<typeof formSchema> | null>(null)

    const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    // Carregar dados do perfil quando o componente for montado
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
                });
            } catch (error) {
                console.error("Erro ao carregar os dados do perfil:", error);
            }
        }

        loadProfileData();
    }, [profileId])

    // Manipulador de submissão do formulário
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const birthday = new Date(values.birthYear, values.birthMonth - 1, values.birthDay)
        const deathday = new Date(values.deathYear, values.deathMonth - 1, values.deathDay)

        const profileData = {
            profileName: values.profileName,
            biography: values.biography,
            phrase: values.phrase,
            birthday,
            deathday,
        }

        try {
            await EditProfile({ profileId, profileData })
            // Exibir toast de sucesso
            toast({
                variant: "destructive",
                title: "Perfil Atualizado com Sucesso",
                description: "O perfil do seu ente-querido foi atualizado e você pode visualizar!",
                action: <ToastAction altText="Visualizar Perfil">Visualizar</ToastAction>,
            })
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error)
            // Exibir toast de erro
            toast({
                variant: "destructive",
                title: "Erro ao atualizar o perfil",
                description: "Ocorreu um problema ao tentar atualizar o perfil. Tente novamente.",
                action: <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>,
            })
        }
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Editar o perfil</CardTitle>
                    <CardDescription>Atualize as informações sobre seu ente querido.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Renderizar o formulário somente após carregar os dados */}
                    {profileData && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Campo Nome */}
                            <Controller
                                name="profileName"
                                control={control}
                                defaultValue={profileData.profileName}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="Nome do ente querido"
                                        variant="outlined"
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error ? fieldState.error.message : ""}
                                    />
                                )}
                            />

                            <Controller
                                name="phrase"
                                control={control}
                                defaultValue={profileData.phrase}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        {...field}
                                        placeholder="Escreva uma frase que descreve o ente."
                                    />
                                )}
                            />

                            {/* Campo Biografia */}
                            <Controller
                                name="biography"
                                control={control}
                                defaultValue={profileData.biography}
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Escreva um resumo sobre seu ente-querido e deixe nossa inteligência artificial cuidar."
                                        className="w-full p-2 border rounded"
                                    />
                                )}
                            />

                            {/* Seletor de Data de Nascimento */}
                            <div>
                                <label className="block mb-2">Data de Nascimento</label>
                                <div className="flex space-x-2">
                                    <Controller
                                        name="birthDay"
                                        control={control}
                                        defaultValue={profileData.birthDay}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={!!fieldState.error} fullWidth>
                                                <InputLabel>Dia</InputLabel>
                                                <Select {...field} label="Dia">
                                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                                        <MenuItem key={day} value={day}>
                                                            {day}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="birthMonth"
                                        control={control}
                                        defaultValue={profileData.birthMonth}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={!!fieldState.error} fullWidth>
                                                <InputLabel>Mês</InputLabel>
                                                <Select {...field} label="Mês">
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                                        <MenuItem key={month} value={month}>
                                                            {month}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="birthYear"
                                        control={control}
                                        defaultValue={profileData.birthYear}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={!!fieldState.error} fullWidth>
                                                <InputLabel>Ano</InputLabel>
                                                <Select {...field} label="Ano">
                                                    {years.map(year => (
                                                        <MenuItem key={year} value={year}>
                                                            {year}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Seletor de Data de Falecimento */}
                            <div>
                                <label className="block mb-2">Data de Falecimento</label>
                                <div className="flex space-x-2">
                                    <Controller
                                        name="deathDay"
                                        control={control}
                                        defaultValue={profileData.deathDay}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={!!fieldState.error} fullWidth>
                                                <InputLabel>Dia</InputLabel>
                                                <Select {...field} label="Dia">
                                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                                        <MenuItem key={day} value={day}>
                                                            {day}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="deathMonth"
                                        control={control}
                                        defaultValue={profileData.deathMonth}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={!!fieldState.error} fullWidth>
                                                <InputLabel>Mês</InputLabel>
                                                <Select {...field} label="Mês">
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                                        <MenuItem key={month} value={month}>
                                                            {month}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="deathYear"
                                        control={control}
                                        defaultValue={profileData.deathYear}
                                        render={({ field, fieldState }) => (
                                            <FormControl error={!!fieldState.error} fullWidth>
                                                <InputLabel>Ano</InputLabel>
                                                <Select {...field} label="Ano">
                                                    {years.map(year => (
                                                        <MenuItem key={year} value={year}>
                                                            {year}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
                                            </FormControl>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Botão de Submissão */}
                            <Button type="submit" variant="contained" color="primary">
                                Salvar
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
