import { Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button, Card, Muted, Screen, Title } from "../theme/components";
import { colors } from "../theme/colors";
import { reminders } from "./mock";

export function DashboardScreen() {
  return (
    <Screen>
      <Title>Dashboard</Title>
      <Muted>Entretien, couts et rappels au meme endroit.</Muted>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Card>
          <Muted>Vehicules</Muted>
          <Text style={{ color: colors.blue, fontSize: 28, fontWeight: "900" }}>2</Text>
        </Card>
        <Card>
          <Muted>Score sante</Muted>
          <Text style={{ color: colors.ok, fontSize: 28, fontWeight: "900" }}>86%</Text>
        </Card>
      </View>
      <Card>
        <Muted>Assistant IA</Muted>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 12 }}>
          <Sparkles color={colors.blue} />
          <Text style={{ fontWeight: "700" }}>Diagnostic symptomes et couts estimes</Text>
        </View>
        <Button>Lancer un diagnostic</Button>
      </Card>
      <Card>
        <Muted>Rappels proches</Muted>
        {reminders.map((item) => (
          <View key={item.title} style={{ paddingVertical: 10 }}>
            <Text style={{ fontWeight: "800" }}>{item.title}</Text>
            <Muted>{item.detail}</Muted>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
