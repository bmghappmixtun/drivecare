import { Text } from "react-native";
import { Card, Muted, Screen, Title } from "../theme/components";
import { reminders } from "./mock";

export function NotificationsScreen() {
  return (
    <Screen>
      <Title>Alertes</Title>
      {reminders.map((item) => (
        <Card key={item.title}>
          <Text style={{ fontWeight: "900" }}>{item.title}</Text>
          <Muted>{item.detail}</Muted>
        </Card>
      ))}
    </Screen>
  );
}
