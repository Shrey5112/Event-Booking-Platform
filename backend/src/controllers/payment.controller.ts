import Stripe from "stripe";
import type { Request, Response } from "express";
import Joi from "joi";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

// ✅ Joi Schema: expects paymentMethodId instead of raw card info
const paymentSchema = Joi.object({
  amount: Joi.number().integer().min(50).required(), // in paise
  currency: Joi.string().default("inr"),
  paymentMethodId: Joi.string().required(),
  customerName: Joi.string().min(3).max(50).required(),
  customerEmail: Joi.string().email().required(),
});

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { amount, currency, paymentMethodId, customerEmail } = value;

    // ✅ Create and confirm PaymentIntent using paymentMethodId
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirmation_method: "automatic",
      confirm: true,
      receipt_email: customerEmail,
      return_url: `${process.env.CLIENT_ORIGIN}/success`,
    });

    // ✅ Redirect based on status
    if (paymentIntent.status === "succeeded") {
      return res.status(200).json({ success: true, redirectUrl: `${process.env.CLIENT_ORIGIN}/success` });
    } else {
      return res.status(200).json({ success: false, redirectUrl: `${process.env.CLIENT_ORIGIN}/cancel` });
    }
  } catch (err: any) {
    console.error("Payment Error:", err);
    res.status(500).json({ success: false, message: err.message || "Payment failed" });
  }
};
