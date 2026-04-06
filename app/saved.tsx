import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TabType = "Going" | "Saved";

const goingEvents = [
  {
    id: "1",
    title: "Neon Nights DJ Pulse",
    time: "Tonight • 10:00 PM",
    location: "The Echo Lounge",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Sunset Rooftop Session",
    time: "Sat • 8:30 PM",
    location: "Skyline Rooftop",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
];

const savedEvents = [
  {
    id: "3",
    title: "Taco & Beer Fest",
    time: "Sat • 6:00 PM",
    location: "Downtown Lot",
    image:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    title: "Saturday Night Laughs",
    time: "Sat • 8:00 PM",
    location: "Comedy Den",
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "5",
    title: "Local Artist Pop-Up",
    time: "Sun • 12:00 PM",
    location: "Art Square",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("Going");

  const currentList = activeTab === "Going" ? goingEvents : savedEvents;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Plans</Text>
          <Text style={styles.subtitle}>Keep track of what you’re going to and saving</Text>
        </View>

        <View style={styles.tabWrap}>
          <Pressable
            style={[styles.tabButton, activeTab === "Going" && styles.tabButtonActive]}
            onPress={() => setActiveTab("Going")}
          >
            <Text style={[styles.tabText, activeTab === "Going" && styles.tabTextActive]}>
              Going
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabButton, activeTab === "Saved" && styles.tabButtonActive]}
            onPress={() => setActiveTab("Saved")}
          >
            <Text style={[styles.tabText, activeTab === "Saved" && styles.tabTextActive]}>
              Saved
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === "Going" ? "🔥 Going Soon" : "⭐ Saved for Later"}
          </Text>
          <Text style={styles.sectionCount}>{currentList.length} events</Text>
        </View>

        {currentList.map((event) => (
          <Pressable key={event.id} style={styles.eventCard}>
            <ImageBackground
              source={{ uri: event.image }}
              style={styles.eventImage}
              imageStyle={styles.eventImageStyle}
            >
              <View style={styles.imageOverlay} />
            </ImageBackground>

            <View style={styles.eventBody}>
              <View style={styles.eventTextWrap}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>{event.time}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>

              <View style={styles.statusWrap}>
                <View
                  style={[
                    styles.statusBadge,
                    activeTab === "Going" ? styles.goingBadge : styles.savedBadge,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {activeTab === "Going" ? "Going" : "Saved"}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: "#98A2C7",
    fontSize: 16,
    lineHeight: 22,
  },
  tabWrap: {
    flexDirection: "row",
    backgroundColor: "#0E1327",
    borderRadius: 18,
    padding: 6,
    borderWidth: 1,
    borderColor: "#1A2340",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#5A6BFF",
  },
  tabText: {
    color: "#95A0C6",
    fontSize: 15,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionCount: {
    color: "#8F99BE",
    fontSize: 14,
    fontWeight: "700",
  },
  eventCard: {
    backgroundColor: "#0B1124",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#18213F",
  },
  eventImage: {
    height: 155,
  },
  eventImageStyle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 22, 0.18)",
  },
  eventBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  eventTextWrap: {
    flex: 1,
  },
  eventTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  eventMeta: {
    color: "#D8DDF2",
    fontSize: 15,
    marginBottom: 4,
  },
  eventLocation: {
    color: "#95A0C6",
    fontSize: 14,
  },
  statusWrap: {
    justifyContent: "center",
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  goingBadge: {
    backgroundColor: "#243A94",
    borderWidth: 1,
    borderColor: "#4D6BFF",
  },
  savedBadge: {
    backgroundColor: "#1B2240",
    borderWidth: 1,
    borderColor: "#32407A",
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
