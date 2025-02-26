const apiEndpoint = "https://1g8odqtrnb.execute-api.eu-central-1.amazonaws.com/visitors";

document.addEventListener("DOMContentLoaded", () => {
  fetch(apiEndpoint)
    .then((response) => response.json())
    .then((data) => {
        const countSpan = document.getElementById("visitor-count");
        countSpan.innerText = data.count;
      })

    .catch((err) => {
      console.error("Error fetching visitor count:", err);
    });
});