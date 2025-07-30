import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import emailRoutes from "./routes/email"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api", authRoutes)
app.use("/api/email", emailRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ Auth API running on http://localhost:${PORT}`)
})

app.get("/", (req, res) => {
  res.send("API Auth Fairy is running")
})