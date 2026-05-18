import type { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { colors } from "./colors";

export function Screen({ children }: { children: ReactNode }) {
  const dark = useColorScheme() === "dark";
  return <View style={[styles.screen, { backgroundColor: dark ? colors.ink : colors.bg }]}>{children}</View>;
}

export function Card({ children }: { children: ReactNode }) {
  const dark = useColorScheme() === "dark";
  return <View style={[styles.card, { backgroundColor: dark ? "#10141D" : colors.surface }]}>{children}</View>;
}

export function Title({ children }: { children: ReactNode }) {
  const dark = useColorScheme() === "dark";
  return <Text style={[styles.title, { color: dark ? colors.surface : colors.ink }]}>{children}</Text>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <Text style={styles.muted}>{children}</Text>;
}

export function Button({ children }: { children: ReactNode }) {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.85}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 14 },
  card: { borderRadius: 8, padding: 16, borderWidth: 1, borderColor: colors.line },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 14 },
  button: {
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  buttonText: { color: "#FFFFFF", fontWeight: "800" }
});
