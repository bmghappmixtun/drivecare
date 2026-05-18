import { Text } from "react-native";
import { Button, Card, Muted, Screen, Title } from "../theme/components";

export function SettingsScreen() {
  return (
    <Screen>
      <Title>Profil</Title>
      <Card>
        <Text style={{ fontWeight: "900" }}>Nadia</Text>
        <Muted>Francais · notifications completes · theme systeme</Muted>
      </Card>
      <Card>
        <Text style={{ fontWeight: "900" }}>Securite</Text>
        <Muted>JWT, refresh token, verification email et OAuth prepares cote API.</Muted>
      </Card>
      <Button>Modifier les preferences</Button>
    </Screen>
  );
}
