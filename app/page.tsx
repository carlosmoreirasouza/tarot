export default function Home() {
  return (
    <main className="container">
      <div className="card">
        <div className="header">
          <h1 className="h1">🔮 Escolha sua Tiragem</h1>
          <p className="lead">
            Escolha o nível de profundidade da sua leitura.
          </p>
        </div>

        <div className="section">
          <div className="grid2">
            
            <Plano
              titulo="3 Cartas"
              descricao="Leitura direta e objetiva para um tema específico."
              preco="R$ 29,90"
              plano="3"
            />

            <Plano
              titulo="5 Cartas"
              descricao="Análise mais profunda com orientação prática."
              preco="R$ 49,90"
              plano="5"
            />

            <Plano
              titulo="7 Cartas - Completo"
              descricao="Leitura completa com visão espiritual e caminhos futuros."
              preco="R$ 99,90"
              plano="7"
            />

          </div>
        </div>
      </div>
    </main>
  );
}

function Plano({ titulo, descricao, preco, plano }: any) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <h3 style={{ marginTop: 0 }}>{titulo}</h3>
      <p style={{ color: "rgba(29,21,40,.75)" }}>{descricao}</p>
      <strong style={{ fontSize: 20 }}>{preco}</strong>

      <div style={{ marginTop: 14 }}>
        <a
          className="btn btn-primary"
          href={`/tiragem?plano=${plano}`}
        >
          Escolher
        </a>
      </div>
    </div>
  );
}
