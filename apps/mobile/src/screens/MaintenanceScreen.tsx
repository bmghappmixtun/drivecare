import { Text } from "react-native";
import { Button, Card, Muted, Screen, Title } from "../theme/components";

export function MaintenanceScreen() {
  return (
    <Screen>
      <Title>Entretien</Title>
      {["Plaquettes avant · 180 EUR", "Filtres + huile · 95 EUR", "Pneus ete · 430 EUR"].map((item) => (
        <Card key={item}>
          <Text style={{ fontWeight: "800" }}>{item}</Text>
          <Muted>Facture et notes disponibles</Muted>
        </Card>
      ))}
      <Button>Ajouter une intervention</Button>
    </Screen>
  );
}
