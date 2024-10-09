import { useState, useEffect } from "react";
import Loader from "react-loading";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";

const URL = import.meta.env.VITE_BASE_URL;

const styles = {
  tabStyle: {
    backgroundColor: "#fff",
    borderRadius: "500vh",
    position: "absolute",
    bottom: 10,
    right: "50%",
    padding: "1em",
  },
};

function Map({ selectedBUS }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
    libraries: ["places"],
  });
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentLocation, setCurrentLocation] = useState({});
  const [busLocation, setBusLocation] = useState({});
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    getLocation();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedBUS !== "") {
      initApi();
      const intervalId = setInterval(initApi, 30000); // Update every 30 seconds
      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [selectedBUS]);

  useEffect(() => {
    if (
      Object.keys(currentLocation).length !== 0 &&
      Object.keys(busLocation).length !== 0
    ) {
      calculateRoute();
    }
  }, [currentLocation, busLocation]);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = parseFloat(position.coords.latitude);
            const lng = parseFloat(position.coords.longitude);
            setCurrentLocation({
              lat,
              lng,
            });
          },
          (error) => {
            console.error("Error getting user location:", error);
            reject(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const initApi = async () => {
    try {
      const response = await axios.get(`${URL}/latest/${selectedBUS}`);
      setBusLocation({
        lat: parseFloat(response.data.latitude),
        lng: parseFloat(response.data.longitude),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  async function calculateRoute() {
    if (selectedBUS === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: currentLocation,
      destination: busLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  return (
    <>
      {!isLoading && isLoaded ? (
        <>
          <GoogleMap
            center={currentLocation}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={currentLocation} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
          {duration !== "" && (
            <div style={styles.tabStyle}>
              Estimated Duration: {duration}, Distance: {distance}
            </div>
          )}
        </>
      ) : (
        <Loader type="spin" color="#fff" />
      )}
    </>
  );
}

export default Map;
