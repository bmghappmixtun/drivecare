"use client";

import { Camera, Plus, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";
import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { apiGet, apiPost, type AuthSession } from "../../lib/api";

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate?: string | null;
  currentMileage: number;
  fuelType: string;
  transmission: string;
};

export default function VehiclesPage() {
  return <AuthGuard>{(session) => <VehiclesContent session={session} />}</AuthGuard>;
}

function VehiclesContent({ session }: { session: AuthSession }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadVehicles() {
    setLoading(true);
    try {
      setVehicles(await apiGet<Vehicle[]>("/vehicles", session.accessToken));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVehicles();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const licensePlate = String(form.get("licensePlate") || "").trim();

    try {
      await apiPost<Vehicle>(
        "/vehicles",
        {
          brand: String(form.get("brand")),
          model: String(form.get("model")),
          year: Number(form.get("year")),
          ...(licensePlate ? { licensePlate } : {}),
          currentMileage: Number(form.get("currentMileage")),
          fuelType: String(form.get("fuelType")),
          transmission: String(form.get("transmission"))
        },
        session.accessToken
      );
      event.currentTarget.reset();
      setMessage("Vehicule ajoute.");
      try {
        await loadVehicles();
      } catch {
        setMessage("Vehicule ajoute. Actualisez la liste si elle ne se met pas a jour.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible d'ajouter le vehicule.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Garage" title="Vehicules">
        <button className="btn" onClick={loadVehicles} type="button">
          <RefreshCw size={17} /> Actualiser
        </button>
      </PageHeader>
      <section className="grid two">
        <div className="card">
          <div className="list">
            {loading ? <p className="muted">Chargement des vehicules...</p> : null}
            {!loading && vehicles.length === 0 ? (
              <p className="muted">Aucun vehicule pour le moment. Ajoutez votre premier vehicule.</p>
            ) : null}
            {vehicles.map((vehicle) => (
              <article className="row" key={vehicle.id}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="vehicle-photo" />
                  <div>
                    <strong>
                      {vehicle.brand} {vehicle.model}
                    </strong>
                    <div className="muted">
                      {vehicle.year} · {vehicle.licensePlate || "Sans immatriculation"} ·{" "}
                      {vehicle.currentMileage.toLocaleString("fr-FR")} km
                    </div>
                  </div>
                </div>
                <span className="status ok">OK</span>
              </article>
            ))}
          </div>
        </div>
        <form className="card" onSubmit={submit}>
          <h2>Ajouter rapidement</h2>
          <div className="form-grid">
            <div className="field">
              <label>Marque</label>
              <input name="brand" placeholder="Peugeot" required />
            </div>
            <div className="field">
              <label>Modele</label>
              <input name="model" placeholder="3008" required />
            </div>
            <div className="field">
              <label>Annee</label>
              <input name="year" type="number" min="1950" placeholder="2022" required />
            </div>
            <div className="field">
              <label>Kilometrage</label>
              <input name="currentMileage" type="number" min="0" placeholder="42500" required />
            </div>
            <div className="field">
              <label>Immatriculation</label>
              <input name="licensePlate" placeholder="123 TU 456" />
            </div>
            <div className="field">
              <label>Carburant</label>
              <select name="fuelType" defaultValue="gasoline">
                <option value="gasoline">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybride</option>
                <option value="electric">Electrique</option>
                <option value="lpg">GPL</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="field">
              <label>Transmission</label>
              <select name="transmission" defaultValue="manual">
                <option value="manual">Manuelle</option>
                <option value="automatic">Automatique</option>
                <option value="cvt">CVT</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          {message ? <p className="muted">{message}</p> : null}
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn" type="button">
              <Camera size={17} /> Photo
            </button>
            <button className="btn primary" disabled={saving} type="submit">
              <Plus size={17} /> {saving ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
