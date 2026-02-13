import { z } from "zod";

export const readingSchema = z.object({
  plano: z.enum(["3", "5", "7"]),
  nome: z.string().min(2),
  whatsapp: z.string().min(8),
  email: z.string().email(),
  tema: z.enum(["Amor", "Financeiro", "Saúde", "Carreira", "Espiritualidade", "Outro"]),
  outroTema: z.string().optional(),
  signo: z.string().min(2),
  idade: z.coerce.number().int().min(10).max(120),
  pergunta: z.string().optional(),
});

export type ReadingForm = z.infer<typeof readingSchema>;
