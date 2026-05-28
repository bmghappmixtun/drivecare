"use client";

import { APP_CONFIG } from "@drivecare/shared";
import { Car } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiPost, setStoredSession, type AuthSession } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const session = await apiPost<AuthSession>("/auth/login", {
        email: String(form.get("email")),
        password: String(form.get("password"))
      });
      setStoredSession(session);
      router.replace("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-screen">
      <form className="card auth-card" onSubmit={submit}>
        <div className="brand auth-brand">
          <span className="mark">
            <Car size={20} />
          </span>
          {APP_CONFIG.appName}
        </div>
        <h1>Connexion</h1>
        <p className="muted">Accedez a vos vehicules, rappels et historiques.</p>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" required placeholder="vous@example.com" />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input name="password" type="password" required placeholder="Votre mot de passe" />
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn primary" disabled={loading} type="submit">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <p className="muted">
          Pas encore de compte ? <Link href="/register">Creer un compte</Link>
        </p>
      </form>
    </main>
  );
}
