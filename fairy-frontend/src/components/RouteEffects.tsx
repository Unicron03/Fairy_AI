import { useUser } from "@/context/UserContext"
import { useEffect, useRef } from "react"
import { useLocation, Navigate } from "react-router-dom"
import { toast } from "react-toastify"

export function RequireAdmin({ children }: { children: React.ReactNode }) {
    const { user, isReady } = useUser()
    const location = useLocation()

    useEffect(() => {
    if (isReady && (!user || user.role !== "ADMIN")) {
        toast.error("Accès refusé : réservé aux administrateurs.", {
            progressClassName: "fancy-progress-bar",
            closeOnClick: true,
            autoClose: 5000,
            theme: localStorage.getItem("theme") || "light"
        })
    }
    }, [user, isReady, location.pathname])


    if (!isReady) return null // ou un spinner

    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/" replace state={{ from: location }} />
    }

    return <>{children}</>
}

export function NotFoundRedirect() {
  const { user, isReady, logout } = useUser()
  const hasRun = useRef(false) // empêche le useEffect de relancer plusieurs fois

  useEffect(() => {
    if (!hasRun.current && isReady) {
      hasRun.current = true

      toast.error("Cette page n'existe pas. Vous avez été déconnecté.", {
        progressClassName: "fancy-progress-bar",
        closeOnClick: true,
        autoClose: 5000,
        theme: localStorage.getItem("theme") || "light"
      })

      if (user) logout()
    }
  }, [isReady, user, logout])

  return <Navigate to="/" replace />
}
