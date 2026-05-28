"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getStoredSession, type AuthSession } from "../../lib/api";

export function AuthGuard({ children }: { children: (session: AuthSession) => ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredSession();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setSession(stored);
    setReady(true);
  }, [router]);

  if (!ready || !session) {
    return (
      <div className="auth-screen">
        <div className="card auth-card">
          <p className="muted">Chargement de votre garage...</p>
        </div>
      </div>
    );
  }

  return <>{children(session)}</>;
}
