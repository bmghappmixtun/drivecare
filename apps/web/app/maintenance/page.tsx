"use client";

import { MAINTENANCE_CATEGORIES } from "@drivecare/shared";
import { FileUp, Plus, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";
import { AppShell } from "../../components/app-shell";
import { FieldLabel, FormAlert } from "../../components/form";
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
type Feedback = { tone: "success" | "error" | "info"; text: string };

export default function MaintenancePage() {
  return <AuthGuard>{(session) => <MaintenanceContent session={session} />}</AuthGuard>;
}

function MaintenanceContent({ session }: { session: AuthSession }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [history, setHistory] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

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
    const formElement = event.currentTarget;
    setSaving(true);
    setFeedback(null);
    const form = new FormData(formElement);
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
      formElement.reset();
      setFeedback({ tone: "success", text: "Entretien enregistre avec succes. Le prochain rappel a ete calcule." });
      try {
        await load();
      } catch {
        setFeedback({
          tone: "info",
          text: "Entretien enregistre avec succes. Actualisez la liste si elle ne se met pas a jour."
        });
      }
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Impossible d'ajouter l'entretien."
      });
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
            {loading ? <p className="muted">Chargement de l&apos;historique...</p> : null}
            {!loading && history.length === 0 ? <p className="muted">Aucun entretien enregistre.</p> : null}
            {history.map((item) => {
              const vehicle = vehicles.find((row) => row.id === item.vehicleId);
              return (
                <div className="row" key={item.id}>
                  <div>
                    <strong>{item.customCategory || item.category}</strong>
                    <div className="muted">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicule"} - {item.performedAt.slice(0, 10)} -{" "}
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
              <FieldLabel required>Vehicule</FieldLabel>
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
              <FieldLabel required>Categorie</FieldLabel>
              <select name="category" defaultValue="oil_change" required>
                {MAINTENANCE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <FieldLabel>Cout</FieldLabel>
              <input name="cost" type="number" min="0" placeholder="120" />
            </div>
            <div className="field">
              <FieldLabel required>Date</FieldLabel>
              <input name="performedAt" type="date" required />
            </div>
            <div className="field">
              <FieldLabel required>Kilometrage</FieldLabel>
              <input name="mileage" type="number" min="0" placeholder="52000" required />
            </div>
            <div className="field">
              <FieldLabel>Garage</FieldLabel>
              <input name="garageName" placeholder="Garage Central" />
            </div>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <FieldLabel>Notes</FieldLabel>
            <textarea name="notes" rows={4} />
          </div>
          {feedback ? <FormAlert tone={feedback.tone}>{feedback.text}</FormAlert> : null}
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
