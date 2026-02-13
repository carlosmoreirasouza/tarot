"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadRequest } from "@/lib/storage";
import type { ReadingForm } from "@/lib/schema";

const prices: Record<string, { valor: number; descricao: string }> = {
  "3": { valor: 29.9, descricao: "Tiragem 3 cartas" },
  "5": { valor: 49.9, descricao: "Tiragem 5 cartas" },
  "7": { valor: 99.9, descricao: "Tiragem 7 cartas (completa)" },
};

export default function CheckoutPage() {
  const [data, setData] = useState<ReadingForm | null>(null);
  const [txRef, setTxRef] = useState("");
  const [status, setStatus] = useState<"idle" | "copy" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const d = loadRequest();
    setData(d);
    // referência simples pra você identificar (não é confirmação automática)
    setTxRef(`TRT-${Date.now().toString(36).toUpperCase()}`);
  }, []);
 
  const planoInfo = data ? prices[data.plano] : prices["3"];
  
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

  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY; // vamos setar já já

  async function copyPix() {
    if (!pixKey) return;
    await navigator.clipboard.writeText(pixKey);
    setStatus("copy");
    setTimeout(() => setStatus("idle"), 1200);
  }

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
      if (!res.ok) throw new Error("Falha");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="container">
      <div className="card">
        <div className="header">
          <h1 className="h1">Pagamento via Pix</h1>
          <p className="lead">
            Faça o Pix e depois clique em <b>“Já paguei / Enviar dados”</b> para eu iniciar sua leitura.
          </p>

          <div className="actions">
            <button className="btn btn-primary" onClick={copyPix} disabled={!pixKey}>
              {status === "copy" ? "Chave copiada ✅" : "Copiar chave Pix"}
            </button>

            <button
              className="btn btn-ghost"
              onClick={notifyPaid}
              disabled={status === "sending" || status === "sent"}
            >
              {status === "sending" ? "Enviando..." : status === "sent" ? "Enviado ✅" : "Já paguei / Enviar dados"}
            </button>

            <Link className="btn btn-ghost" href="/tiragem">
              Editar dados
            </Link>
            {status === "sent" && (
              <div className="actions" style={{ marginTop: 14 }}>
                <a className="btn btn-primary" href="/">
                  Voltar ao início
                </a>
              </div>
            )}
          </div>

          <p className="small" style={{ marginTop: 12 }}>
            <b>Plano:</b> {data.plano} cartas — <b>Valor:</b> R$ {planoInfo.valor.toFixed(2)} <br />
            <b>Referência:</b> {txRef} (guarde caso precise)
          </p>

          {!pixKey ? (
            <p className="small" style={{ color: "#b91c1c" }}>
              PIX não configurado. Defina NEXT_PUBLIC_PIX_KEY no .env.local
            </p>
          ) : (
            <div className="section" style={{ paddingTop: 10 }}>
              <h2 style={{ marginTop: 0 }}>Chave Pix</h2>
              <div className="card" style={{ padding: 14 }}>
                <code style={{ wordBreak: "break-all" }}>{pixKey}</code>
              </div>
              <p className="small" style={{ marginTop: 10 }}>
                Dica: no seu app do banco, cole a chave e confirme o valor.
              </p>
            </div>
          )}

          {status === "error" && (
            <p className="small" style={{ color: "#b91c1c", marginTop: 10 }}>
              Não consegui enviar o e-mail agora. Tente novamente.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
