"use client";

import { Bell, Car, Plus, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AuthGuard } from "../../components/auth/auth-guard";
import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { apiGet, type AuthSession } from "../../lib/api";

type Vehicle = { id: string; brand: string; model: string; currentMileage: number };
type Reminder = {
  id: string;
  title: string;
  dueDate?: string | null;
  dueMileage?: number | null;
  urgency: "ok" | "soon" | "overdue";
  vehicle: { brand: string; model: string; currentMileage: number };
};
type Stats = { records: number; upcoming: number; annualCost: number; monthlyCost: Record<string, number> };

export default function DashboardPage() {
  return <AuthGuard>{(session) => <DashboardContent session={session} />}</AuthGuard>;
}

function DashboardContent({ session }: { session: AuthSession }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<Stats>({ records: 0, upcoming: 0, annualCost: 0, monthlyCost: {} });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [vehicleRows, reminderRows, statRows] = await Promise.all([
        apiGet<Vehicle[]>("/vehicles", session.accessToken),
        apiGet<Reminder[]>("/reminders", session.accessToken),
        apiGet<Stats>("/maintenance/stats", session.accessToken)
      ]);
      setVehicles(vehicleRows);
      setReminders(reminderRows);
      setStats(statRows);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const chartData = Object.entries(stats.monthlyCost).map(([month, cost]) => ({ month, cost }));
  const healthScore = reminders.some((item) => item.urgency === "overdue")
    ? 62
    : reminders.some((item) => item.urgency === "soon")
      ? 82
      : 95;

  return (
    <AppShell>
      <PageHeader eyebrow="Vue globale" title="Votre garage, clair et anticipe">
        <button className="btn" onClick={load} type="button">
          <RefreshCw size={17} /> Actualiser
        </button>
        <Link className="btn primary" href="/vehicles">
          <Plus size={17} /> Ajouter
        </Link>
      </PageHeader>

      <section className="grid stats">
        <div className="card stat">
          <span className="muted">Vehicules</span>
          <strong>{vehicles.length}</strong>
        </div>
        <div className="card stat">
          <span className="muted">Entretiens proches</span>
          <strong>{stats.upcoming}</strong>
        </div>
        <div className="card stat">
          <span className="muted">Depenses 2026</span>
          <strong>{Math.round(stats.annualCost)} EUR</strong>
        </div>
        <div className="card stat">
          <span className="muted">Score sante</span>
          <strong>{healthScore}%</strong>
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="card">
          <h2>Depenses mensuelles</h2>
          {chartData.length ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip />
                  <Bar dataKey="cost" fill="var(--blue)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="muted">Les depenses apparaitront apres votre premier entretien.</p>
          )}
        </div>
        <div className="card">
          <h2>Rappels intelligents</h2>
          <div className="list">
            {loading ? <p className="muted">Chargement des rappels...</p> : null}
            {!loading && reminders.length === 0 ? <p className="muted">Aucun rappel planifie.</p> : null}
            {reminders.slice(0, 5).map((item) => (
              <div className="row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <div className="muted">
                    {item.vehicle.brand} {item.vehicle.model}
                  </div>
                </div>
                <span className={`status ${item.urgency}`}>
                  {item.dueMileage ? `${item.dueMileage.toLocaleString("fr-FR")} km` : item.dueDate?.slice(0, 10)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="row">
          <div>
            <h2>Assistant IA</h2>
            <p className="muted">Analyse symptomes, couts precedents, age vehicule et historique.</p>
          </div>
          <button className="btn primary">
            <Sparkles size={17} /> Diagnostic
          </button>
        </div>
      </section>
    </AppShell>
  );
}
