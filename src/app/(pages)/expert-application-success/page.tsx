"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function ExpertApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-white shadow-xl text-center">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Solicitação Enviada com Sucesso!
            </CardTitle>
            <p className="text-lg text-gray-600">
              Obrigado por se interessar em fazer parte da nossa rede de especialistas.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos Passos
              </h3>
              <div className="text-left space-y-3 text-blue-800">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 text-sm font-bold mt-0.5">
                    1
                  </div>
                  <p>Nossa equipe analisará sua solicitação em até 48 horas</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 text-sm font-bold mt-0.5">
                    2
                  </div>
                  <p>Você receberá um e-mail com o resultado da análise</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 text-sm font-bold mt-0.5">
                    3
                  </div>
                  <p>Se aprovado, receberá acesso ao portal de especialistas</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">
                O que acontece se você for aprovado?
              </h3>
              <ul className="text-left space-y-2 text-amber-800">
                <li>• Acesso a preços especiais para revendedores</li>
                <li>• Suporte técnico dedicado</li>
                <li>• Material promocional exclusivo</li>
                <li>• Descontos em grandes volumes</li>
                <li>• Acesso antecipado a novos produtos</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Precisa de ajuda?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>contato@cabelospremium.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>(11) 99999-9999</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/shop">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continuar Comprando
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 