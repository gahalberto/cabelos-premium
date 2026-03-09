"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Info } from "lucide-react";
import { saveStoreConfig } from "@/app/_actions/admin/save-store-config";
import { useToast } from "@/hooks/use-toast";

interface StoreConfigFormProps {
  initialThreshold: number;
}

export function StoreConfigForm({ initialThreshold }: StoreConfigFormProps) {
  const { toast } = useToast();
  const [threshold, setThreshold] = useState(
    initialThreshold > 0 ? String(initialThreshold) : ""
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const value = threshold === "" ? 0 : parseFloat(threshold.replace(",", "."));
      if (isNaN(value) || value < 0) {
        toast({ title: "Valor inválido", variant: "destructive" });
        return;
      }
      await saveStoreConfig({ freeShippingThreshold: value });
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <Truck className="h-5 w-5 text-green-600" />
            Frete Grátis
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Defina o valor mínimo do pedido para o cliente ganhar frete grátis. Deixe em branco ou zero para desativar.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="threshold" className="text-gray-700 font-medium">
              Valor mínimo para frete grátis (R$)
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm select-none">
                R$
              </span>
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

      <Button type="submit" disabled={saving} className="bg-[#8a7d5c] hover:bg-[#6d6247]">
        {saving ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}
