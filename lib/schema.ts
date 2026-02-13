import { z } from "zod"; export 
const readingSchema = z.object({
  nome: z.string().min(2, 
  "Informe seu nome"), whatsapp: 
  z.string().min(8, "Informe um 
  WhatsApp válido"), email: 
  z.string().email("Email 
  inválido"), tema: 
  z.enum(["Amor", "Financeiro", 
  "Saúde", "Carreira", 
  "Espiritualidade", "Outro"]), 
  outroTema: 
  z.string().optional(), signo: 
  z.string().min(2, "Informe seu 
  signo"), idade: 
  z.coerce.number().int().min(10).max(120), 
  pergunta: 
  z.string().max(400).optional(),
});
export type ReadingForm = z.infer<typeof readingSchema>;
