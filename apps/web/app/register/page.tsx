"use client";

import { APP_CONFIG } from "@drivecare/shared";
import { Car } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiPost, setStoredSession, type AuthSession } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const session = await apiPost<AuthSession>("/auth/register", {
        firstName: String(form.get("firstName")),
        lastName: String(form.get("lastName")),
        email: String(form.get("email")),
        password: String(form.get("password")),
        locale: "fr"
      });
      setStoredSession(session);
      router.replace("/dashboard");
    } catch {
      setError("Impossible de creer le compte. Verifiez les informations.");
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
        <h1>Creer un compte</h1>
        <div className="form-grid">
          <div className="field">
            <label>Prenom</label>
            <input name="firstName" required placeholder="Mehdi" />
          </div>
          <div className="field">
            <label>Nom</label>
            <input name="lastName" required placeholder="Boutiti" />
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" required placeholder="vous@example.com" />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input name="password" type="password" minLength={8} required placeholder="8 caracteres minimum" />
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn primary" disabled={loading} type="submit">
          {loading ? "Creation..." : "Creer mon compte"}
        </button>
        <p className="muted">
          Deja inscrit ? <Link href="/login">Se connecter</Link>
        </p>
      </form>
    </main>
  );
}
