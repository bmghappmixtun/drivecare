"use client";

import { MAINTENANCE_CATEGORIES } from "@drivecare/shared";
import { FileUp, Plus, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";
import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { apiGet, apiPost, type AuthSession } from "../../lib/api";

type Vehicle = { id: string; brand: string; model: string; currentMileage: number };
type MaintenanceRecord = {
  id: string;
  vehicleId: string;
  category: string;
  customCategory?: string | null;
  performedAt: string;
  mileage: number;
  cost: string | number;
  garageName?: string | null;
};

export default function MaintenancePage() {
  return <AuthGuard>{(session) => <MaintenanceContent session={session} />}</AuthGuard>;
}

function MaintenanceContent({ session }: { session: AuthSession }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [vehicleRows, historyRows] = await Promise.all([
        apiGet<Vehicle[]>("/vehicles", session.accessToken),
        apiGet<MaintenanceRecord[]>("/maintenance/history", session.accessToken)
      ]);
      setVehicles(vehicleRows);
      setHistory(historyRows);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const performedAt = `${String(form.get("performedAt"))}T00:00:00.000Z`;

    try {
      await apiPost(
        "/maintenance",
        {
          vehicleId: String(form.get("vehicleId")),
          category: String(form.get("category")),
          performedAt,
          mileage: Number(form.get("mileage")),
          cost: Number(form.get("cost") || 0),
          garageName: String(form.get("garageName") || ""),
          notes: String(form.get("notes") || ""),
          partsReplaced: []
        },
        session.accessToken
      );
      event.currentTarget.reset();
      setMessage("Entretien ajoute et prochain rappel calcule.");
      await load();
    } catch {
      setMessage("Impossible d'ajouter l'entretien.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Historique" title="Entretiens et factures">
        <button className="btn" onClick={load} type="button">
          <RefreshCw size={17} /> Actualiser
        </button>
      </PageHeader>
      <section className="grid two">
        <div className="card">
          <div className="list">
            {loading ? <p className="muted">Chargement de l'historique...</p> : null}
            {!loading && history.length === 0 ? <p className="muted">Aucun entretien enregistre.</p> : null}
            {history.map((item) => {
              const vehicle = vehicles.find((row) => row.id === item.vehicleId);
              return (
                <div className="row" key={item.id}>
                  <div>
                    <strong>{item.customCategory || item.category}</strong>
                    <div className="muted">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicule"} · {item.performedAt.slice(0, 10)} ·{" "}
                      {item.mileage.toLocaleString("fr-FR")} km
                    </div>
                  </div>
                  <strong>{Number(item.cost).toFixed(0)} EUR</strong>
                </div>
              );
            })}
          </div>
        </div>
        <form className="card" onSubmit={submit}>
          <h2>Nouvelle intervention</h2>
          <div className="form-grid">
            <div className="field">
              <label>Vehicule</label>
              <select name="vehicleId" required>
                <option value="">Choisir</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Categorie</label>
              <select name="category" defaultValue="oil_change">
                {MAINTENANCE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Cout</label>
              <input name="cost" type="number" min="0" placeholder="120" />
            </div>
            <div className="field">
              <label>Date</label>
              <input name="performedAt" type="date" required />
            </div>
            <div className="field">
              <label>Kilometrage</label>
              <input name="mileage" type="number" min="0" placeholder="52000" required />
            </div>
            <div className="field">
              <label>Garage</label>
              <input name="garageName" placeholder="Garage Central" />
            </div>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Notes</label>
            <textarea name="notes" rows={4} />
          </div>
          {message ? <p className="muted">{message}</p> : null}
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn" type="button">
              <FileUp size={17} /> Facture
            </button>
            <button className="btn primary" disabled={saving || vehicles.length === 0} type="submit">
              <Plus size={17} /> {saving ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
