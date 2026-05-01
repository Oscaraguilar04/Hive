import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import UserAvatar from "../components/UserAvatar";
import { supabase } from "../lib/supabase";

const CITY_OPTIONS = [
  "Los Angeles",
  "Bakersfield",
  "San Diego",
  "San Francisco",
  "Las Vegas",
];

const CATEGORY_OPTIONS = [
  "All",
  "Music",
  "Food",
  "Comedy",
  "Nightlife",
  "Outdoors",
  "Sports",
  "Community",
];

type EventRow = {
  id: string;
  title: string;
  date_label: string;
  location: string;
  image: string;
  featured?: boolean | null;
  interested?: number | null;
  category?: string | null;
  created_at?: string | null;
};

export default function HomeScreen() {
  const [selectedCity, setSelectedCity] = useState("Los Angeles");
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
  .from("events")
  .select(
    "id, title, date_label, location, image, featured, interested, category, created_at"
  )
  .order("featured", { ascending: false })
  .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setEvents((data as EventRow[]) || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not load events.";
      Alert.alert("Load error", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const handleUseCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location denied", "Using Los Angeles for now.");
        setSelectedCity("Los Angeles");
        setCityModalVisible(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const results = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const city =
        results?.[0]?.city ||
        results?.[0]?.subregion ||
        results?.[0]?.region ||
        "Los Angeles";

      setSelectedCity(city);
      setCityModalVisible(false);
    } catch {
      Alert.alert("Location unavailable", "Using Los Angeles for now.");
      setSelectedCity("Los Angeles");
      setCityModalVisible(false);
    } finally {
      setLocationLoading(false);
    }
  };

  const filteredByCity = useMemo(() => {
    return events.filter((event) =>
      (event.location || "").toLowerCase().includes(selectedCity.toLowerCase())
    );
  }, [events, selectedCity]);

  const cityScopedEvents = filteredByCity.length > 0 ? filteredByCity : events;

  const searchedEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return cityScopedEvents;

    return cityScopedEvents.filter((event) => {
      const title = (event.title || "").toLowerCase();
      const location = (event.location || "").toLowerCase();
      const category = (event.category || "").toLowerCase();
      return (
        title.includes(query) ||
        location.includes(query) ||
        category.includes(query)
      );
    });
  }, [cityScopedEvents, searchText]);

  const categoryFilteredEvents = useMemo(() => {
    if (selectedCategory === "All") return searchedEvents;

    return searchedEvents.filter(
      (event) =>
        (event.category || "").toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [searchedEvents, selectedCategory]);

  const featuredEvent =
    categoryFilteredEvents.find((event) => event.featured) ??
    categoryFilteredEvents[0];

  const nonFeaturedEvents = categoryFilteredEvents.filter(
    (event) => event.id !== featuredEvent?.id
  );

  const topPicks = nonFeaturedEvents.slice(0, 4);
  const trendingEvents = [...nonFeaturedEvents]
    .sort((a, b) => (b.interested || 0) - (a.interested || 0))
    .slice(0, 2);

  const openEvent = (eventId: string) => {
    router.push({
      pathname: "/event-details",
      params: { eventId },
    } as any);
  };

  const handleNotifications = () => {
    Alert.alert("Notifications", "No notifications yet.");
  };

  const handleMapNav = () => {
    router.push("/map" as any);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No events found</Text>
      <Text style={styles.emptyStateText}>
        Try another city, search term, or category.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <UserAvatar size={28} />

          <Pressable style={styles.cityButton} onPress={() => setCityModalVisible(true)}>
            <Text style={styles.cityText}>{selectedCity.toUpperCase()}</Text>
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
          </Pressable>

          <View style={styles.topIcons}>
            <Pressable style={styles.iconWrap} onPress={() => setFilterModalVisible(true)}>
              <Ionicons name="options-outline" size={22} color="#FFFFFF" />
            </Pressable>

            <Pressable style={styles.iconWrap} onPress={handleNotifications}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#6F6F6F" style={styles.searchIcon} />
          <TextInput
            placeholder="Find local events near you"
            placeholderTextColor="#7B7B7B"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : !featuredEvent ? (
          renderEmptyState()
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>RECOMMENDED</Text>

              <Pressable onPress={() => openEvent(featuredEvent.id)}>
                <ImageBackground
                  source={{ uri: featuredEvent.image }}
                  style={styles.heroCard}
                  imageStyle={styles.heroImage}
                >
                  <View style={styles.heroOverlay} />
                  <View style={styles.heroBottom}>
                    <Text style={styles.heroTitle}>{featuredEvent.title}</Text>
                    <Text style={styles.heroMeta}>
                      {featuredEvent.date_label} • {featuredEvent.location}
                    </Text>
                    <Text style={styles.heroInterest}>
                      {(featuredEvent.interested || 0).toLocaleString()} interested
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TONIGHT&apos;S TOP PICKS</Text>

              {topPicks.length === 0 ? (
                renderEmptyState()
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalRow}
                >
                  {topPicks.map((event) => (
                    <Pressable
                      key={event.id}
                      style={styles.smallEventCard}
                      onPress={() => openEvent(event.id)}
                    >
                      <Image
                        source={{ uri: event.image }}
                        style={styles.smallEventImage}
                      />
                      <View style={styles.smallEventOverlay} />
                      <View style={styles.smallEventContent}>
                        <Text style={styles.smallEventTitle} numberOfLines={1}>
                          {event.title.toUpperCase()}
                        </Text>
                        <Text style={styles.smallEventMeta} numberOfLines={1}>
                          {event.location}
                        </Text>
                        <Text style={styles.smallEventTime} numberOfLines={1}>
                          {event.date_label}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TRENDING AROUND YOU</Text>

              {trendingEvents.length === 0 ? (
                renderEmptyState()
              ) : (
                <View style={styles.trendingRow}>
                  {trendingEvents.map((event) => (
                    <Pressable
                      key={event.id}
                      style={styles.trendingCard}
                      onPress={() => openEvent(event.id)}
                    >
                      <Image source={{ uri: event.image }} style={styles.trendingImage} />
                      <View style={styles.trendingOverlay} />
                      <View style={styles.trendingContent}>
                        <Text style={styles.trendingTitle} numberOfLines={1}>
                          {event.title}
                        </Text>
                        <Text style={styles.trendingMeta} numberOfLines={1}>
                          {event.location}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <View style={styles.activeIndicator} />
          <Ionicons name="home" size={22} color="#6E7BFF" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/discover" as any)}>
          <Ionicons name="compass-outline" size={22} color="#F3F3F5" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/create" as any)}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={handleMapNav}>
          <Ionicons name="map-outline" size={22} color="#F3F3F5" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/profile" as any)}>
          <UserAvatar size={28} />
        </Pressable>
      </View>

      <Modal
        transparent
        visible={cityModalVisible}
        animationType="fade"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setCityModalVisible(false)} />

          <View style={styles.citySheet}>
            <Text style={styles.citySheetTitle}>Choose Your City</Text>

            <Pressable style={styles.cityOption} onPress={handleUseCurrentLocation}>
              <Text style={styles.cityOptionText}>
                {locationLoading ? "Using current location..." : "Use Current Location"}
              </Text>
            </Pressable>

            {CITY_OPTIONS.map((city) => (
              <Pressable
                key={city}
                style={styles.cityOption}
                onPress={() => {
                  setSelectedCity(city);
                  setCityModalVisible(false);
                }}
              >
                <Text style={styles.cityOptionText}>{city}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={filterModalVisible}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setFilterModalVisible(false)} />

          <View style={styles.citySheet}>
            <Text style={styles.citySheetTitle}>Filter Events</Text>

            <View style={styles.filterChipsWrap}>
              {CATEGORY_OPTIONS.map((category) => {
                const active = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setFilterModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        active && styles.filterChipTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  cityButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cityText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  topIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    height: 42,
    backgroundColor: "#F3F3F3",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#111111",
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: "#7D6BFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },
  heroCard: {
    height: 320,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 2,
  },
  heroImage: {
    borderRadius: 2,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.20)",
  },
  heroBottom: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 4,
  },
  heroMeta: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  heroInterest: {
    color: "#D9D9DF",
    fontSize: 10,
    fontWeight: "700",
  },
  horizontalRow: {
    gap: 10,
  },
  smallEventCard: {
    width: 150,
    height: 110,
    overflow: "hidden",
    position: "relative",
    borderRadius: 2,
  },
  smallEventImage: {
    width: "100%",
    height: "100%",
  },
  smallEventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  smallEventContent: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
  },
  smallEventTitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 2,
  },
  smallEventMeta: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "600",
    marginBottom: 2,
    opacity: 0.9,
  },
  smallEventTime: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
    opacity: 0.95,
  },
  trendingRow: {
    flexDirection: "row",
    gap: 10,
  },
  trendingCard: {
    flex: 1,
    height: 110,
    overflow: "hidden",
    borderRadius: 2,
    position: "relative",
  },
  trendingImage: {
    width: "100%",
    height: "100%",
  },
  trendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  trendingContent: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
  },
  trendingTitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 2,
  },
  trendingMeta: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "600",
    opacity: 0.9,
  },
  loadingWrap: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyStateTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  emptyStateText: {
    color: "#BEBEC6",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 260,
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    backgroundColor: "#08080B",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 14,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#6E7BFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  citySheet: {
    backgroundColor: "#121317",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  citySheetTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  cityOption: {
    backgroundColor: "#1B1D24",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cityOptionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  filterChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#1B1D24",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  filterChipActive: {
    backgroundColor: "#6E7BFF",
    borderColor: "#6E7BFF",
  },
  filterChipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
});