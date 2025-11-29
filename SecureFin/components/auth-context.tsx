"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type UserRole = "user" | "admin" | null

interface AuthContextType {
    isLoggedIn: boolean
    role: UserRole
    login: (role: UserRole) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [role, setRole] = useState<UserRole>(null)
    const router = useRouter()

    // Persist auth state
    useEffect(() => {
        const storedAuth = localStorage.getItem("isLoggedIn")
        const storedRole = localStorage.getItem("userRole") as UserRole
        if (storedAuth === "true") {
            setIsLoggedIn(true)
            setRole(storedRole)
        }
    }, [])

    const login = (selectedRole: UserRole) => {
        setIsLoggedIn(true)
        setRole(selectedRole)
        localStorage.setItem("isLoggedIn", "true")
        if (selectedRole) {
            localStorage.setItem("userRole", selectedRole)
        }
        router.push("/dashboard")
    }

    const logout = () => {
        setIsLoggedIn(false)
        setRole(null)
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userRole")
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
