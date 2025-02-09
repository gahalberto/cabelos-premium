import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import axios from "axios";

const useMercadoPago = () => {

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "pt-BR",
    });
  }, []);

  async function createCheckout(testeId: string, userEmail?: string, price?: number) {
    console.log("COMECANDO O CREATE CHECKOUT")
    try {
      const response = await axios.post("/api/mercado-pago/create-checkout", {
        testeId,
        userEmail,
        price: price || 29,
      });

      if (response.data.initPoint) {
        window.location.href = response.data.initPoint;
      }
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      alert("Ocorreu um erro ao processar o pagamento");
    }
  }

  return { createCheckout };
};

export default useMercadoPago;