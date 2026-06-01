"use client";

import { AlertTriangle, CheckCircle2, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { AuthGuard } from "../../components/auth/auth-guard";
import { FieldLabel, FormAlert } from "../../components/form";
import { PageHeader } from "../../components/page-header";
import { apiGet, apiPost, type AuthSession } from "../../lib/api";

type Vehicle = { id: string; brand: string; model: string; currentMileage: number };
type AssistantResponse = {
  id: string;
  response: {
    vehicleContext: string | null;
    riskLevel: "low" | "medium" | "high";
    suggestions: string[];
    disclaimer: string;
  };
};
type Feedback = { tone: "success" | "error" | "info"; text: string };

const examples = [
  "J'entends un bruit metallique au freinage.",
  "La voiture a du mal a demarrer le matin.",
  "Le voyant huile s'allume apres quelques minutes."
];

export default function AssistantPage() {
  return <AuthGuard>{(session) => <AssistantContent session={session} />}</AuthGuard>;
}

function AssistantContent({ session }: { session: AuthSession }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [prompt, setPrompt] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [result, setResult] = useState<AssistantResponse | null>(null);

  useEffect(() => {
    apiGet<Vehicle[]>("/vehicles", session.accessToken)
      .then(setVehicles)
      .catch(() => setFeedback({ tone: "error", text: "Impossible de charger les vehicules." }))
      .finally(() => setLoading(false));
  }, [session.accessToken]);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === vehicleId) ?? null,
    [vehicleId, vehicles]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    setResult(null);

    try {
      const payload = await apiPost<AssistantResponse>(
        "/ai/assistant",
        {
          vehicleId: vehicleId || undefined,
          prompt: prompt.trim()
        },
        session.accessToken
      );
      setResult(payload);
      setFeedback({ tone: "success", text: "Diagnostic enregistre avec succes." });
    } catch (error) {
      setFeedback({
        tone: "error",
        text: error instanceof Error ? error.message : "Impossible de generer le diagnostic."
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Assistant IA" title="Diagnostic rapide et recommandations">
        <Sparkles size={22} />
      </PageHeader>

      <section className="grid two">
        <form className="card" onSubmit={submit}>
          <h2>Decrire le symptome</h2>
          <div className="form-grid">
            <div className="field">
              <FieldLabel>Vehicule</FieldLabel>
              <select disabled={loading} name="vehicleId" onChange={(event) => setVehicleId(event.target.value)} value={vehicleId}>
                <option value="">Diagnostic general</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - {vehicle.currentMileage.toLocaleString("fr-FR")} km
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <FieldLabel>Contexte</FieldLabel>
              <input
                readOnly
                value={selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : "Aucun vehicule selectionne"}
              />
            </div>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <FieldLabel required>Symptome</FieldLabel>
            <textarea
              minLength={5}
              name="prompt"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Exemple: bruit metallique au freinage, vibration, voyant moteur..."
              required
              rows={7}
              value={prompt}
            />
          </div>
          {feedback ? <FormAlert tone={feedback.tone}>{feedback.text}</FormAlert> : null}
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn primary" disabled={sending || prompt.trim().length < 5} type="submit">
              <Send size={17} /> {sending ? "Analyse..." : "Analyser"}
            </button>
          </div>
        </form>

        <aside className="card">
          <h2>Exemples</h2>
          <div className="list">
            {examples.map((example) => (
              <button className="prompt-chip" key={example} onClick={() => setPrompt(example)} type="button">
                {example}
              </button>
            ))}
          </div>
        </aside>
      </section>

      {result ? (
        <section className="card diagnostic-result">
          <div className="row">
            <div>
              <h2>Resultat du diagnostic</h2>
              <p className="muted">{result.response.vehicleContext ?? "Diagnostic general"}</p>
            </div>
            <span className={`status ${result.response.riskLevel === "medium" ? "soon" : "ok"}`}>
              Risque {result.response.riskLevel}
            </span>
          </div>
          <div className="recommendations">
            {result.response.suggestions.map((suggestion) => (
              <div className="recommendation" key={suggestion}>
                <CheckCircle2 size={18} />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
          <p className="diagnostic-warning">
            <AlertTriangle size={17} /> {result.response.disclaimer}
          </p>
        </section>
      ) : null}
    </AppShell>
  );
}
