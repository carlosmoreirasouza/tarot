"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readingSchema, type ReadingForm } from "@/lib/schema";
import { saveRequest } from "@/lib/storage";

const temas: ReadingForm["tema"][] = ["Amor", "Financeiro", "Saúde", "Carreira", "Espiritualidade", "Outro"];

export default function TiragemPage() {
  const router = useRouter();

  const [form, setForm] = useState<Partial<ReadingForm>>({
    tema: "Amor",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showOutro = useMemo(() => form.tema === "Outro", [form.tema]);

  function setField<K extends keyof ReadingForm>(key: K, value: ReadingForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = readingSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!next[path]) next[path] = issue.message;
      }
      setErrors(next);
      return;
    }

    // regra extra: se "Outro", precisa preencher outroTema
    if (parsed.data.tema === "Outro" && !parsed.data.outroTema?.trim()) {
      setErrors({ outroTema: "Descreva o tema" });
      return;
    }

    saveRequest(parsed.data);
    router.push("/checkout");
  }

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Formulário da Tiragem</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>Preencha para eu direcionar a leitura para o seu momento.</p>

      <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 14 }}>
        <Field label="Nome" error={errors.nome}>
          <input
            value={form.nome ?? ""}
            onChange={(e) => setField("nome", e.target.value)}
            placeholder="Seu nome"
            style={inputStyle}
          />
        </Field>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
          <Field label="WhatsApp" error={errors.whatsapp}>
            <input
              value={form.whatsapp ?? ""}
              onChange={(e) => setField("whatsapp", e.target.value)}
              placeholder="(DDD) 9xxxx-xxxx"
              style={inputStyle}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              value={form.email ?? ""}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="seu@email.com"
              style={inputStyle}
            />
          </Field>
        </div>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
          <Field label="Tema da tiragem" error={errors.tema}>
            <select value={form.tema ?? "Amor"} onChange={(e) => setField("tema", e.target.value as any)} style={inputStyle}>
              {temas.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Signo" error={errors.signo}>
            <input
              value={form.signo ?? ""}
              onChange={(e) => setField("signo", e.target.value)}
              placeholder="Ex.: Leão"
              style={inputStyle}
            />
          </Field>
        </div>

        {showOutro && (
          <Field label="Qual tema?" error={errors.outroTema}>
            <input
              value={form.outroTema ?? ""}
              onChange={(e) => setField("outroTema", e.target.value)}
              placeholder="Ex.: família, decisões, mudança..."
              style={inputStyle}
            />
          </Field>
        )}

        <Field label="Idade" error={errors.idade}>
          <input
            value={form.idade?.toString() ?? ""}
            onChange={(e) => setField("idade", Number(e.target.value) as any)}
            placeholder="Ex.: 34"
            style={inputStyle}
            inputMode="numeric"
          />
        </Field>

        <Field label="Pergunta (opcional)" error={errors.pergunta}>
          <textarea
            value={form.pergunta ?? ""}
            onChange={(e) => setField("pergunta", e.target.value)}
            placeholder="Se quiser, descreva a situação em poucas linhas..."
            style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
          />
        </Field>

        <button type="submit" style={btnStyle}>
          Continuar para pagamento
        </button>

        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
          Ao continuar, você será direcionado para o checkout.
        </p>
      </form>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontWeight: 650 }}>{label}</label>
        {error ? <span style={{ color: "crimson", fontSize: 12 }}>{error}</span> : null}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
};

const btnStyle: React.CSSProperties = {
  background: "black",
  color: "white",
  padding: "12px 16px",
  borderRadius: 10,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

