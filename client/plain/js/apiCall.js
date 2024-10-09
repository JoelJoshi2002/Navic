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
