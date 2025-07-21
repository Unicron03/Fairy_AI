import express from "express"
import { PrismaClient } from "@prisma/client"
import { comparePasswords, hashPassword } from "../utils/hash"

const router = express.Router()
const prisma = new PrismaClient()

// POST /login
router.post("/login", async (req, res) => {
  const { name, password } = req.body

  console.log("Tentative de connexion :", name)

  const user = await prisma.user.findUnique({
    where: { name }
  })

  if (!user) {
    res.status(401).json({ error: "Utilisateur introuvable" })
    return
  }

  const isValid = await comparePasswords(password, user.password)
  if (!isValid) {
    res.status(401).json({ error: "Mot de passe incorrect" })
    return
  }

  console.log("Utilisateur : ", user, isValid)

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  })
})

// GET /users (Admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // risqué
      },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." })
  }
})

// POST /register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body
  const hashed = await hashPassword(password)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role === "ADMIN" ? "ADMIN" : "USER"
      }
    })

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de l'inscription", details: error })
  }
})

// POST /api/conversations
router.post("/conversations", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const conversation = await prisma.conversation.create({
      data: { userId }
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de la conversation" });
  }
});

// GET /api/conversations?userId=xxx
router.get("/conversations", async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    res.status(400).json({ error: "Missing userId" })
    return
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId: String(userId) },
    orderBy: { createdAt: "desc" }
  })

  res.json(conversations)
})

// GET /api/conversations/:id
router.get("/conversations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" } // pour les afficher dans l’ordre
        }
      }
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation introuvable" });
      return;
    }

    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router
