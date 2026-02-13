"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadRequest } from "@/lib/storage";
import type { ReadingForm } from "@/lib/schema";

const prices: Record<string, { valor: number; link: string }> = {
  "3": { valor: 29.9, link: "https://payment-link-v3.stone.com.br/pl_wGY1WnoNjvgXzE8IqJT0VKD7QB6Ab5Z9" },
  "5": { valor: 49.9, link: "https://payment-link-v3.stone.com.br/pl_3qdJN6DjM9y59nMUjahDeYGmpB8041xr" },
  "7": { valor: 99.9, link: "https://payment-link-v3.stone.com.br/pl_0WqlGAy4LnowYp9tyTpVPRaK8e1j5Dbz" },
};

export default function CheckoutPage() {
  const [data, setData] = useState<ReadingForm | null>(null);

  useEffect(() => {
    setData(loadRequest());
  }, []);

  if (!data) {
    return <div>Carregando...</div>;
  }

  // ✅ AGORA está dentro do componente
  const planoInfo = prices[data.plano];

  return (
    <main className="container">
      <div className="card">
        <div className="header">
          <h1 className="h1">Confirmar pagamento</h1>

          <p>Plano escolhido: {data.plano} cartas</p>
          <p>Valor: R$ {planoInfo.valor.toFixed(2)}</p>

          <div className="actions">
            <a
              className="btn btn-primary"
              href={planoInfo.link}
              target="_blank"
            >
              Pagar R$ {planoInfo.valor.toFixed(2)}
            </a>

            <Link className="btn btn-ghost" href="/tiragem">
              Voltar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

