import { AppShell } from "../../components/app-shell";
import { PageHeader } from "../../components/page-header";
import { vehicles } from "../../lib/mock-data";
import { Camera, Plus } from "lucide-react";

export default function VehiclesPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Garage" title="Vehicules">
        <button className="btn primary">
          <Plus size={17} /> Nouveau vehicule
        </button>
      </PageHeader>
      <section className="grid two">
        <div className="card">
          <div className="list">
            {vehicles.map((vehicle) => (
              <article className="row" key={vehicle.id}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="vehicle-photo" />
                  <div>
                    <strong>
                      {vehicle.brand} {vehicle.model}
                    </strong>
                    <div className="muted">
                      {vehicle.year} · {vehicle.plate} · {vehicle.mileage.toLocaleString("fr-FR")} km
                    </div>
                  </div>
                </div>
                <span className={`status ${vehicle.status}`}>{vehicle.status === "soon" ? "A surveiller" : "OK"}</span>
              </article>
            ))}
          </div>
        </div>
        <form className="card">
          <h2>Ajouter rapidement</h2>
          <div className="form-grid">
            <div className="field">
              <label>Marque</label>
              <input placeholder="Peugeot" />
            </div>
            <div className="field">
              <label>Modele</label>
              <input placeholder="3008" />
            </div>
            <div className="field">
              <label>Annee</label>
              <input placeholder="2022" />
            </div>
            <div className="field">
              <label>Kilometrage</label>
              <input placeholder="42500" />
            </div>
          </div>
          <button className="btn" style={{ marginTop: 12 }} type="button">
            <Camera size={17} /> Ajouter photo
          </button>
        </form>
      </section>
    </AppShell>
  );
}
