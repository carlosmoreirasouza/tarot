export default function Home() {
  return (
    <main className="container">
      <div className="card">
        <div className="header">
          <h1 className="h1">🔮 Tiragem de Tarot</h1>
          <p className="lead">
            Uma leitura objetiva e personalizada para o tema que você precisa agora — com um tom místico, mas
            com clareza e foco.
          </p>

          <div className="actions">
            <a className="btn btn-primary" href="/tiragem">
              Quero minha tiragem
            </a>
            <a className="btn btn-ghost" href="#como-funciona">
              Como funciona
            </a>
          </div>
        </div>

        <div className="section" id="como-funciona">
          <h2 style={{ marginTop: 0 }}>Como funciona</h2>
          <ol style={{ lineHeight: 1.9, marginBottom: 0, color: "rgba(29,21,40,.85)" }}>
            <li>Você preenche o formulário com o tema e seus dados.</li>
            <li>Você segue para o pagamento via Stone.</li>
            <li>Após pagar, você confirma e eu envio sua leitura.</li>
          </ol>

          <p className="small" style={{ marginTop: 16 }}>
            Atendimento e entrega combinados após confirmação do pagamento.
          </p>
        </div>
      </div>
    </main>
  );
}
