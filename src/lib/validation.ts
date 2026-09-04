import { z } from "zod";

const passwordSchema = z.string().min(8).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must include uppercase, lowercase, and a number.");

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string().min(7).max(20),
  password: passwordSchema
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({ email: z.email() });
export const resetPasswordSchema = z.object({ token: z.string().min(32), password: passwordSchema });

export const orderSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })).min(1),
  paymentMethod: z.enum(["PAYSTACK", "OPAY"]),
  shippingName: z.string().min(2),
  shippingPhone: z.string().min(7),
  shippingEmail: z.email(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2)
});
