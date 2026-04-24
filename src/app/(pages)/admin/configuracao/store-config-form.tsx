"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Info, MessageCircle } from "lucide-react";
import { saveStoreConfig } from "@/app/_actions/admin/save-store-config";
import { useToast } from "@/hooks/use-toast";

interface WhatsappFields {
  whatsappMain: string;
  whatsappSP: string;
  whatsappRJ: string;
  whatsappMessage: string;
  phoneSP: string;
}

interface StoreConfigFormProps {
  initialThreshold: number;
  initialWhatsapp: WhatsappFields;
}

export function StoreConfigForm({ initialThreshold, initialWhatsapp }: StoreConfigFormProps) {
  const { toast } = useToast();
  const [threshold, setThreshold] = useState(
    initialThreshold > 0 ? String(initialThreshold) : ""
  );
  const [wa, setWa] = useState<WhatsappFields>(initialWhatsapp);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const value = threshold === "" ? 0 : parseFloat(threshold.replace(",", "."));
      if (isNaN(value) || value < 0) {
        toast({ title: "Valor inválido para frete grátis", variant: "destructive" });
        return;
      }
      await saveStoreConfig({ freeShippingThreshold: value, ...wa });
      toast({ title: "Configurações salvas com sucesso!" });
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Frete */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <Truck className="h-5 w-5 text-green-600" />
            Frete Grátis
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Valor mínimo do pedido para frete grátis. Zero = desativado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="threshold" className="text-gray-700 font-medium">
              Valor mínimo (R$)
            </Label>
            <div className="relative mt-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm select-none">R$</span>
              <Input
                id="threshold"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Info className="h-3 w-3" />
              {threshold && parseFloat(threshold.replace(",", ".")) > 0
                ? `Pedidos acima de R$ ${parseFloat(threshold.replace(",", ".")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} terão frete grátis.`
                : "Frete grátis desativado."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <MessageCircle className="h-5 w-5 text-green-500" />
            WhatsApp & Contato
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Números usados nos botões flutuante, produtos e página de contato. Use o formato internacional sem espaços: <strong>5511999990000</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="waMain">WhatsApp Principal</Label>
              <Input
                id="waMain"
                value={wa.whatsappMain}
                onChange={(e) => setWa({ ...wa, whatsappMain: e.target.value })}
                placeholder="5511912290102"
              />
              <p className="text-xs text-gray-400 mt-1">Botão flutuante e produtos "Sob Consulta"</p>
            </div>

            <div>
              <Label htmlFor="waSP">WhatsApp SP</Label>
              <Input
                id="waSP"
                value={wa.whatsappSP}
                onChange={(e) => setWa({ ...wa, whatsappSP: e.target.value })}
                placeholder="5511912290102"
              />
              <p className="text-xs text-gray-400 mt-1">Botão SP na homepage e página de contato</p>
            </div>

            <div>
              <Label htmlFor="waRJ">WhatsApp RJ</Label>
              <Input
                id="waRJ"
                value={wa.whatsappRJ}
                onChange={(e) => setWa({ ...wa, whatsappRJ: e.target.value })}
                placeholder="5521999990000"
              />
              <p className="text-xs text-gray-400 mt-1">Botão RJ na homepage e página de contato</p>
            </div>

            <div>
              <Label htmlFor="phoneSP">Telefone SP</Label>
              <Input
                id="phoneSP"
                value={wa.phoneSP}
                onChange={(e) => setWa({ ...wa, phoneSP: e.target.value })}
                placeholder="551138252050"
              />
              <p className="text-xs text-gray-400 mt-1">Botão Telefone na homepage e contato</p>
            </div>
          </div>

          <div>
            <Label htmlFor="waMessage">Mensagem padrão do WhatsApp</Label>
            <Input
              id="waMessage"
              value={wa.whatsappMessage}
              onChange={(e) => setWa({ ...wa, whatsappMessage: e.target.value })}
              placeholder="Oi eu vim pelo site www.cabelospremium.com.br"
            />
            <p className="text-xs text-gray-400 mt-1">Pré-preenchida ao abrir a conversa</p>
          </div>

        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="bg-[#8a7d5c] hover:bg-[#6d6247]">
        {saving ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}
