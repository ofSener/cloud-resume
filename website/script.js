const apiEndpoint = "https://t3115glt5c.execute-api.eu-central-1.amazonaws.com/Prod/visitorcount";

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