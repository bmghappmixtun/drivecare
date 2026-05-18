import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Compte" title="Profil et preferences" />
      <section className="card">
        <div className="form-grid">
          <div className="field">
            <label>Prenom</label>
            <input defaultValue="Nadia" />
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
          <div className="field">
            <label>Theme</label>
            <select defaultValue="system">
              <option value="system">Systeme</option>
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </select>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
