"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Plano = "3" | "5" | "7";

type FormData = {
  nome: string;
  email: string;
  whatsapp: string;
  tema: string;
  signo: string;
  idade: string;
};

const PRICES: Record<Plano, { valor: number; descricao: string }> = {
  "3": { valor: 29.9, descricao: "Consulta 3 cartas" },
  "5": { valor: 49.9, descricao: "Consulta 5 cartas" },
  "7": { valor: 99.9, descricao: "Consulta completa 7 cartas" },
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function genRef(plano: Plano) {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CONS-${plano}-${rand}`;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [plano, setPlano] = useState<Plano>("3");
  const [ref, setRef] = useState<string>(() => genRef("3"));

  // Lê o plano da URL no client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plano");
    if (p === "3" || p === "5" || p === "7") setPlano(p);
  }, []);

  // Sempre que plano mudar, gera nova referência
  useEffect(() => {
    setRef(genRef(plano));
  }, [plano]);

  const planoInfo = PRICES[plano];

  const PIX_CHAVE = process.env.NEXT_PUBLIC_PIX_CHAVE || "";
  const PIX_NOME = process.env.NEXT_PUBLIC_PIX_NOME || "Altar Místico";
  const PIX_CIDADE = process.env.NEXT_PUBLIC_PIX_CIDADE || "BRASILIA";

  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    whatsapp: "",
    tema: "",
    signo: "",
    idade: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copyOk, setCopyOk] = useState<string>("");

  // Debug/estado do QR
  const [qrError, setQrError] = useState<string>("");

  // ✅ cache-buster: evita cache de 404 antigo
  const qrSrc = `/qr/pix-${plano}.png?v=${encodeURIComponent(ref)}`;

  const canSubmit =
    form.nome.trim() &&
    form.email.trim() &&
    form.whatsapp.trim() &&
    form.tema.trim() &&
    form.signo.trim() &&
    form.idade.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setCopyOk("");
    setQrError("");

    try {
      const payload = {
        ...form,
        idade: Number(form.idade),
        plano,
        valor: planoInfo.valor,
        descricao: planoInfo.descricao,
        referencia: ref,
        metodo: "PIX",
      };

      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Falha ao enviar.");
      }

      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert(`Erro ao enviar: ${err?.message || "desconhecido"}`);
    } finally {
      setLoading(false);
    }
  }

  async function copyPix() {
    if (!PIX_CHAVE) {
      alert("PIX_CHAVE não configurada no .env.local (NEXT_PUBLIC_PIX_CHAVE).");
      return;
    }

    try {
      await navigator.clipboard.writeText(PIX_CHAVE);
      setCopyOk("Chave PIX copiada!");
      setTimeout(() => setCopyOk(""), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PIX_CHAVE;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopyOk("Chave PIX copiada!");
      setTimeout(() => setCopyOk(""), 2500);
    }
  }

  function goHome() {
    router.push("/");
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.badge}>Checkout</div>
          <h1 style={styles.h1}>Finalizar Consulta</h1>
          <p style={styles.p}>Envie seus dados. Em seguida, faça o PIX para confirmar.</p>
        </div>

        <div style={styles.card}>
          <div style={styles.planRow}>
            <div>
              <div style={styles.planTitle}>{planoInfo.descricao}</div>
              <div style={styles.planPrice}>{formatBRL(planoInfo.valor)}</div>
            </div>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => router.push(`/consulta?plano=${plano}`)}
            >
              Alterar plano
            </button>
          </div>
        </div>

        {!sent && (
          <form onSubmit={onSubmit} style={styles.card}>
            <div style={styles.grid}>
              <Field label="Nome" value={form.nome} onChange={(v) => setForm((s) => ({ ...s, nome: v }))} />
              <Field
                label="E-mail"
                value={form.email}
                onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                type="email"
              />
              <Field
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(v) => setForm((s) => ({ ...s, whatsapp: v }))}
                placeholder="DDD + número"
              />
              <Field
                label="Tema da consulta"
                value={form.tema}
                onChange={(v) => setForm((s) => ({ ...s, tema: v }))}
                placeholder="Amor, dinheiro, saúde..."
              />
              <Field label="Signo" value={form.signo} onChange={(v) => setForm((s) => ({ ...s, signo: v }))} />
              <Field
                label="Idade"
                value={form.idade}
                onChange={(v) => setForm((s) => ({ ...s, idade: v }))}
                type="number"
              />
            </div>

            <div style={styles.miniInfo}>
              <div>
                <strong>Referência:</strong> {ref}
              </div>
              <div style={{ opacity: 0.85 }}>
                Atendimento e entrega combinados após confirmação do pagamento.
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                opacity: canSubmit && !loading ? 1 : 0.55,
                cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              }}
              disabled={!canSubmit || loading}
            >
              {loading ? "Enviando..." : "Enviar dados"}
            </button>
          </form>
        )}

        {sent && (
          <>
            <div style={{ ...styles.card, borderColor: "rgba(46, 204, 113, .35)" }}>
              <div style={styles.success}>
                ✅ <strong>Enviado!</strong> Agora faça o PIX para confirmar.
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.pixTitle}>PIX — {formatBRL(planoInfo.valor)}</div>

              <div style={styles.pixBox}>
                <div style={styles.pixLine}>
                  <strong>Chave:</strong>{" "}
                  <span style={styles.mono}>{PIX_CHAVE || "(não configurada)"}</span>
                </div>
                <div style={styles.pixLine}>
                  <strong>Nome:</strong> {PIX_NOME}
                </div>
                <div style={styles.pixLine}>
                  <strong>Cidade:</strong> {PIX_CIDADE}
                </div>
                <div style={styles.pixLine}>
                  <strong>Referência:</strong> <span style={styles.mono}>{ref}</span>
                </div>

                <div style={styles.qrWrap}>
                  <img
                    src={qrSrc}
                    alt={`QR Code PIX plano ${plano}`}
                    style={styles.qrImg}
                    loading="eager"
                    onError={() => {
                      setQrError(
                        `Não consegui carregar o QR. Teste abrir: /qr/pix-${plano}.png`
                      );
                    }}
                    onLoad={() => setQrError("")}
                  />
                </div>

                {qrError && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "#8a1f1f" }}>
                    {qrError}
                    <div style={{ marginTop: 6 }}>
                      <a href={`/qr/pix-${plano}.png`} target="_blank" rel="noreferrer">
                        Abrir QR em outra aba
                      </a>
                    </div>
                    <div style={{ marginTop: 6, opacity: 0.85 }}>
                      Debug: <span style={styles.mono}>{qrSrc}</span>
                    </div>
                  </div>
                )}

                <div style={styles.btnRow}>
                  <button type="button" style={styles.primaryBtn} onClick={copyPix}>
                    Copiar chave PIX
                  </button>
                  <button type="button" style={styles.secondaryBtn} onClick={goHome}>
                    Voltar ao início
                  </button>
                </div>

                {copyOk && <div style={styles.copyOk}>{copyOk}</div>}

                <div style={styles.hint}>
                  Após o pagamento, envie o comprovante no WhatsApp (ou aguarde a confirmação combinada).
                </div>
              </div>
            </div>
          </>
        )}

        <div style={styles.footer}>
          <span style={styles.footerNote}>⚠️ A leitura é feita por uma pessoa, não por IA.</span>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label style={styles.label}>
      <span style={styles.labelText}>{label}</span>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 0%, rgba(144, 89, 255, .12), transparent 60%)," +
      "radial-gradient(1000px 500px at 80% 20%, rgba(170, 110, 255, .10), transparent 55%)," +
      "#fff",
    color: "#2a2233",
    padding: "28px 14px",
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  },
  container: { maxWidth: 760, margin: "0 auto" },
  header: { marginBottom: 14 },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(120, 70, 220, .10)",
    border: "1px solid rgba(120, 70, 220, .20)",
    color: "#4b2f88",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  h1: { fontSize: 34, lineHeight: 1.1, margin: "10px 0 6px", color: "#241a33" },
  p: { margin: 0, opacity: 0.85, fontSize: 16 },
  card: {
    background: "#fff",
    borderRadius: 18,
    border: "1px solid rgba(120, 70, 220, .16)",
    boxShadow: "0 10px 30px rgba(20, 10, 40, .06)",
    padding: 16,
    marginTop: 14,
  },
  planRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  planTitle: { fontSize: 16, fontWeight: 800, color: "#2b1d3a" },
  planPrice: { fontSize: 22, fontWeight: 900, color: "#4b2f88", marginTop: 4 },
  grid: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  label: { display: "grid", gap: 6 },
  labelText: { fontSize: 14, fontWeight: 800, color: "#3b2a50" },
  input: {
    height: 46,
    padding: "0 14px",
    borderRadius: 14,
    border: "1px solid rgba(120, 70, 220, .22)",
    outline: "none",
    fontSize: 16,
    background: "rgba(120, 70, 220, .04)",
  },
  miniInfo: { marginTop: 14, display: "grid", gap: 6, fontSize: 14, color: "#2f2440" },
  primaryBtn: {
    marginTop: 14,
    width: "100%",
    height: 48,
    borderRadius: 14,
    border: "1px solid rgba(120, 70, 220, .35)",
    background: "#4b2f88",
    color: "#fff",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  secondaryBtn: {
    height: 42,
    padding: "0 14px",
    borderRadius: 14,
    border: "1px solid rgba(120, 70, 220, .28)",
    background: "rgba(120, 70, 220, .06)",
    color: "#3e276f",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  },
  success: {
    background: "rgba(46, 204, 113, .10)",
    border: "1px solid rgba(46, 204, 113, .25)",
    padding: 14,
    borderRadius: 14,
    color: "#1e6b3a",
    fontSize: 16,
  },
  pixTitle: { fontSize: 20, fontWeight: 900, color: "#2b1d3a", marginBottom: 10 },
  pixBox: {
    borderRadius: 16,
    border: "1px solid rgba(120, 70, 220, .18)",
    background: "rgba(120, 70, 220, .04)",
    padding: 14,
  },
  pixLine: { marginTop: 6, fontSize: 15, color: "#2f2440" },
  mono: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  qrWrap: { display: "flex", justifyContent: "center", marginTop: 14, marginBottom: 10 },
  qrImg: {
    width: 230,
    height: "auto",
    borderRadius: 14,
    border: "1px solid rgba(120, 70, 220, .18)",
    background: "#fff",
  },
  btnRow: { display: "grid", gridTemplateColumns: "1fr", gap: 10, marginTop: 10 },
  copyOk: { marginTop: 10, fontWeight: 800, color: "#1e6b3a" },
  hint: { marginTop: 12, fontSize: 13, opacity: 0.85, color: "#2f2440" },
  footer: { marginTop: 18, display: "flex", justifyContent: "center" },
  footerNote: { fontSize: 12, color: "#3b2a50", opacity: 0.75 },
};