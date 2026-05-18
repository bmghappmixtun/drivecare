import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";

export default function AdminPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Administration" title="Pilotage plateforme" />
      <section className="grid stats">
        <div className="card stat">
          <span className="muted">Utilisateurs</span>
          <strong>1 284</strong>
        </div>
        <div className="card stat">
          <span className="muted">Vehicules</span>
          <strong>2 941</strong>
        </div>
        <div className="card stat">
          <span className="muted">Alertes envoyees</span>
          <strong>18k</strong>
        </div>
        <div className="card stat">
          <span className="muted">Signalements</span>
          <strong>7</strong>
        </div>
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <h2>Gestion utilisateurs</h2>
        <div className="list">
          {["admin@drivecare.app", "client@example.com", "fleet@company.com"].map((email) => (
            <div className="row" key={email}>
              <strong>{email}</strong>
              <span className="status ok">Actif</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
