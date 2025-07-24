import express from "express"
import { Prisma, PrismaClient } from "@prisma/client"
import { comparePasswords, hashPassword } from "../utils/hash"

const router = express.Router()
const prisma = new PrismaClient()

// Essai connexion et récup des infos
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

// Récupération des utilisateurs (si admin)
// GET /users (Admin only)
router.get("/users", async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true
			},
		})
		res.json(users)
	} catch (error) {
		res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." })
	}
})

// Suppression d'un utilisateur
// DELETE /users/:id
router.delete("/users/:id", async (req, res) => {
	const { id } = req.params;

	try {
		// Grâce à `onDelete: Cascade` dans le schéma, Prisma supprime automatiquement
		// les conversations et messages liés à cet utilisateur.
		await prisma.user.delete({
			where: { id },
		});

		res.status(204).send();
	} catch (error) {
		console.error("Erreur lors de la suppression de l'utilisateur :", error);
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
			return res.status(404).json({ error: "Utilisateur introuvable." });
		}
		res.status(500).json({ error: "Erreur serveur lors de la suppression de l'utilisateur." });
	}
});

// Modification d'un utilisateur
// PUT /api/users/:id
router.put("/users/:id", async (req, res) => {
	const { id } = req.params;
	const { name, email, password } = req.body;

	if (!name && !email && !password) {
		return res.status(400).json({ error: "Au moins un champ (nom, email, mot de passe) est requis." });
	}

	try {
		const updateData: { name?: string; email?: string; password?: string } = {};

		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (password && password.length > 0) {
			updateData.password = await hashPassword(password);
		}

		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
			select: { id: true, name: true, email: true, role: true }
		});

		res.json(updatedUser);
	} catch (error) {
		console.error("Erreur lors de la modification de l'utilisateur :", error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2025') {
				return res.status(404).json({ error: "Utilisateur introuvable." });
			}
			if (error.code === 'P2002') {
				return res.status(409).json({ error: "Ce nom d'utilisateur ou cet email est déjà utilisé." });
			}
		}
		res.status(500).json({ error: "Erreur serveur lors de la modification de l'utilisateur." });
	}
});

// Création d'un utilisateur
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

// Création d'une conversation
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

// Récupération des conversations d'un utilisateur
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

// Récupération des messages d'une conversation
// GET /api/conversations/:id
router.get("/conversations/:id", async (req, res) => {
	const { id } = req.params;
	
	try {
		const conversation = await prisma.conversation.findUnique({
			where: { id },
			include: {
				messages: {
					// orderBy: { createdAt: "asc" } // pour les afficher dans l’ordre
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

// POST /api/conversations/:id/rename
router.post("/conversations/:id/rename", async (req, res) => {
	const { id } = req.params;
	const { newName } = req.body;

	console.log(id, newName)

	if (!newName || typeof newName !== "string") {
		return res.status(400).json({ error: "Le nouveau nom est requis et doit être une chaîne de caractères." });
	}

	try {
		const updated = await prisma.conversation.update({
			where: { id },
			data: { convName: newName }
		});

		res.status(200).json(updated);
	} catch (err) {
		console.error("Erreur lors du renommage :", err);
		res.status(500).json({ error: "Erreur serveur lors du renommage de la conversation." });
	}
});

// Suppression conversation
// DELETE /api/conversations/:id
router.delete("/conversations/:id", async (req, res) => {
	const { id } = req.params
	
	try {
		await prisma.message.deleteMany({ where: { conversationId: id } }) // supprimer les messages liés
		await prisma.conversation.delete({ where: { id } }) // supprimer la conversation
		res.status(204).send()
	} catch (err) {
		console.error("Erreur lors de la suppression :", err)
		res.status(500).json({ error: "Erreur serveur" })
	}
})

// Sauvegarde messages
// POST /api/conversations/:id/messages
router.post('/conversations/:id/messages', async (req, res) => {
	const { id: conversationId } = req.params;
	const { question, answer, tokens, duration } = req.body;
	
	try {
		console.log("Création d'un message pour la conversation :", conversationId)
		// Vérifier si la conversation existe
		const existing = await prisma.conversation.findUnique({
			where: { id: conversationId },
		});
		
		if (!existing) {
			return res.status(404).json({ error: "Conversation introuvable" });
		}
		
		// Créer un message lié à la conversation
		const message = await prisma.message.create({
			data: {
				conversationId,
				question,
				answer,
				tokens,
				duration
			}
		});
		
		res.status(201).json(message);
	} catch (error) {
		console.error("Erreur lors de la création du message :", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
})

// GET /api/stats/:userId
router.get("/stats/:userId", async (req, res) => {
	const { userId } = req.params;

	if (!userId || typeof userId !== "string") {
		return res.status(400).json({ error: "userId invalide." });
	}

	try {
		// Compter les conversations de l'utilisateur
		const conversationsCount = await prisma.conversation.count({
			where: { userId },
		});

		// Récupérer tous les messages liés à ses conversations
		const messages = await prisma.message.findMany({
			where: {
				conversation: {
					userId,
				},
			},
			select: {
				tokens: true,
			},
		});

		const messagesCount = messages.length;
		const tokensCount = messages.reduce((acc, msg) => acc + (msg.tokens || 0), 0);

		res.json({
			conversationsCount,
			messagesCount,
			tokensCount,
		});
	} catch (error) {
		console.error("Erreur lors du calcul des stats :", error);
		res.status(500).json({ error: "Erreur serveur." });
	}
});

export default router