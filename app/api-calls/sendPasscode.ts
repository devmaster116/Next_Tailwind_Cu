import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import nodemailer from "nodemailer";
type Data = {
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { email } = req.body as { email: string };

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER as string,
        pass: process.env.GMAIL_PASS as string,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER as string,
      to: email,
      subject: "Your Generated Passcode",
      text: `Your passcode is: ${passcode}`,
      html: `<p>Your passcode is: <strong>${passcode}</strong></p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Passcode sent successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Failed to send passcode",
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
