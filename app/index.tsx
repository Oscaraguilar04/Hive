import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/index.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeContent}>
          <View style={styles.content}>
            <View style={styles.topSpacer} />

            <View style={styles.bottomContent}>
              <Text style={styles.headline}>Easily find & manage your own events</Text>

              <Text style={styles.subtext}>
                Discover what is happening around you, plan your nights, and bring your own
                community together with Hive.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push("/signup" as any)}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </Pressable>

              <Pressable onPress={() => router.push("/login" as any)}>
                <Text style={styles.secondaryText}>Already have an account? Log in</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  background: {
    flex: 1,
    marginTop: -6,
  },
  backgroundImage: {
    width: "100%",
    height: "101%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.73)",
  },
  safeContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    justifyContent: "space-between",
  },
  topSpacer: {
    flex: 1,
  },
  bottomContent: {
    alignItems: "center",
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  subtext: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 28,
    maxWidth: 310,
  },
  primaryButton: {
    backgroundColor: "#f6f2f2",
    width: "100%",
    borderRadius: 2,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryButtonText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});