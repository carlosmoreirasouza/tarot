"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadRequest } from "@/lib/storage";
import type { ReadingForm } from "@/lib/schema";

const prices: Record<string, { valor: number; descricao: string }> = {
  "3": { valor: 29.9, descricao: "Consulta 3 cartas" },
  "5": { valor: 49.9, descricao: "Consulta 5 cartas" },
  "7": { valor: 99.9, descricao: "Consulta completa (7 cartas)" },
};

const qrByPlan: Record<string, string> = {
  "3": "/qr/pix-3.png",
  "5": "/qr/pix-5.png",
  "7": "/qr/pix-7.png",
};

function getPixCopiaCola(plano: string) {
  if (plano === "3") return process.env.NEXT_PUBLIC_PIX_COPIA_COLA_3 || "";
  if (plano === "5") return process.env.NEXT_PUBLIC_PIX_COPIA_COLA_5 || "";
  if (plano === "7") return process.env.NEXT_PUBLIC_PIX_COPIA_COLA_7 || "";
  return "";
}

export default function CheckoutPage() {
  const [data, setData] = useState<ReadingForm | null>(null);
  const [txRef, setTxRef] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const d = loadRequest();
    setData(d);
    setTxRef(`CONS-${Date.now().toString(36).toUpperCase()}`);
  }, []);

  if (!data) {
    return (
      <main className="container">
        <div className="card">
          <div className="header">
            <h1 className="h1">Carregando…</h1>
            <p className="lead">Aguarde um instante.</p>
          </div>
        </div>
      </main>
    );
  }

  const planoInfo = prices[data.plano] ?? prices["3"];
  const qrSrc = qrByPlan[data.plano] ?? qrByPlan["3"];
  const pixCopiaCola = getPixCopiaCola(data.plano);

  async function notifyPaid() {
    setStatus("sending");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          valor: planoInfo.valor,
          descricao: planoInfo.descricao,
          referencia: txRef,
          metodo: "PIX",
        }),
      });

      if (!res.ok) throw new Error("Falha ao enviar");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  async function copyPix() {
    try {
      if (!pixCopiaCola) return;
      await navigator.clipboard.writeText(pixCopiaCola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      // fallback simples
      alert("Não consegui copiar automaticamente. Copie manualmente o código Pix.");
    }
  }

  return (
    <main className="container">
      <div className="card">
        <div className="header">
          <h1 className="h1">Checkout</h1>
          <p className="lead">
            Plano: <b>{data.plano}</b> cartas • Valor: <b>R$ {planoInfo.valor.toFixed(2)}</b>
          </p>

          <div className="actions">
            {/* Envia os dados para você por e-mail */}
            {status !== "sent" ? (
              <button
                className="btn btn-primary"
                onClick={notifyPaid}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Enviando..." : "Enviar dados"}
              </button>
            ) : (
              <div className="small" style={{ marginTop: 6 }}>
                ✅ Dados enviados. Agora pague via Pix abaixo.
              </div>
            )}

            <Link className="btn btn-ghost" href="/tiragem">
              Editar dados
            </Link>

            <Link className="btn btn-ghost" href="/">
              Início
            </Link>
          </div>

          {status === "error" && (
            <p className="small" style={{ color: "#b91c1c", marginTop: 10 }}>
              Não consegui enviar agora. Tente novamente.
            </p>
          )}
        </div>

        {/* ✅ APÓS ENVIAR: mostra QR + copiar */}
        {status === "sent" && (
          <div className="section">
            <h2 style={{ marginTop: 0 }}>Pagamento via Pix</h2>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div className="small">
                  Escaneie o QR Code abaixo ou copie o código Pix para pagar.
                </div>

                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: 12,
                    borderRadius: 16,
                    border: "1px solid rgba(109,40,217,.15)",
                    background: "rgba(255,255,255,.7)",
                  }}
                >
                  {/* QR predefinido por plano */}
                  <img
                    src={qrSrc}
                    alt="QR Code Pix"
                    style={{ width: 260, height: 260, objectFit: "contain" }}
                  />
                </div>

                <div>
                  <div className="small" style={{ marginBottom: 8 }}>
                    Código Pix (copia e cola):
                  </div>

                  <div
                    className="card"
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      background: "rgba(255,255,255,.8)",
                      border: "1px solid rgba(109,40,217,.15)",
                    }}
                  >
                    <code style={{ wordBreak: "break-all" }}>
                      {pixCopiaCola || "⚠️ Configure NEXT_PUBLIC_PIX_COPIA_COLA_* no .env.local"}
                    </code>
                  </div>

                  <div className="actions" style={{ marginTop: 12 }}>
                    <button
                      className="btn btn-primary"
                      onClick={copyPix}
                      disabled={!pixCopiaCola}
                    >
                      {copiado ? "Copiado ✅" : "Copiar código Pix"}
                    </button>

                    <a className="btn btn-ghost" href="/">
                      Voltar ao início
                    </a>
                  </div>

                  <p className="small" style={{ marginTop: 10 }}>
                    Referência: <b>{txRef}</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumo sempre visível */}
        <div className="section">
          <h2 style={{ marginTop: 0 }}>Resumo</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <Row k="Nome" v={data.nome} />
            <Row k="WhatsApp" v={data.whatsapp} />
            <Row k="Email" v={data.email} />
            <Row k="Tema" v={data.tema === "Outro" ? (data.outroTema || "Outro") : data.tema} />
            <Row k="Signo" v={data.signo} />
            <Row k="Idade" v={String(data.idade)} />
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 10 }}>
      <strong>{k}:</strong>
      <span style={{ color: "rgba(29,21,40,.85)" }}>{v}</span>
    </div>
  );
}