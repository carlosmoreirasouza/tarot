"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { saveRequest } from "@/lib/storage";
import type { ReadingForm } from "@/lib/schema";

export default function TiragemClient() {
  const params = useSearchParams();
  const router = useRouter();

  const plano = useMemo(() => {
    const p = params.get("plano");
    if (p === "3" || p === "5" || p === "7") return p;
    return "3";
  }, [params]);

  const [form, setForm] = useState<Partial<ReadingForm>>({
    plano: plano as any,
    tema: "Amor",
  });

  function onChange<K extends keyof ReadingForm>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // validação simples (pode melhorar depois com zod)
    if (!form.nome || !form.whatsapp || !form.email || !form.signo || !form.idade || !form.tema || !form.plano) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    saveRequest(form as ReadingForm);
    router.push("/checkout");
  }

  return (
    <main className="container">
      <div className="card">
        <div className="header">
          <h1 className="h1">🔮 Sua Tiragem</h1>
          <p className="lead">
            Plano escolhido: <b>{form.plano}</b> cartas. Preencha os dados para direcionar a leitura.
          </p>
        </div>

        <div className="section">
          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <div className="grid2">
              <Field label="Nome *">
                <input className="input" value={form.nome ?? ""} onChange={(e) => onChange("nome", e.target.value)} />
              </Field>

              <Field label="WhatsApp *">
                <input
                  className="input"
                  value={form.whatsapp ?? ""}
                  onChange={(e) => onChange("whatsapp", e.target.value)}
                />
              </Field>

              <Field label="Email *">
                <input
                  className="input"
                  value={form.email ?? ""}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </Field>

              <Field label="Signo *">
                <input className="input" value={form.signo ?? ""} onChange={(e) => onChange("signo", e.target.value)} />
              </Field>

              <Field label="Idade *">
                <input
                  className="input"
                  type="number"
                  value={form.idade ?? ""}
                  onChange={(e) => onChange("idade", Number(e.target.value))}
                />
              </Field>

              <Field label="Tema *">
                <select
                  className="select"
                  value={form.tema ?? "Amor"}
                  onChange={(e) => onChange("tema", e.target.value)}
                >
                  <option>Amor</option>
                  <option>Financeiro</option>
                  <option>Saúde</option>
                  <option>Carreira</option>
                  <option>Espiritualidade</option>
                  <option>Outro</option>
                </select>
              </Field>
            </div>

            {form.tema === "Outro" && (
              <Field label="Qual tema? *">
                <input
                  className="input"
                  value={(form as any).outroTema ?? ""}
                  onChange={(e) => onChange("outroTema" as any, e.target.value)}
                />
              </Field>
            )}

            <Field label="Pergunta (opcional)">
              <textarea
                className="textarea"
                rows={4}
                value={form.pergunta ?? ""}
                onChange={(e) => onChange("pergunta", e.target.value)}
              />
              <div className="small" style={{ marginTop: 6 }}>
                Quanto mais objetiva a pergunta, mais precisa a leitura.
              </div>
            </Field>

            <div className="actions">
              <button className="btn btn-primary" type="submit">
                Continuar para pagamento
              </button>
              <a className="btn btn-ghost" href="/">
                Voltar ao início
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="labelRow">
        <span className="label">{label}</span>
      </div>
      {children}
    </div>
  );
}
