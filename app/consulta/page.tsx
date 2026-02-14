"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PlanoKey = "3" | "5" | "7";

const PLANOS: Record<
  PlanoKey,
  { titulo: string; valor: number; labelValor: string; descricao: string }
> = {
  "3": {
    titulo: "Consulta 3 cartas",
    valor: 29.9,
    labelValor: "R$ 29,90",
    descricao: "Leitura objetiva e direta para um tema.",
  },
  "5": {
    titulo: "Consulta 5 cartas",
    valor: 49.9,
    labelValor: "R$ 49,90",
    descricao: "Mais contexto, aconselhamento e caminho.",
  },
  "7": {
    titulo: "Consulta completa (7 cartas)",
    valor: 99.9,
    labelValor: "R$ 99,90",
    descricao: "Leitura profunda com visão ampla.",
  },
};

export default function ConsultaPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tema, setTema] = useState("");
  const [signo, setSigno] = useState("");
  const [idade, setIdade] = useState<number | "">("");
  const [plano, setPlano] = useState<PlanoKey>("3");

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const planoInfo = useMemo(() => PLANOS[plano], [plano]);

  const txRef = useMemo(() => {
    // referência simples pra você identificar no email
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `CONS-${plano}-${rand}`;
  }, [plano]);

  const pixChave = process.env.NEXT_PUBLIC_PIX_KEY || "SUA_CHAVE_PIX_AQUI";
  const pixNome = process.env.NEXT_PUBLIC_PIX_NOME || "Altar Místico";
  const pixCidade = process.env.NEXT_PUBLIC_PIX_CIDADE || "BRASILIA";

  async function enviarDados() {
    setErro(null);

    if (!nome.trim()) return setErro("Informe seu nome.");
    if (!email.trim()) return setErro("Informe seu e-mail.");
    if (!whatsapp.trim()) return setErro("Informe seu WhatsApp.");
    if (!tema.trim()) return setErro("Informe o tema da consulta.");
    if (!signo.trim()) return setErro("Informe seu signo.");
    if (idade === "" || Number(idade) <= 0) return setErro("Informe sua idade.");

    setEnviando(true);

    try {
      const payload = {
        nome,
        email,
        whatsapp,
        tema,
        signo,
        idade: Number(idade),
        plano,
        valor: planoInfo.valor,
        descricao: planoInfo.titulo,
        referencia: txRef,
        metodo: "PIX",
        pix: {
          chave: pixChave,
          nome: pixNome,
          cidade: pixCidade,
        },
      };

      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Falha ao enviar dados.");
      }

      setEnviado(true);
    } catch (e: any) {
      setErro(e?.message || "Erro ao enviar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 700px at 10% 0%, rgba(120, 70, 180, 0.10), transparent 55%)," +
          "radial-gradient(900px 600px at 100% 10%, rgba(160, 120, 220, 0.12), transparent 50%)," +
          "linear-gradient(180deg, #ffffff 0%, #fbf9ff 60%, #ffffff 100%)",
        color: "#1d102b",
        padding: "28px 16px 60px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            cursor: "pointer",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(120,70,180,0.18)",
            background: "#fff",
            color: "#2a163e",
            fontWeight: 800,
          }}
        >
          ← Voltar ao início
        </button>

        <h1 style={{ marginTop: 18, marginBottom: 8, letterSpacing: "-0.6px" }}>
          Consulta de Tarot
        </h1>
        <p style={{ marginTop: 0, color: "#4b3f63", lineHeight: 1.7 }}>
          Escolha o plano, preencha seus dados e siga com o pagamento via PIX.
          Após a confirmação, eu realizo a consulta manualmente e te respondo.
        </p>

        <div
          style={{
            marginTop: 16,
            borderRadius: 18,
            background: "#fff",
            border: "1px solid rgba(120,70,180,0.18)",
            boxShadow: "0 18px 60px rgba(120,70,180,0.10)",
            padding: 16,
          }}
        >
          {/* Plano */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Plano da consulta</label>
            <select
              value={plano}
              onChange={(e) => setPlano(e.target.value as PlanoKey)}
              style={inputStyle}
              disabled={enviado}
            >
              <option value="3">3 cartas — R$ 29,90</option>
              <option value="5">5 cartas — R$ 49,90</option>
              <option value="7">Completo (7 cartas) — R$ 99,90</option>
            </select>
            <div style={{ marginTop: 8, color: "#5a4b73", fontSize: 13, lineHeight: 1.6 }}>
              <b>{planoInfo.titulo}</b> • {planoInfo.descricao}
            </div>
          </div>

          {/* Form */}
          <div style={{ display: "grid", gap: 12 }}>
            <Field label="Nome" value={nome} setValue={setNome} disabled={enviado} />
            <Field label="E-mail" value={email} setValue={setEmail} disabled={enviado} type="email" />
            <Field label="WhatsApp" value={whatsapp} setValue={setWhatsapp} disabled={enviado} placeholder="(DDD) 9xxxx-xxxx" />
            <Field label="Tema da consulta" value={tema} setValue={setTema} disabled={enviado} placeholder="Ex: Amor, financeiro, saúde..." />
            <Field label="Signo" value={signo} setValue={setSigno} disabled={enviado} placeholder="Ex: Áries" />

            <div>
              <label style={labelStyle}>Idade</label>
              <input
                value={idade}
                onChange={(e) => setIdade(e.target.value === "" ? "" : Number(e.target.value))}
                type="number"
                min={1}
                style={inputStyle}
                disabled={enviado}
              />
            </div>
          </div>

          {erro && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 14,
                border: "1px solid rgba(220, 38, 38, 0.25)",
                background: "rgba(220, 38, 38, 0.06)",
                color: "#7f1d1d",
                fontWeight: 700,
              }}
            >
              {erro}
            </div>
          )}

          {!enviado ? (
            <button
              onClick={enviarDados}
              disabled={enviando}
              style={{
                marginTop: 16,
                width: "100%",
                cursor: enviando ? "not-allowed" : "pointer",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "linear-gradient(180deg, #111 0%, #000 100%)",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                opacity: enviando ? 0.7 : 1,
              }}
            >
              {enviando ? "Enviando..." : "Enviar dados e ver PIX"}
            </button>
          ) : (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  padding: 14,
                  borderRadius: 16,
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                  background: "rgba(34, 197, 94, 0.06)",
                  color: "#14532d",
                  fontWeight: 800,
                }}
              >
                ✅ Enviado! Agora faça o PIX para confirmar.
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: 14,
                  borderRadius: 16,
                  background:
                    "linear-gradient(145deg, rgba(120,70,180,0.10), rgba(160,120,220,0.06))",
                  border: "1px solid rgba(120,70,180,0.22)",
                }}
              >
                <div style={{ fontWeight: 900, color: "#2a163e" }}>
                  PIX — {planoInfo.labelValor}
                </div>
                <div style={{ marginTop: 8, color: "#3b2c54", lineHeight: 1.7 }}>
                  <div>
                    <b>Chave:</b> {pixChave}
                  </div>
                  <div>
                    <b>Nome:</b> {pixNome}
                  </div>
                  <div>
                    <b>Cidade:</b> {pixCidade}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <b>Referência:</b> {txRef}
                  </div>
                </div>

                <div style={{ marginTop: 10, fontSize: 12, color: "#5a4b73" }}>
                  Após o pagamento, envie o comprovante no WhatsApp (ou aguarde a confirmação combinada).
                </div>
              </div>

              {/* Botão que aparece após enviar */}
              <button
                onClick={() => router.push("/")}
                style={{
                  marginTop: 14,
                  width: "100%",
                  cursor: "pointer",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: "1px solid rgba(120,70,180,0.20)",
                  background: "#fff",
                  color: "#2a163e",
                  fontWeight: 900,
                  fontSize: 16,
                }}
              >
                Voltar ao início
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        type={props.type || "text"}
        placeholder={props.placeholder}
        style={inputStyle}
        disabled={props.disabled}
      />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 800,
  color: "#2a163e",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(120,70,180,0.18)",
  outline: "none",
  background: "#fff",
  color: "#1d102b",
  fontSize: 15,
  boxShadow: "0 10px 30px rgba(120,70,180,0.06)",
};