import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORY_CARDS = [
  {
    title: "Live Music",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
    backgroundColor: "#F2F2F2",
    textColor: "#111111",
  },
  {
    title: "Outdoors",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    backgroundColor: "#C7D7A4",
    textColor: "#111111",
  },
  {
    title: "Community Events",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    backgroundColor: "#7E72C8",
    textColor: "#FFFFFF",
  },
  {
    title: "Romantic",
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    backgroundColor: "#8D1714",
    textColor: "#FFFFFF",
  },
  {
    title: "Food",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    backgroundColor: "#6A3718",
    textColor: "#FFFFFF",
  },
  {
    title: "Sports",
    image:
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
    backgroundColor: "#74B344",
    textColor: "#FFFFFF",
  },
];

const COMMUNITY_VIDEOS = [
  {
    title: "Washer Hockey Game",
    creator: "@ianorozco",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Mango Sticky Rice",
    creator: "@kaylaeats",
    image:
      "https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Fresh Cookies",
    creator: "@nightmarket",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
  },
];

const UPCOMING_EVENTS = [
  {
    title: "Soft Opening",
    subtitle: "Temporary Store Hours",
    meta: "4/20 - 5/15 • Open daily 9AM - 3PM",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Monster Truck Tour",
    subtitle: "Live at Bakersfield Fairgrounds",
    meta: "Friday 8PM • Tickets on sale now",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
            }}
            style={styles.avatar}
          />

          <Text style={styles.cityText}>LOS ANGELES</Text>

          <Pressable style={styles.iconWrap}>
            <Text style={styles.bellIcon}>◠</Text>
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            placeholder="Search artists, venues, or categories"
            placeholderTextColor="#7B7B7B"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BROWSE EVENTS</Text>

          <View style={styles.categoryGrid}>
            {CATEGORY_CARDS.map((card) => (
              <Pressable
                key={card.title}
                style={[styles.categoryCard, { backgroundColor: card.backgroundColor }]}
              >
                <Text style={[styles.categoryTitle, { color: card.textColor }]}>{card.title}</Text>

                <Image
                  source={{ uri: card.image }}
                  style={styles.categoryImage}
                  resizeMode="contain"
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>COMMUNITY VIDEOS</Text>
            <Text style={styles.sectionLink}>View all</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.videoRow}
          >
            {COMMUNITY_VIDEOS.map((video) => (
              <Pressable key={video.title} style={styles.videoCard}>
                <Image source={{ uri: video.image }} style={styles.videoImage} />
                <View style={styles.videoOverlay} />
                <View style={styles.videoBadge}>
                  <Text style={styles.videoBadgeText}>▶</Text>
                </View>
                <View style={styles.videoTextWrap}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoCreator}>{video.creator}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPCOMING EVENTS</Text>

          {UPCOMING_EVENTS.map((event) => (
            <Pressable key={event.title} style={styles.upcomingCard}>
              <Image source={{ uri: event.image }} style={styles.upcomingImage} />
              <View style={styles.upcomingOverlay} />
              <View style={styles.upcomingContent}>
                <Text style={styles.upcomingTitle}>{event.title}</Text>
                <Text style={styles.upcomingSubtitle}>{event.subtitle}</Text>
                <Text style={styles.upcomingMeta}>{event.meta}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push("/home")}>
          <Text style={styles.navIcon}>⌂</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/discover")}>
          <Text style={[styles.navIcon, styles.activeNav]}>◉</Text>
        </Pressable>

        <Pressable style={styles.centerButton} onPress={() => router.push("/create")}>
          <Text style={styles.centerButtonText}>＋</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>🗺</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/profile")}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
            }}
            style={styles.navAvatar}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B1B1D",
  },
  container: {
    flex: 1,
    backgroundColor: "#1B1B1D",
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
    marginBottom: 18,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  cityText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
  },
  bellIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
  },
  searchBar: {
    height: 42,
    backgroundColor: "#F3F3F3",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  searchIcon: {
    color: "#6F6F6F",
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#111111",
    fontSize: 12,
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },
  sectionLink: {
    color: "#BEBEBE",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryCard: {
    width: "48.4%",
    height: 62,
    borderRadius: 4,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "space-between",
    position: "relative",
  },
  categoryTitle: {
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    zIndex: 2,
    maxWidth: "65%",
  },
  categoryImage: {
    position: "absolute",
    right: 6,
    bottom: 0,
    width: 64,
    height: 64,
  },
  videoRow: {
    gap: 10,
  },
  videoCard: {
    width: 108,
    height: 160,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#2B2B2E",
    position: "relative",
  },
  videoImage: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.14)",
  },
  videoBadge: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 1,
  },
  videoTextWrap: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
  },
  videoTitle: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  videoCreator: {
    color: "#F1F1F1",
    fontSize: 8,
    fontWeight: "600",
  },
  upcomingCard: {
    height: 84,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#2B2B2E",
    position: "relative",
  },
  upcomingImage: {
    width: "100%",
    height: "100%",
  },
  upcomingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  upcomingContent: {
    position: "absolute",
    left: 14,
    right: 14,
    top: 14,
    bottom: 14,
    justifyContent: "center",
  },
  upcomingTitle: {
    color: "#7D2A22",
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  upcomingSubtitle: {
    color: "#8F4A3D",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  upcomingMeta: {
    color: "#5E3E37",
    fontSize: 8,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  bottomNav: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 16,
    height: 64,
    backgroundColor: "#0E0E10",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 2,
  },
  navItem: {
    width: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    color: "#FFFFFF",
    fontSize: 22,
  },
  activeNav: {
    color: "#FFFFFF",
  },
  centerButton: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButtonText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "500",
    marginTop: -2,
  },
  navAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});