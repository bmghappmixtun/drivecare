"use client";

import { DEFAULT_MAINTENANCE_RULES, MAINTENANCE_CATEGORIES } from "@drivecare/shared";
import { ArrowLeft, Plus, RefreshCw, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "../../../components/app-shell";
import { AuthGuard } from "../../../components/auth/auth-guard";
import { FieldLabel, FormAlert } from "../../../components/form";
import { PageHeader } from "../../../components/page-header";
import { apiGet, apiPost, type AuthSession } from "../../../lib/api";

type MaintenanceRecord = {
  id: string;
  category: string;
  customCategory?: string | null;
  performedAt: string;
  mileage: number;
  cost: string | number;
  garageName?: string | null;
  notes?: string | null;
};

type Reminder = {
  id: string;
  title: string;
  dueDate?: string | null;
  dueMileage?: number | null;
  status: string;
};

type VehicleDetails = {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate?: string | null;
  currentMileage: number;
  fuelType: string;
  transmission: string;
  records: MaintenanceRecord[];
  reminders: Reminder[];
};

type Feedback = { tone: "success" | "error" | "info"; text: string };

const categoryLabels = new Map(DEFAULT_MAINTENANCE_RULES.map((rule) => [rule.category, rule.label.fr]));

export default function VehicleDetailsPage() {
  return <AuthGuard>{(session) => <VehicleDetailsContent session={session} />}</AuthGuard>;
}

function VehicleDetailsContent({ session }: { session: AuthSession }) {
  const params = useParams<{ id: string }>();
  const vehicleId = params.id;
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("oil_change");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function loadVehicle() {
    setLoading(true);
    try {
      setVehicle(await apiGet<VehicleDetails>(`/vehicles/${vehicleId}`, session.accessToken));
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Impossible de charger le vehicule."
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVehicle();
  }, [vehicleId, session.accessToken]);

  const stats = useMemo(() => {
    const records = vehicle?.records ?? [];
    const totalCost = records.reduce((sum, item) => sum + Number(item.cost ?? 0), 0);
    const lastRecord = records[0] ?? null;
    return {
      count: records.length,
      totalCost,
      lastDate: lastRecord?.performedAt ? lastRecord.performedAt.slice(0, 10) : "Aucun"
    };
  }, [vehicle]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const selectedCategory = String(form.get("category"));
    setSaving(true);
    setFeedback(null);

    try {
      await apiPost(
        "/maintenance",
        {
          vehicleId,
          category: selectedCategory,
          ...(selectedCategory === "custom" ? { customCategory: String(form.get("customCategory") || "").trim() } : {}),
          performedAt: `${String(form.get("performedAt"))}T00:00:00.000Z`,
          mileage: Number(form.get("mileage")),
          cost: Number(form.get("cost") || 0),
          garageName: String(form.get("garageName") || ""),
          notes: String(form.get("notes") || ""),
          partsReplaced: []
        },
        session.accessToken
      );
      formElement.reset();
      setCategory("oil_change");
      setFeedback({ tone: "success", text: "Entretien ajoute et rattache a ce vehicule avec succes." });
      await loadVehicle();
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
      <PageHeader eyebrow="Carnet vehicule" title={vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicule"}>
        <Link className="btn" href="/vehicles">
          <ArrowLeft size={17} /> Retour
        </Link>
        <button className="btn" onClick={loadVehicle} type="button">
          <RefreshCw size={17} /> Actualiser
        </button>
      </PageHeader>

      {loading && !vehicle ? (
        <section className="card">
          <p className="muted">Chargement du carnet...</p>
        </section>
      ) : null}

      {vehicle ? (
        <>
          <section className="vehicle-detail-hero">
            <div className="vehicle-photo large" />
            <div>
              <h2>
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="muted">
                {vehicle.year} - {vehicle.currentMileage.toLocaleString("fr-FR")} km -{" "}
                {vehicle.licensePlate || "Sans immatriculation"}
              </p>
            </div>
          </section>

          <section className="grid stats" style={{ marginTop: 16 }}>
            <div className="card stat">
              <span className="muted">Entretiens</span>
              <strong>{stats.count}</strong>
            </div>
            <div className="card stat">
              <span className="muted">Cout total</span>
              <strong>{Math.round(stats.totalCost)} EUR</strong>
            </div>
            <div className="card stat">
              <span className="muted">Dernier entretien</span>
              <strong>{stats.lastDate}</strong>
            </div>
            <div className="card stat">
              <span className="muted">Rappels</span>
              <strong>{vehicle.reminders.length}</strong>
            </div>
          </section>

          <section className="grid two" style={{ marginTop: 16 }}>
            <div className="card">
              <h2>Historique des entretiens</h2>
              <div className="list">
                {vehicle.records.length === 0 ? (
                  <p className="muted">Aucun entretien rattache a ce vehicule pour le moment.</p>
                ) : null}
                {vehicle.records.map((record) => (
                  <article className="row" key={record.id}>
                    <div>
                      <strong>{record.customCategory || getCategoryLabel(record.category)}</strong>
                      <div className="muted">
                        {record.performedAt.slice(0, 10)} - {record.mileage.toLocaleString("fr-FR")} km
                        {record.garageName ? ` - ${record.garageName}` : ""}
                      </div>
                      {record.notes ? <div className="muted">{record.notes}</div> : null}
                    </div>
                    <strong>{Number(record.cost || 0).toFixed(0)} EUR</strong>
                  </article>
                ))}
              </div>
            </div>

            <form className="card" onSubmit={submit}>
              <h2>Ajouter un entretien</h2>
              <div className="form-grid">
                <div className="field">
                  <FieldLabel required>Type</FieldLabel>
                  <select name="category" onChange={(event) => setCategory(event.target.value)} required value={category}>
                    {MAINTENANCE_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {getCategoryLabel(item)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <FieldLabel required>Date</FieldLabel>
                  <input name="performedAt" type="date" required />
                </div>
                {category === "custom" ? (
                  <div className="field">
                    <FieldLabel required>Type personnalise</FieldLabel>
                    <input name="customCategory" placeholder="Ex: Changement turbo" required />
                  </div>
                ) : null}
                <div className="field">
                  <FieldLabel required>Kilometrage</FieldLabel>
                  <input name="mileage" type="number" min="0" placeholder="85000" required />
                </div>
                <div className="field">
                  <FieldLabel>Cout</FieldLabel>
                  <input name="cost" type="number" min="0" step="0.01" placeholder="120" />
                </div>
                <div className="field">
                  <FieldLabel>Garage</FieldLabel>
                  <input name="garageName" placeholder="Garage Central" />
                </div>
              </div>
              <div className="field" style={{ marginTop: 12 }}>
                <FieldLabel>Notes</FieldLabel>
                <textarea name="notes" placeholder="Details optionnels..." rows={3} />
              </div>
              {feedback ? <FormAlert tone={feedback.tone}>{feedback.text}</FormAlert> : null}
              <div className="actions" style={{ marginTop: 12 }}>
                <button className="btn primary" disabled={saving} type="submit">
                  <Plus size={17} /> {saving ? "Ajout..." : "Ajouter l'entretien"}
                </button>
              </div>
            </form>
          </section>

          <section className="card" style={{ marginTop: 16 }}>
            <h2>Alertes et rappels</h2>
            <div className="list">
              {vehicle.reminders.length === 0 ? <p className="muted">Aucun rappel planifie.</p> : null}
              {vehicle.reminders.map((reminder) => (
                <div className="row" key={reminder.id}>
                  <div>
                    <strong>{reminder.title}</strong>
                    <div className="muted">
                      {reminder.dueDate ? reminder.dueDate.slice(0, 10) : "Date non definie"}
                      {reminder.dueMileage ? ` - ${reminder.dueMileage.toLocaleString("fr-FR")} km` : ""}
                    </div>
                  </div>
                  <span className="status soon">{reminder.status}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}

function getCategoryLabel(category: string) {
  if (category === "custom") return "Autre";
  return categoryLabels.get(category as (typeof MAINTENANCE_CATEGORIES)[number]) ?? category;
}
