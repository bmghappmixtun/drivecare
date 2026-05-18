import { MAINTENANCE_CATEGORIES } from "@drivecare/shared";
import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { history } from "../../lib/mock-data";
import { FileUp, Plus } from "lucide-react";

export default function MaintenancePage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Historique" title="Entretiens et factures">
        <button className="btn primary">
          <Plus size={17} /> Ajouter entretien
        </button>
      </PageHeader>
      <section className="grid two">
        <div className="card">
          <div className="list">
            {history.map((item) => (
              <div className="row" key={`${item.label}-${item.date}`}>
                <div>
                  <strong>{item.label}</strong>
                  <div className="muted">
                    {item.vehicle} · {item.date}
                  </div>
                </div>
                <strong>{item.cost} EUR</strong>
              </div>
            ))}
          </div>
        </div>
        <form className="card">
          <h2>Nouvelle intervention</h2>
          <div className="form-grid">
            <div className="field">
              <label>Categorie</label>
              <select>
                {MAINTENANCE_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Cout</label>
              <input placeholder="120" />
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" />
            </div>
            <div className="field">
              <label>Kilometrage</label>
              <input placeholder="52000" />
            </div>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Notes</label>
            <textarea rows={4} />
          </div>
          <button className="btn" style={{ marginTop: 12 }} type="button">
            <FileUp size={17} /> Joindre facture
          </button>
        </form>
      </section>
    </AppShell>
  );
}
