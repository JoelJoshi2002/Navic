var map;

function initMap() {
  showLoader("Loading data...");
  getLocation()
    .then((devCoors) => {
      return initApi().then((coor) => {
        hideLoader(); // Hide loader once data is loaded
        const center = devCoors;
        const options = { zoom: 15, scaleControl: true, center: center };
        map = new google.maps.Map(document.getElementById("map"), options);

        const location1 = devCoors;
        const location2 = { lat: coor.latitude, lng: coor.longitude };

        var mk1 = new google.maps.Marker({ position: location1, map: map });
        var mk2 = new google.maps.Marker({ position: location2, map: map });
        let directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        const route = {
          origin: location1,
          destination: location2,
          travelMode: "DRIVING",
        };

        directionsService.route(route, function (response, status) {
          if (status !== "OK") {
            window.alert("Directions request failed due to " + status);
            return;
          } else {
            directionsRenderer.setDirections(response);
            var directionsData = response.routes[0].legs[0];
            if (!directionsData) {
              window.alert("Directions request failed");
              return;
            } else {
              document.getElementById("msg").innerHTML = ""; // Clear existing data before adding new
              showLoader("Calculating distance..."); // Show loader while calculating distance
              // Use setTimeout to simulate typing effect
              setTimeout(function () {
                document.getElementById("msg").innerHTML =
                  " Driving distance is " +
                  directionsData.distance.text +
                  " (" +
                  directionsData.duration.text +
                  ").";
                hideLoader(); // Hide loader once distance is calculated
              }, 1500); // Adjust the time delay according to your preference
            }
          }
        });
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the API call
      console.error("Error initializing map:", error);
    });
}

// Function to show loader with typewriting effect
function showLoader(text) {
  var loader = document.getElementById("loader");
  var i = 0;
  loader.innerHTML = ""; // Clear loader content
  var typingInterval = setInterval(function () {
    if (i < text.length) {
      loader.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
    }
  }, 100); // Adjust typing speed as needed
  loader.style.display = "block"; // Show loader
}

// Function to hide loader
function hideLoader() {
  document.getElementById("loader").style.display = "none"; // Hide loader
}

const URL = "https://node-app-xi-eight.vercel.app";
const BUS = "AA-00-0000";

function initApi() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  // Return the fetch call so that you can handle it in app.js
  return fetch(`${URL}/${BUS}/latest`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to handle it in app.js
    });
}

function getLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          resolve({ lat, lng });
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
}
