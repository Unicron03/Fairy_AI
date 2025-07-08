import express from "express"
import { PrismaClient } from "@prisma/client"
import { comparePasswords, hashPassword } from "../utils/hash"

const router = express.Router()
const prisma = new PrismaClient()

// POST /login
router.post("/login", async (req, res) => {
  const { id, password } = req.body

  const user = await prisma.user.findUnique({
    where: { identifier: id }
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

  // Ici : on n'utilise PAS `return res.json(...)`
  res.json({
    id: user.identifier,
    role: user.role
  })
})

// POST /register (optionnel)
router.post("/register", async (req, res) => {
  const { id, password, role } = req.body
  const hashed = await hashPassword(password)

  try {
    const user = await prisma.user.create({
      data: {
        identifier: id,
        password: hashed,
        role: role === "ADMIN" ? "ADMIN" : "USER"
      }
    })
    res.status(201).json({ id: user.identifier, role: user.role })
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de l'inscription" })
  }
})

export default router
