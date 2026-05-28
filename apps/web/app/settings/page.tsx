"use client";

import { AuthGuard } from "../../components/auth/auth-guard";
import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { type AuthSession } from "../../lib/api";

export default function SettingsPage() {
  return <AuthGuard>{(session) => <SettingsContent session={session} />}</AuthGuard>;
}

function SettingsContent({ session }: { session: AuthSession }) {
  return (
    <AppShell>
      <PageHeader eyebrow="Compte" title="Profil et preferences" />
      <section className="card">
        <div className="form-grid">
          <div className="field">
            <label>Email</label>
            <input readOnly value={session.user.email} />
          </div>
          <div className="field">
            <label>Role</label>
            <input readOnly value={session.user.role} />
          </div>
          <div className="field">
            <label>Langue</label>
            <select defaultValue="fr">
              <option value="fr">Francais</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div className="field">
            <label>Notifications</label>
            <select defaultValue="all">
              <option value="all">Push + email + in-app</option>
              <option value="critical">Critiques seulement</option>
            </select>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
