import React from "react";
import {
    Alert,
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const categories = [
  {
    id: "1",
    title: "Music",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Food",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Comedy",
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    title: "Nightlife",
    image:
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "5",
    title: "Sports",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "6",
    title: "Outdoors",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
];

const trendingEvents = [
  {
    id: "1",
    title: "Neon Nights DJ Pulse",
    meta: "Fri, Apr 25 • 10:00 PM",
    location: "The Echo Lounge",
    interested: 124,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Taco & Beer Fest",
    meta: "Sat, Apr 26 • 6:00 PM",
    location: "Downtown Lot",
    interested: 89,
    image:
      "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    title: "Saturday Night Laughs",
    meta: "Sat, Apr 26 • 8:00 PM",
    location: "Comedy Den",
    interested: 76,
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
  },
];

const weekendEvents = [
  {
    id: "1",
    day: "FRI",
    date: "26",
    title: "Lo-Fi Beats & Brews",
    time: "7:00 PM",
    image:
      "https://images.unsplash.com/photo-1571266028243-d220c9b5b362?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    day: "SAT",
    date: "27",
    title: "Sunset Rooftop Session",
    time: "8:30 PM",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    day: "SUN",
    date: "28",
    title: "Local Artist Pop-Up",
    time: "12:00 PM",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Discovery</Text>
            <Text style={styles.subtitle}>Find events that match your vibe</Text>
          </View>

          <Pressable
            style={styles.iconButton}
            onPress={() => Alert.alert("Notifications", "Coming later")}
          >
            <Text style={styles.iconText}>🔔</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => Alert.alert("Search", "Search behavior comes next")}>
          <View pointerEvents="none" style={styles.searchWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              editable={false}
              placeholder="Search events, venues, DJs, food..."
              placeholderTextColor="#7F89B0"
              style={styles.searchInput}
            />
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Browse Categories</Text>

        <View style={styles.categoryGrid}>
          {categories.map((item) => (
            <Pressable
              key={item.id}
              style={styles.categoryCard}
              onPress={() => Alert.alert(item.title, `${item.title} filter comes next`)}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.categoryImage}
                imageStyle={styles.categoryImageStyle}
              >
                <View style={styles.categoryOverlay} />
                <Text style={styles.categoryTitle}>{item.title}</Text>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Trending Near You</Text>
          <Pressable onPress={() => Alert.alert("More", "Full trending list later")}>
            <Text style={styles.linkText}>See all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalRow}
        >
          {trendingEvents.map((event) => (
            <Pressable
              key={event.id}
              style={styles.trendingCard}
              onPress={() => Alert.alert(event.title, "Open event details next")}
            >
              <ImageBackground
                source={{ uri: event.image }}
                style={styles.trendingImage}
                imageStyle={styles.trendingImageStyle}
              >
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingBadgeText}>🔥 {event.interested} interested</Text>
                </View>
              </ImageBackground>

              <View style={styles.trendingBody}>
                <Text style={styles.trendingTitle}>{event.title}</Text>
                <Text style={styles.trendingMeta}>{event.meta}</Text>
                <Text style={styles.trendingLocation}>{event.location}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🗓️ This Weekend</Text>
          <Pressable onPress={() => Alert.alert("More", "Weekend list later")}>
            <Text style={styles.linkText}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.weekendList}>
          {weekendEvents.map((event) => (
            <Pressable
              key={event.id}
              style={styles.weekendCard}
              onPress={() => Alert.alert(event.title, "Open event details next")}
            >
              <ImageBackground
                source={{ uri: event.image }}
                style={styles.weekendImage}
                imageStyle={styles.weekendImageStyle}
              >
                <View style={styles.weekendOverlay} />
                <View style={styles.datePill}>
                  <Text style={styles.datePillDay}>{event.day}</Text>
                  <Text style={styles.datePillDate}>{event.date}</Text>
                </View>

                <View style={styles.weekendTextWrap}>
                  <Text style={styles.weekendTitle}>{event.title}</Text>
                  <Text style={styles.weekendTime}>{event.time}</Text>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </View>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
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
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#10162A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1A2340",
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 17,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E1327",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#6B4DFF",
    paddingHorizontal: 16,
    marginBottom: 22,
    shadowColor: "#6B4DFF",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  searchIcon: {
    color: "#A4AADB",
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    paddingVertical: 16,
    fontSize: 16,
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },
  linkText: {
    color: "#9A7BFF",
    fontSize: 15,
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  categoryCard: {
    width: "48.5%",
    marginBottom: 12,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#0B1124",
  },
  categoryImage: {
    height: 118,
    justifyContent: "flex-end",
  },
  categoryImageStyle: {
    borderRadius: 18,
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 22, 0.28)",
  },
  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    padding: 14,
  },
  horizontalRow: {
    paddingBottom: 8,
    gap: 14,
  },
  trendingCard: {
    width: 265,
    backgroundColor: "#0B1124",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#18213F",
  },
  trendingImage: {
    height: 170,
    justifyContent: "flex-start",
  },
  trendingImageStyle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  trendingBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(12, 18, 36, 0.86)",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginTop: 12,
    marginLeft: 12,
  },
  trendingBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  trendingBody: {
    padding: 14,
  },
  trendingTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  trendingMeta: {
    color: "#D9DDF2",
    fontSize: 15,
    marginBottom: 4,
  },
  trendingLocation: {
    color: "#95A0C6",
    fontSize: 14,
  },
  weekendList: {
    gap: 12,
    paddingBottom: 20,
  },
  weekendCard: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#0B1124",
    borderWidth: 1,
    borderColor: "#18213F",
  },
  weekendImage: {
    height: 122,
    justifyContent: "space-between",
    padding: 14,
  },
  weekendImageStyle: {
    borderRadius: 22,
  },
  weekendOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 22, 0.34)",
  },
  datePill: {
    width: 58,
    borderRadius: 16,
    backgroundColor: "rgba(92, 83, 255, 0.95)",
    paddingVertical: 8,
    alignItems: "center",
  },
  datePillDay: {
    color: "#E8EAFF",
    fontSize: 11,
    fontWeight: "800",
  },
  datePillDate: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 1,
  },
  weekendTextWrap: {
    marginTop: "auto",
  },
  weekendTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 3,
  },
  weekendTime: {
    color: "#D7DCF0",
    fontSize: 15,
    fontWeight: "600",
  },
});
