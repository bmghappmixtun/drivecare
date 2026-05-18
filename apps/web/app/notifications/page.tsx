import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { reminders } from "../../lib/mock-data";

export default function NotificationsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Centre de notifications" title="Alertes push, email et in-app" />
      <section className="card">
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
      </section>
    </AppShell>
  );
}
