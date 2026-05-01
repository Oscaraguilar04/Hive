import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUpThenSignIn, waitForSession } from "../lib/auth";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter an email and password.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signUpThenSignIn(email.trim(), password);

      if (result.error) {
        Alert.alert("Auth error", result.error.message);
        return;
      }

      const session = await waitForSession();

      if (!session) {
        Alert.alert("Session error", "Account was created, but the session was not ready yet.");
        return;
      }

      router.replace("/home" as any);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong during signup.";
      Alert.alert("Auth error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/grey-gradient.jpg")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeContent}>
          <View style={styles.content}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>

            <View style={styles.logoWrap}>
              <View style={styles.hexRow}>
                <View style={styles.hex} />
                <View style={styles.hex} />
              </View>
              <View style={styles.hexRow}>
                <View style={styles.hex} />
              </View>
            </View>

            <Text style={styles.title}>Sign Up to Hive</Text>
            <Text style={styles.subtitle}>
              Create your account and start discovering events
            </Text>

            <Pressable style={styles.socialButton}>
              <Image
                source={require("../assets/images/google.png")}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </Pressable>

            <Pressable style={styles.socialButton}>
              <Image
                source={require("../assets/images/facebook.png")}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </Pressable>

            <Pressable style={styles.socialButton}>
              <Image
                source={require("../assets/images/apple.png")}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </Pressable>

            <View style={styles.divider} />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#B7B7BC"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#B7B7BC"
              secureTextEntry
              style={styles.input}
            />

            <Pressable
              style={[styles.primaryButton, submitting && styles.disabled]}
              onPress={handleSignup}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Please wait..." : "Create Account"}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/login" as any)}>
              <Text style={styles.footerText}>Already have an account? Log in</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0B",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  safeContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 22,
    zIndex: 10,
    padding: 6,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "500",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  hexRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 6,
  },
  hex: {
    width: 22,
    height: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  subtitle: {
    color: "#D8D8DC",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  socialButton: {
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 12,
    position: "relative",
  },
  socialIcon: {
    width: 18,
    height: 18,
    position: "absolute",
    left: 16,
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.20)",
    marginVertical: 18,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.78)",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 14,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  primaryButton: {
    backgroundColor: "#F4F4F5",
    height: 56,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  disabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  footerText: {
    color: "#E0E0E4",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});