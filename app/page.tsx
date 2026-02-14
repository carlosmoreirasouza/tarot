"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function goToConsulta() {
    router.push("/consulta");
  }

  function scrollToHowItWorks() {
    const el = document.getElementById("como-funciona");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      }}
    >
      <header
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "28px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(145deg, rgba(120,70,180,0.16), rgba(160,120,220,0.08))",
              border: "1px solid rgba(120,70,180,0.20)",
              boxShadow: "0 10px 30px rgba(120,70,180,0.10)",
              fontSize: 18,
            }}
            aria-hidden
          >
            🔮
          </div>
          <div>
            <div style={{ fontWeight: 800, letterSpacing: "-0.2px" }}>
              Altar Místico
            </div>
            <div style={{ fontSize: 12, color: "#5a4b73" }}>
              Consultas personalizadas
            </div>
          </div>
        </div>

        <button
          onClick={goToConsulta}
          style={{
            cursor: "pointer",
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(120,70,180,0.22)",
            background:
              "linear-gradient(145deg, rgba(120,70,180,0.10), rgba(160,120,220,0.08))",
            color: "#2a163e",
            fontWeight: 700,
          }}
        >
          Fazer consulta
        </button>
      </header>

      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "40px 20px 10px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 22,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 44,
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Consulta de Tarot{" "}
            <span style={{ color: "#6a33b8" }}>Personalizada</span>
          </h1>

          <p
            style={{
              marginTop: 16,
              fontSize: 18,
              lineHeight: 1.7,
              color: "#3a2a55",
              maxWidth: 620,
            }}
          >
            Responda algumas perguntas rápidas e receba uma leitura dirigida para
            o tema que você precisa agora — amor, finanças, saúde, carreira e
            mais.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <button
              onClick={goToConsulta}
              style={{
                cursor: "pointer",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "linear-gradient(180deg, #111 0%, #000 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 16,
                boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
              }}
            >
              Quero minha consulta
            </button>

            <button
              onClick={scrollToHowItWorks}
              style={{
                cursor: "pointer",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(120,70,180,0.20)",
                background: "#fff",
                color: "#2a163e",
                fontWeight: 800,
                fontSize: 16,
                boxShadow: "0 14px 35px rgba(120,70,180,0.08)",
              }}
            >
              Como funciona
            </button>
          </div>

          <div
            style={{
              marginTop: 26,
              padding: 18,
              borderRadius: 16,
              background:
                "linear-gradient(145deg, rgba(120,70,180,0.10), rgba(160,120,220,0.06))",
              border: "1px solid rgba(120,70,180,0.22)",
              boxShadow: "0 14px 40px rgba(120,70,180,0.10)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#3b2c54",
                lineHeight: 1.7,
                textAlign: "left",
              }}
            >
              ✨ <b>Transparência:</b> todas as leituras são realizadas{" "}
              <b>manualmente por uma pessoa</b>, com interpretação intuitiva e
              dedicada. <b>Não utilizamos IA</b> para gerar respostas automáticas.
            </p>
          </div>
        </div>

        <div
          style={{
            borderRadius: 18,
            background: "#ffffff",
            border: "1px solid rgba(120,70,180,0.18)",
            boxShadow: "0 18px 60px rgba(120,70,180,0.12)",
            padding: 18,
            alignSelf: "start",
          }}
        >
          <div
            style={{
              borderRadius: 14,
              padding: 16,
              background:
                "radial-gradient(500px 220px at 30% 0%, rgba(120,70,180,0.14), transparent 60%)," +
                "linear-gradient(180deg, #ffffff 0%, #fbf7ff 100%)",
              border: "1px solid rgba(120,70,180,0.12)",
            }}
          >
            <div style={{ fontWeight: 900, color: "#2a163e", fontSize: 16 }}>
              Planos disponíveis
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <PlanCard title="3 cartas" price="R$ 29,90" desc="Leitura objetiva e direta para um tema." />
              <PlanCard title="5 cartas" price="R$ 49,90" desc="Mais contexto, aconselhamento e caminho." />
              <PlanCard title="Completo (7 cartas)" price="R$ 99,90" desc="Leitura profunda com visão ampla." />
            </div>

            <button
              onClick={goToConsulta}
              style={{
                marginTop: 14,
                width: "100%",
                cursor: "pointer",
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(120,70,180,0.20)",
                background:
                  "linear-gradient(145deg, rgba(106,51,184,0.12), rgba(160,120,220,0.10))",
                color: "#2a163e",
                fontWeight: 900,
              }}
            >
              Escolher plano e começar →
            </button>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, color: "#6c5a86", lineHeight: 1.6 }}>
            Atendimento e entrega combinados após confirmação do pagamento.
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "28px 20px 64px",
        }}
      >
        <h2
          style={{
            fontSize: 28,
            margin: "18px 0 8px",
            letterSpacing: "-0.5px",
          }}
        >
          Como funciona
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginTop: 14,
          }}
        >
          <StepCard
            n="1"
            title="Você preenche o formulário"
            text="Escolhe o tema da consulta e informa seus dados (idade, signo, etc.)."
          />
          <StepCard
            n="2"
            title="Você confirma e paga"
            text="Você recebe as instruções do pagamento e finaliza a confirmação."
          />
          <StepCard
            n="3"
            title="Eu preparo a leitura"
            text="Após confirmado, eu realizo a consulta manualmente e te respondo com a leitura."
          />
        </div>

        <div
          style={{
            marginTop: 26,
            padding: 18,
            borderRadius: 16,
            background: "#fff",
            border: "1px solid rgba(120,70,180,0.16)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontWeight: 900, color: "#2a163e" }}>
            Pronto para começar?
          </div>
          <div style={{ marginTop: 6, color: "#4b3f63", lineHeight: 1.7 }}>
            Escolha seu plano e envie seus dados. Você será atendido de forma
            pessoal e dedicada.
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <button
              onClick={goToConsulta}
              style={{
                cursor: "pointer",
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "linear-gradient(180deg, #111 0%, #000 100%)",
                color: "#fff",
                fontWeight: 900,
              }}
            >
              Ir para a consulta
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                cursor: "pointer",
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid rgba(120,70,180,0.20)",
                background: "#fff",
                color: "#2a163e",
                fontWeight: 900,
              }}
            >
              Voltar ao topo
            </button>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid rgba(120,70,180,0.14)",
          background: "rgba(255,255,255,0.65)",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            color: "#6c5a86",
            fontSize: 12,
          }}
        >
          <div>© {new Date().getFullYear()} Altar Místico</div>
          <div>Leituras 100% humanas • Atendimento pessoal</div>
        </div>
      </footer>

      <style jsx global>{`
        @media (max-width: 900px) {
          section {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 720px) {
          h1 {
            font-size: 38px !important;
          }
        }
      `}</style>
    </main>
  );
}

function PlanCard(props: { title: string; price: string; desc: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: 12,
        background: "#fff",
        border: "1px solid rgba(120,70,180,0.14)",
        boxShadow: "0 10px 30px rgba(120,70,180,0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 900, color: "#2a163e" }}>{props.title}</div>
        <div style={{ fontWeight: 900, color: "#6a33b8" }}>{props.price}</div>
      </div>
      <div style={{ marginTop: 6, fontSize: 13, color: "#5a4b73", lineHeight: 1.6 }}>
        {props.desc}
      </div>
    </div>
  );
}

function StepCard(props: { n: string; title: string; text: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 16,
        background: "#fff",
        border: "1px solid rgba(120,70,180,0.16)",
        boxShadow: "0 14px 45px rgba(120,70,180,0.08)",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          color: "#2a163e",
          background:
            "linear-gradient(145deg, rgba(120,70,180,0.16), rgba(160,120,220,0.08))",
          border: "1px solid rgba(120,70,180,0.18)",
        }}
        aria-hidden
      >
        {props.n}
      </div>
      <div style={{ marginTop: 10, fontWeight: 900, color: "#2a163e" }}>
        {props.title}
      </div>
      <div style={{ marginTop: 6, color: "#5a4b73", lineHeight: 1.7 }}>
        {props.text}
      </div>
    </div>
  );
}
