"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "../../components/auth/auth-guard";
import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { apiGet, type AuthSession } from "../../lib/api";

type Reminder = {
  id: string;
  title: string;
  dueDate?: string | null;
  dueMileage?: number | null;
  urgency: "ok" | "soon" | "overdue";
  vehicle: { brand: string; model: string };
};

type Notification = {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
};

export default function NotificationsPage() {
  return <AuthGuard>{(session) => <NotificationsContent session={session} />}</AuthGuard>;
}

function NotificationsContent({ session }: { session: AuthSession }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    void Promise.all([
      apiGet<Reminder[]>("/reminders", session.accessToken).then(setReminders),
      apiGet<Notification[]>("/notifications", session.accessToken).then(setNotifications)
    ]);
  }, [session.accessToken]);

  return (
    <AppShell>
      <PageHeader eyebrow="Centre de notifications" title="Alertes push, email et in-app" />
      <section className="grid two">
        <div className="card">
          <h2>Rappels</h2>
          <div className="list">
            {reminders.length === 0 ? <p className="muted">Aucun rappel planifie.</p> : null}
            {reminders.map((item) => (
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
        <div className="card">
          <h2>Messages</h2>
          <div className="list">
            {notifications.length === 0 ? <p className="muted">Aucune notification pour le moment.</p> : null}
            {notifications.map((item) => (
              <div className="row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <div className="muted">{item.body}</div>
                </div>
                <span className={`status ${item.status === "unread" ? "soon" : "ok"}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
