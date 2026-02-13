export const runtime = "nodejs";

import nodemailer from "nodemailer";

type Payload = {
  nome?: string;
  email?: string;
  whatsapp?: string;
  tema?: string;
  signo?: string;
  idade?: number;
  plano?: string;
  valor?: number;
  descricao?: string;
  referencia?: string;
  metodo?: string;
};

function must(name: string, v?: string) {
  if (!v) throw new Error(`ENV faltando: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Payload;

    // ✅ validação mínima (pra não enviar email vazio)
    if (!data?.nome || !data?.whatsapp || !data?.tema || !data?.plano) {
      return Response.json(
        { ok: false, error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const SMTP_HOST = must("SMTP_HOST", process.env.SMTP_HOST);
    const SMTP_PORT = Number(must("SMTP_PORT", process.env.SMTP_PORT));
    const SMTP_USER = must("SMTP_USER", process.env.SMTP_USER);
    const SMTP_PASS = must("SMTP_PASS", process.env.SMTP_PASS);
    const MAIL_TO = must("MAIL_TO", process.env.MAIL_TO);
    const MAIL_FROM = process.env.MAIL_FROM || `Tarot <${SMTP_USER}>`;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = true, 587 = false
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    // ✅ garante que SMTP está OK (se falhar, retorna 500)
    await transporter.verify();

    const subject = `🃏 Novo pedido Tarot (${data.plano}) - ${data.nome}`;

    const text = `
NOVO PEDIDO - TAROT

Nome: ${data.nome}
Email: ${data.email ?? "-"}
WhatsApp: ${data.whatsapp}
Tema: ${data.tema}
Signo: ${data.signo ?? "-"}
Idade: ${data.idade ?? "-"}
Plano: ${data.plano}
Valor: ${data.valor ?? "-"}
Descrição: ${data.descricao ?? "-"}
Referência: ${data.referencia ?? "-"}
Método: ${data.metodo ?? "-"}

Data: ${new Date().toISOString()}
`.trim();

    const info = await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject,
      text,
    });

    console.log("EMAIL_SENT", {
      to: MAIL_TO,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return Response.json({ ok: true, messageId: info.messageId });
  } catch (err: any) {
    console.error("EMAIL_ERROR", err?.message, err);
    return Response.json(
      { ok: false, error: err?.message ?? "Erro ao enviar email" },
      { status: 500 }
    );
  }
}