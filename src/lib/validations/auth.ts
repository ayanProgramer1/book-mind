import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
      .max(60, "Numele este prea lung."),
    email: z.string().trim().email("Adresă de email invalidă."),
    occupation: z
      .string()
      .trim()
      .min(2, "Spune-ne cu ce te ocupi.")
      .max(60, "Ocupația este prea lungă."),
    password: z
      .string()
      .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
      .max(72, "Parola este prea lungă."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu coincid.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Adresă de email invalidă."),
  password: z.string().min(1, "Introdu parola."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Introdu parola curentă."),
    newPassword: z
      .string()
      .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
      .max(72, "Parola este prea lungă."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parolele nu coincid.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
