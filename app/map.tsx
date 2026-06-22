import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import UserAvatar from "../components/UserAvatar";
import { supabase } from "../lib/supabase";

const DEFAULT_REGION: Region = {
  latitude: 35.3733,
  longitude: -119.0187,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

type EventRow = {
  id: string;
  title: string;
  date_label: string;
  location: string;
  image: string;
  category?: string | null;
  interested?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

type Cluster = {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  events: EventRow[];
};

function makeClusters(events: EventRow[]) {
  const buckets = new Map<string, EventRow[]>();

  for (const event of events) {
    if (typeof event.latitude !== "number" || typeof event.longitude !== "number") continue;

    const latBucket = Math.round(event.latitude * 20) / 20;
    const lngBucket = Math.round(event.longitude * 20) / 20;
    const key = `${latBucket}-${lngBucket}`;

    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(event);
  }

  const clusters: Cluster[] = [];

  buckets.forEach((bucketEvents, key) => {
    const avgLat =
      bucketEvents.reduce((sum, event) => sum + (event.latitude || 0), 0) / bucketEvents.length;
    const avgLng =
      bucketEvents.reduce((sum, event) => sum + (event.longitude || 0), 0) / bucketEvents.length;

    clusters.push({
      id: key,
      latitude: avgLat,
      longitude: avgLng,
      count: bucketEvents.length,
      events: bucketEvents,
    });
  });

  return clusters;
}

export default function MapScreen() {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  const loadMapEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, title, date_label, location, image, category, interested, latitude, longitude"
        )
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      setEvents((data as EventRow[]) || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not load map events.";
      Alert.alert("Map load error", message);
    }
  }, []);

  const centerOnCurrentLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location denied", "Using default map area for now.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      });
    } catch {
      Alert.alert("Location unavailable", "Using default map area for now.");
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMapEvents();
      centerOnCurrentLocation();
    }, [loadMapEvents, centerOnCurrentLocation])
  );

  const clusters = useMemo(() => makeClusters(events), [events]);

  const openCluster = (cluster: Cluster) => {
    if (cluster.count === 1) {
      router.push({
        pathname: "/event-details",
        params: { eventId: cluster.events[0].id },
      } as any);
      return;
    }

    setSelectedCluster(cluster);
  };

  const openEvent = (eventId: string) => {
    setSelectedCluster(null);
    router.push({
      pathname: "/event-details",
      params: { eventId },
    } as any);
  };

  const searchThisArea = () => {
    loadMapEvents();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={DEFAULT_REGION}
          region={region}
          onRegionChangeComplete={setRegion}
          customMapStyle={darkMapStyle}
        >
          {clusters.map((cluster) => (
            <Marker
              key={cluster.id}
              coordinate={{
                latitude: cluster.latitude,
                longitude: cluster.longitude,
              }}
              onPress={() => openCluster(cluster)}
            >
              <View style={styles.clusterMarker}>
                <Text style={styles.clusterText}>{cluster.count}</Text>
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.topOverlay}>
          <Pressable style={styles.topIconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.searchAreaButton} onPress={searchThisArea}>
            <Text style={styles.searchAreaText}>
              {loadingLocation ? "LOCATING..." : "SEARCH THIS AREA"}
            </Text>
          </Pressable>

          <Pressable style={styles.topIconButton} onPress={centerOnCurrentLocation}>
            <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.cityPill}>
          <Text style={styles.cityPillText}>MAP VIEW</Text>
        </View>

        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem} onPress={() => router.push("/home" as any)}>
            <Ionicons name="home-outline" size={22} color="#F3F3F5" />
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => router.push("/discover" as any)}>
            <Ionicons name="compass-outline" size={22} color="#F3F3F5" />
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => router.push("/create" as any)}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.navItem}>
            <View style={styles.activeIndicator} />
            <Ionicons name="map" size={22} color="#6E7BFF" />
          </Pressable>

          <Pressable style={styles.navItem} onPress={() => router.push("/profile" as any)}>
            <UserAvatar size={28} />
          </Pressable>
        </View>

        <Modal
          visible={!!selectedCluster}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedCluster(null)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setSelectedCluster(null)} />

            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>
                {selectedCluster?.count === 1
                  ? "Event in this area"
                  : `${selectedCluster?.count ?? 0} events in this area`}
              </Text>

              {selectedCluster?.events.map((event) => (
                <Pressable
                  key={event.id}
                  style={styles.sheetCard}
                  onPress={() => openEvent(event.id)}
                >
                  <Image source={{ uri: event.image }} style={styles.sheetImage} />
                  <View style={styles.sheetBody}>
                    <Text style={styles.sheetEventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={styles.sheetMeta} numberOfLines={1}>
                      {event.date_label}
                    </Text>
                    <Text style={styles.sheetMeta} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
      </View>
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
  map: {
    flex: 1,
  },
  topOverlay: {
    position: "absolute",
    top: 14,
    left: 18,
    right: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchAreaButton: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchAreaText: {
    color: "#111111",
    fontSize: 11,
    fontWeight: "800",
  },
  cityPill: {
    position: "absolute",
    top: 66,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  cityPillText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  clusterMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  clusterText: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "800",
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
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: "#121317",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    maxHeight: "50%",
  },
  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  sheetCard: {
    flexDirection: "row",
    backgroundColor: "#1B1D24",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
  },
  sheetImage: {
    width: 94,
    height: 94,
  },
  sheetBody: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  sheetEventTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4,
  },
  sheetMeta: {
    color: "#C7C7CF",
    fontSize: 12,
    marginBottom: 2,
  },
});

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#64779e" }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
  { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#334e87" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#023e58" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6f9ba5" }] },
  { featureType: "poi", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#023e58" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3C7680" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
  { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6675" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#255763" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#b0d5ce" }] },
  { featureType: "road.highway", elementType: "labels.text.stroke", stylers: [{ color: "#023e58" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
  { featureType: "transit", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
  { featureType: "transit.line", elementType: "geometry.fill", stylers: [{ color: "#283d6a" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#3a4762" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d70" }] },
];
