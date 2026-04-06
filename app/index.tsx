import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

type Category =
  | "All"
  | "Music"
  | "Food"
  | "Comedy"
  | "Nightlife"
  | "Outdoors"
  | "Sports";

type EventItem = {
  id: string;
  title: string;
  date_label: string;
  location: string;
  interested: number;
  category: Exclude<Category, "All">;
  image: string;
  featured?: boolean;
  created_at?: string;
};

const CATEGORIES: Category[] = [
  "All",
  "Music",
  "Food",
  "Comedy",
  "Nightlife",
  "Outdoors",
  "Sports",
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error loading events", error.message);
      setLoading(false);
      return;
    }

    setEvents((data as EventItem[]) || []);
    setLoading(false);
  };

  const featuredEvent = events.find((event) => event.featured) ?? events[0];

  const filteredEvents = useMemo(() => {
    const nonFeatured = events.filter((event) => !event.featured);
    if (selectedCategory === "All") return nonFeatured;
    return nonFeatured.filter((event) => event.category === selectedCategory);
  }, [selectedCategory, events]);

  const handleNavPress = (tab: string) => {
    if (tab === "Home") router.push("/");
    if (tab === "Discover") router.push("/discover");
    if (tab === "Create") router.push("/create");
    if (tab === "Saved") router.push("/saved");
    if (tab === "Profile") router.push("/profile");
  };

  const handleOpenEvent = (_title: string) => {
    router.push("/event-details");
  };

  const toggleSave = (id: string) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleLike = (id: string) => {
    setLikedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!featuredEvent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.loadingText}>No events found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => Alert.alert("City", "City picker comes next.")}>
            <Text style={styles.cityText}>Bakersfield ▼</Text>
          </Pressable>

          <View style={styles.topBarRight}>
            <Pressable
              style={styles.iconButton}
              onPress={() => Alert.alert("Search", "Search screen comes next.")}
            >
              <Text style={styles.iconText}>⌕</Text>
            </Pressable>

            <Pressable
              style={styles.iconButton}
              onPress={() => Alert.alert("Notifications", "Notifications later.")}
            >
              <Text style={styles.iconText}>🔔</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => handleOpenEvent(featuredEvent.title)}>
          <ImageBackground
            source={{ uri: featuredEvent.image }}
            style={styles.heroCard}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{featuredEvent.title}</Text>
              <Text style={styles.heroMeta}>
                {featuredEvent.location} • {featuredEvent.date_label}
              </Text>
              <Text style={styles.heroInterest}>🔥 {featuredEvent.interested} interested</Text>

              <View style={styles.heroActions}>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => handleOpenEvent(featuredEvent.title)}
                >
                  <Text style={styles.primaryButtonText}>View Event</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => toggleLike(featuredEvent.id)}
                >
                  <Text style={styles.secondaryButtonText}>
                    {likedIds.includes(featuredEvent.id) ? "Interested ✓" : "Interested"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.categoryPill, active && styles.categoryPillActive]}
              >
                <Text
                  style={[styles.categoryPillText, active && styles.categoryPillTextActive]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Happening Tonight</Text>
          <Pressable onPress={fetchEvents}>
            <Text style={styles.sectionLink}>Refresh</Text>
          </Pressable>
        </View>

        {filteredEvents.map((event) => {
          const isSaved = savedIds.includes(event.id);
          const isLiked = likedIds.includes(event.id);

          return (
            <Pressable
              key={event.id}
              onPress={() => handleOpenEvent(event.title)}
              style={styles.eventCard}
            >
              <ImageBackground
                source={{ uri: event.image }}
                style={styles.eventImage}
                imageStyle={styles.eventImageStyle}
              >
                <View style={styles.eventImageOverlay} />
              </ImageBackground>

              <View style={styles.eventBody}>
                <View style={styles.eventTextWrap}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>{event.date_label}</Text>
                  <Text style={styles.eventLocation}>{event.location}</Text>
                  <Text style={styles.eventInterest}>🔥 {event.interested} interested</Text>
                </View>

                <View style={styles.eventActions}>
                  <Pressable
                    style={[styles.actionButton, isLiked && styles.actionButtonActive]}
                    onPress={() => toggleLike(event.id)}
                  >
                    <Text style={styles.actionButtonText}>{isLiked ? "♥" : "♡"}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, isSaved && styles.actionButtonActive]}
                    onPress={() => toggleSave(event.id)}
                  >
                    <Text style={styles.actionButtonText}>{isSaved ? "🔖" : "📑"}</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => handleNavPress("Home")}>
          <Text style={[styles.navIcon, styles.navActive]}>⌂</Text>
          <Text style={[styles.navLabel, styles.navActive]}>Home</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => handleNavPress("Discover")}>
          <Text style={styles.navIcon}>⌕</Text>
          <Text style={styles.navLabel}>Discover</Text>
        </Pressable>

        <Pressable style={styles.createButton} onPress={() => handleNavPress("Create")}>
          <Text style={styles.createButtonText}>＋</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => handleNavPress("Saved")}>
          <Text style={styles.navIcon}>🔖</Text>
          <Text style={styles.navLabel}>Saved</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => handleNavPress("Profile")}>
          <Text style={styles.navIcon}>◉</Text>
          <Text style={styles.navLabel}>Profile</Text>
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
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  cityText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  topBarRight: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10162A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A2340",
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  heroCard: {
    height: 270,
    borderRadius: 26,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: 18,
    backgroundColor: "#0A1020",
  },
  heroImage: {
    borderRadius: 26,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 8, 22, 0.38)",
  },
  heroContent: {
    padding: 18,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroMeta: {
    color: "#D7DCF0",
    fontSize: 16,
    marginBottom: 6,
  },
  heroInterest: {
    color: "#FFD0A8",
    fontSize: 15,
    marginBottom: 14,
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#5A6BFF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  categoriesRow: {
    paddingBottom: 8,
    gap: 10,
    marginBottom: 12,
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#10162A",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1A2340",
  },
  categoryPillActive: {
    backgroundColor: "#3558FF",
    borderColor: "#3558FF",
  },
  categoryPillText: {
    color: "#C9CEE0",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryPillTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    marginTop: 2,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionLink: {
    color: "#8A94C8",
    fontSize: 14,
    fontWeight: "600",
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
    height: 150,
    backgroundColor: "#111827",
  },
  eventImageStyle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  eventImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 12, 26, 0.15)",
  },
  eventBody: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    color: "#9CA7CB",
    fontSize: 14,
    marginBottom: 6,
  },
  eventInterest: {
    color: "#F3B995",
    fontSize: 14,
    fontWeight: "600",
  },
  eventActions: {
    justifyContent: "center",
    gap: 10,
  },
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#141B33",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#202B4E",
  },
  actionButtonActive: {
    backgroundColor: "#243A94",
    borderColor: "#4D6BFF",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  bottomNav: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 18,
    backgroundColor: "rgba(10, 15, 31, 0.96)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#1B2444",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 58,
  },
  navIcon: {
    color: "#8590B8",
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    color: "#8590B8",
    fontSize: 11,
    fontWeight: "600",
  },
  navActive: {
    color: "#FFFFFF",
  },
  createButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#4B5DFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
    shadowColor: "#4B5DFF",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginTop: -2,
  },
});