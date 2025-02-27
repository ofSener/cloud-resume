const apiEndpoint = "https://t3115glt5c.execute-api.eu-central-1.amazonaws.com/Prod/visitorcount";

document.addEventListener("DOMContentLoaded", () => {
  fetch(apiEndpoint)
    .then((response) => response.json())
    .then((data) => {
        console.log("API Yanıtı:", data); // API'den dönen JSON'u görmek için log ekledik

        // `visitor-count` id'li HTML elementi var mı kontrol et
        const countSpan = document.getElementById("visitor-count");
        if (!countSpan) {
            console.error("Hata: HTML içinde id='visitor-count' bulunamadı!");
            return; // Eğer `id="visitor-count"` yoksa işlemi durdur
        }

        // API'den `visitorCount` anahtarını doğru aldığımızı doğrula
        if (data.visitorCount === undefined) {
            console.error("Hata: API yanıtında 'visitorCount' eksik!");
            countSpan.innerText = "Error";
            return;
        }

        // Ziyaretçi sayısını ekrana yazdır
        countSpan.innerText = data.visitorCount;
    })
    .catch((err) => {
        console.error("Error fetching visitor count:", err);
    });
});
