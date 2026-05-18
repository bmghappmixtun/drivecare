import { Text, View } from "react-native";
import { Button, Card, Muted, Screen, Title } from "../theme/components";
import { vehicles } from "./mock";

export function VehiclesScreen() {
  return (
    <Screen>
      <Title>Vehicules</Title>
      {vehicles.map((vehicle) => (
        <Card key={`${vehicle.brand}-${vehicle.model}`}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "900" }}>
                {vehicle.brand} {vehicle.model}
              </Text>
              <Muted>{vehicle.mileage}</Muted>
            </View>
            <Muted>{vehicle.status}</Muted>
          </View>
        </Card>
      ))}
      <Button>Ajouter un vehicule</Button>
    </Screen>
  );
}
