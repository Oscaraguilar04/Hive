import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { signInWithEmail, signUpWithEmail } from "../lib/auth";

export default function LoginScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter an email and password.");
      return;
    }

    setSubmitting(true);

    const result = isSignup
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    setSubmitting(false);

    if (result.error) {
      Alert.alert("Auth error", result.error.message);
      return;
    }

    Alert.alert("Success", isSignup ? "Account created." : "Logged in.");
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Hive</Text>
        <Text style={styles.subtitle}>
          {isSignup ? "Create your account" : "Log in to your account"}
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#7F89B0"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#7F89B0"
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={[styles.primaryButton, submitting && styles.disabled]}
          onPress={handleAuth}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Log In"}
          </Text>
        </Pressable>

        <Pressable onPress={() => setIsSignup((prev) => !prev)}>
          <Text style={styles.switchText}>
            {isSignup
              ? "Already have an account? Log in"
              : "Need an account? Sign up"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050816",
  },
  container: {
    flex: 1,
    backgroundColor: "#050816",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#98A2C7",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
  },
  input: {
    backgroundColor: "#10162A",
    borderWidth: 1,
    borderColor: "#1A2340",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#5A6BFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
  },
  disabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  switchText: {
    color: "#A7B0D2",
    fontSize: 14,
    textAlign: "center",
    marginTop: 18,
    fontWeight: "600",
  },
});