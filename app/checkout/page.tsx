import { Suspense } from "react";

const prices: Record<string, { valor: number; descricao: string }> = {
  "3": { valor: 29.9, descricao: "Consulta 3 cartas" },
  "5": { valor: 49.9, descricao: "Consulta 5 cartas" },
  "7": { valor: 99.9, descricao: "Consulta completa 7 cartas" },
};

const qrByPlan: Record<string, string> = {
  "3": "/qr/pix-3.png",
  "5": "/qr/pix-5.png",
  "7": "/qr/pix-7.png",
};

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { plano?: string };
}) {
  const plano = searchParams?.plano ?? "3";

  const planoInfo = prices[plano] ?? prices["3"];
  const qrSrc = qrByPlan[plano] ?? qrByPlan["3"];

  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY;
  const pixName = process.env.NEXT_PUBLIC_PIX_NAME;
  const pixCity = process.env.NEXT_PUBLIC_PIX_CITY;

  const referencia =
    "CONS-" +
    plano +
    "-" +
    Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f0ff, #ffffff)",
        padding: 20,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: "100%",
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(80, 0, 120, 0.1)",
        }}
      >
        <h2 style={{ color: "#4b2e83", marginBottom: 20 }}>
          💜 Finalizar Consulta
        </h2>

        <div
          style={{
            background: "#e8f5e9",
            padding: 15,
            borderRadius: 12,
            marginBottom: 20,
            color: "#1b5e20",
            fontWeight: 500,
          }}
        >
          ✅ Enviado! Agora faça o PIX para confirmar.
        </div>

        <div
          style={{
            background: "#f3e9ff",
            padding: 20,
            borderRadius: 16,
            marginBottom: 25,
          }}
        >
          <h3 style={{ color: "#4b2e83", marginBottom: 15 }}>
            PIX — R$ {planoInfo.valor.toFixed(2)}
          </h3>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={qrSrc}
              alt="QR Code PIX"
              style={{
                width: 220,
                height: 220,
                borderRadius: 12,
                background: "#fff",
                padding: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <p><strong>Chave:</strong> {pixKey}</p>
          <p><strong>Nome:</strong> {pixName}</p>
          <p><strong>Cidade:</strong> {pixCity}</p>
          <p><strong>Referência:</strong> {referencia}</p>

          <p style={{ marginTop: 15, fontSize: 14, color: "#555" }}>
            Após o pagamento, envie o comprovante no WhatsApp.
          </p>
        </div>

        <a
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            padding: 14,
            borderRadius: 14,
            border: "1px solid #ccc",
            background: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
}