import Link from "next/link";

export default function TiragemPage() {
  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>🔮 Tiragem de Tarot Personalizada</h1>
      <p style={{ lineHeight: 1.6, fontSize: 16 }}>
        Você responde algumas perguntas rápidas e recebe uma leitura direcionada para o tema que você precisa
        agora (amor, financeiro, saúde, carreira e mais).
      </p>

      <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/tiragem"
          style={{
            background: "black",
            color: "white",
            padding: "12px 18px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Quero minha tiragem
        </Link>

        <a
          href="#como-funciona"
          style={{
            border: "1px solid #ddd",
            padding: "12px 18px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 600,
            color: "black",
          }}
        >
          Como funciona
        </a>
      </div>

      <section id="como-funciona" style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22 }}>Como funciona</h2>
        <ol style={{ lineHeight: 1.8 }}>
          <li>Você preenche o formulário com o tema e seus dados.</li>
          <li>Você confirma e segue para o pagamento via Stone.</li>
          <li>Após o pagamento, você recebe a confirmação e eu preparo sua leitura.</li>
        </ol>
      </section>

      <footer style={{ marginTop: 60, fontSize: 12, opacity: 0.75 }}>
        Atendimento e entrega combinados após confirmação do pagamento.
      </footer>
    </main>
  );
}
