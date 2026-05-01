import * as Location from "expo-location";

export type GeocodedVenue = {
  latitude: number;
  longitude: number;
};

export async function geocodeVenueAddress(params: {
  address: string;
  city: string;
  state: string;
}): Promise<GeocodedVenue> {
  const { address, city, state } = params;

  const fullAddress = `${address}, ${city}, ${state}`;

  const results = await Location.geocodeAsync(fullAddress);

  if (!results.length) {
    throw new Error("We couldn't verify that address. Please check it and try again.");
  }

  return {
    latitude: results[0].latitude,
    longitude: results[0].longitude,
  };
}