import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      nome,
      whatsapp,
      email,
      tema,
      outroTema,
      signo,
      idade,
      pergunta,
    } = data ?? {};

    const temaFinal = tema === "Outro" ? (outroTema || "Outro") : tema;

    // SMTP (você configura no .env.local)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = process.env.MAIL_TO;
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    if (!to) {
      return Response.json({ ok: false, error: "MAIL_TO não configurado" }, { status: 500 });
    }

    const subject = `🔮 Nova tiragem paga: ${nome || "Cliente"}`;
    const text =
`Nova solicitação de tiragem (pós-pagamento)

Nome: ${nome || "-"}
WhatsApp: ${whatsapp || "-"}
Email: ${email || "-"}

Tema: ${temaFinal || "-"}
Signo: ${signo || "-"}
Idade: ${idade ?? "-"}

Pergunta:
${(pergunta || "-").toString().trim()}
`;

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: email || undefined, // facilita você responder
    });

    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || "Erro desconhecido" }, { status: 500 });
  }
}
