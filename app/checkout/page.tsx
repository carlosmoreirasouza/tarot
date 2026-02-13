"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadRequest, clearRequest } from "@/lib/storage";
import type { ReadingForm } from "@/lib/schema";

// Troque pelo seu link real da Stone (pode ser fixo por enquanto)
const STONE_PAYMENT_URL = "https://SEU-LINK-DA-STONE-AQUI";

export default function CheckoutPage() {
  const [data, setData] = useState<ReadingForm | null>(null);

  useEffect(() => {
    setData(loadRequest());
  }, []);

  if (!data) {
    return (
      <main style={{ maxWidth: 760, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 24 }}>Sem solicitação</h1>
        <p>Volte e preencha o formulário para gerar sua tiragem.</p>
        <Link href="/tiragem">Ir para o formulário</Link>
      </main>
    );
  }

  const temaFinal = data.tema === "Outro" ? data.outroTema : data.tema;

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Confirmar e pagar</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Confira os dados antes de seguir para o pagamento.
      </p>

      <div style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 12, padding: 14, lineHeight: 1.8 }}>
        <Row k="Nome" v={data.nome} />
        <Row k="WhatsApp" v={data.whatsapp} />
        <Row k="Email" v={data.email} />
        <Row k="Tema" v={temaFinal ?? ""} />
        <Row k="Signo" v={data.signo} />
        <Row k="Idade" v={String(data.idade)} />
        <Row k="Pergunta" v={data.pergunta?.trim() ? data.pergunta : "—"} />
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <a href={STONE_PAYMENT_URL} target="_blank" rel="noreferrer" style={btnStyle}>
          Pagar com Stone
        </a>

        <Link
          href="/tiragem"
          style={{
            border: "1px solid #ddd",
            padding: "12px 16px",
            borderRadius: 10,
            textDecoration: "none",
            color: "black",
            fontWeight: 700,
          }}
        >
          Editar dados
        </Link>

        <button
          onClick={() => {
            clearRequest();
            setData(null);
          }}
          style={{
            border: "1px solid #ddd",
            padding: "12px 16px",
            borderRadius: 10,
            background: "white",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Limpar
        </button>
      </div>

      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
        Depois do pagamento, me envie o comprovante (ou a gente automatiza com webhook na próxima etapa).
      </p>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 10 }}>
      <strong>{k}:</strong>
      <span>{v}</span>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "black",
  color: "white",
  padding: "12px 16px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 800,
  display: "inline-block",
};

