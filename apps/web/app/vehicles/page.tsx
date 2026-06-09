"use client";

import { VEHICLE_BRANDS, getVehicleModels } from "@drivecare/shared";
import { Camera, Plus, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";
import { AppShell } from "../../components/app-shell";
import { FieldLabel, FormAlert } from "../../components/form";
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

type Feedback = { tone: "success" | "error" | "info"; text: string };

export default function VehiclesPage() {
  return <AuthGuard>{(session) => <VehiclesContent session={session} />}</AuthGuard>;
}

function VehiclesContent({ session }: { session: AuthSession }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const modelSuggestions = useMemo(() => getVehicleModels(brand), [brand]);

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
    const formElement = event.currentTarget;
    setFeedback(null);
    setSaving(true);
    const form = new FormData(formElement);
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
      formElement.reset();
      setBrand("");
      setModel("");
      setFeedback({ tone: "success", text: "Vehicule enregistre avec succes." });
      try {
        await loadVehicles();
      } catch {
        setFeedback({
          tone: "info",
          text: "Vehicule enregistre avec succes. Actualisez la liste si elle ne se met pas a jour."
        });
      }
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Impossible d'ajouter le vehicule."
      });
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
                      {vehicle.year} - {vehicle.licensePlate || "Sans immatriculation"} -{" "}
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
              <FieldLabel required>Marque</FieldLabel>
              <input
                autoComplete="organization"
                list="vehicle-brand-options"
                name="brand"
                onChange={(event) => {
                  setBrand(event.target.value);
                  setModel("");
                }}
                placeholder="Peugeot"
                required
                value={brand}
              />
              <datalist id="vehicle-brand-options">
                {VEHICLE_BRANDS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div className="field">
              <FieldLabel required>Modele</FieldLabel>
              <input
                autoComplete="off"
                list={modelSuggestions.length ? "vehicle-model-options" : undefined}
                name="model"
                onChange={(event) => setModel(event.target.value)}
                placeholder={modelSuggestions[0] ?? "3008"}
                required
                value={model}
              />
              <datalist id="vehicle-model-options">
                {modelSuggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <span className="field-hint">
                {modelSuggestions.length
                  ? `${modelSuggestions.length} modeles suggeres pour ${brand}.`
                  : "Choisissez une marque pour afficher les modeles connus."}
              </span>
            </div>
            <div className="field">
              <FieldLabel required>Annee</FieldLabel>
              <input name="year" type="number" min="1950" placeholder="2022" required />
            </div>
            <div className="field">
              <FieldLabel required>Kilometrage</FieldLabel>
              <input name="currentMileage" type="number" min="0" placeholder="42500" required />
            </div>
            <div className="field">
              <FieldLabel>Immatriculation</FieldLabel>
              <input name="licensePlate" placeholder="123 TU 456" />
            </div>
            <div className="field">
              <FieldLabel required>Carburant</FieldLabel>
              <select name="fuelType" defaultValue="gasoline" required>
                <option value="gasoline">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybride</option>
                <option value="electric">Electrique</option>
                <option value="lpg">GPL</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="field">
              <FieldLabel required>Transmission</FieldLabel>
              <select name="transmission" defaultValue="manual" required>
                <option value="manual">Manuelle</option>
                <option value="automatic">Automatique</option>
                <option value="cvt">CVT</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          {feedback ? <FormAlert tone={feedback.tone}>{feedback.text}</FormAlert> : null}
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
