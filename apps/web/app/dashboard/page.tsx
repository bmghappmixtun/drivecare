"use client";

import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { expenses, reminders, vehicles } from "../../lib/mock-data";
import { Bell, Plus, Sparkles } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Vue globale" title="Votre garage, clair et anticipe">
        <button className="btn">
          <Bell size={17} /> Alertes
        </button>
        <button className="btn primary">
          <Plus size={17} /> Ajouter
        </button>
      </PageHeader>

      <section className="grid stats">
        <div className="card stat">
          <span className="muted">Vehicules</span>
          <strong>{vehicles.length}</strong>
        </div>
        <div className="card stat">
          <span className="muted">Entretiens proches</span>
          <strong>2</strong>
        </div>
        <div className="card stat">
          <span className="muted">Depenses 2026</span>
          <strong>1 248 EUR</strong>
        </div>
        <div className="card stat">
          <span className="muted">Score sante</span>
          <strong>86%</strong>
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <div className="card">
          <h2>Depenses mensuelles</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={expenses}>
                <XAxis dataKey="month" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip />
                <Bar dataKey="cost" fill="var(--blue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h2>Rappels intelligents</h2>
          <div className="list">
            {reminders.map((item) => (
              <div className="row" key={item.title}>
                <div>
                  <strong>{item.title}</strong>
                  <div className="muted">{item.vehicle}</div>
                </div>
                <span className={`status ${item.urgency}`}>{item.due}</span>
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
