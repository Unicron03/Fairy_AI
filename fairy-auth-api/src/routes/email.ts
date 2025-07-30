// backend/routes/email.ts
import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/report-error", upload.single("helpingFile"), async (req, res) => {
    const { problem, userEmail, userName, userId } = req.body;
    const file = req.file;

    if (!problem || !userEmail || !userName || !userId) {
        return res.status(400).json({ message: "Champs manquants." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER, // e.g. fairyapp@gmail.com
                pass: process.env.GMAIL_PASS, // App password, not your Gmail password
            },
        });

        const mailOptions = {
        from: userEmail,
        to: "assistancefairy@gmail.com",
        subject: "🛠️ Rapport de bug utilisateur",
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                <p>${problem.replace(/\n/g, "<br/>")}</p>

                <hr style="margin: 24px 0;" />

                <p style="color: gray; font-size: 12px;">
                    Envoyé par : <strong>${userName}</strong> (id : ${userId})<br/>
                    Email : <a href="mailto:${userEmail}">${userEmail}</a>
                </p>
            </div>
        `,
        replyTo: userEmail,
        attachments: file
            ? [
                {
                    filename: file.originalname,
                    content: file.buffer,
                },
            ]
            : [],
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email envoyé avec succès." });
    } catch (err) {
        console.error("Erreur d'envoi d'email :", err);
        res.status(500).json({ message: "Échec de l'envoi de l'email." });
    }
});

export default router;