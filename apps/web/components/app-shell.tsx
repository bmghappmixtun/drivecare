"use client";

import { APP_CONFIG } from "@drivecare/shared";
import { BarChart3, Bell, Car, Gauge, History, Settings, Shield, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/vehicles", label: "Vehicules", icon: Car },
  { href: "/maintenance", label: "Historique", icon: Wrench },
  { href: "/notifications", label: "Alertes", icon: Bell },
  { href: "/settings", label: "Profil", icon: Settings },
  { href: "/admin", label: "Admin", icon: Shield }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">
          <span className="mark">
            <Car size={20} />
          </span>
          {APP_CONFIG.appName}
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} className={pathname === item.href ? "active" : ""} href={item.href}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="card" style={{ marginTop: 24 }}>
          <BarChart3 size={18} />
          <p className="muted">Cout annuel estime</p>
          <strong>1 248 EUR</strong>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
