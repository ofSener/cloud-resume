const apiEndpoint = "https://t3115glt5c.execute-api.eu-central-1.amazonaws.com/Prod/visitorcount";

document.addEventListener("DOMContentLoaded", () => {
  // Ziyaretçi sayacını yükle
  fetchVisitorCount();
   // Sayfa yükleme animasyonu
  initPageLoader();
  // Animasyonları etkinleştir
  animateOnScroll();

  // Dark mode toggle
  initThemeToggle();
  // Smooth scroll yönlendirmeleri için
  setupSmoothScrolling();
});

function fetchVisitorCount() {
  const countSpan = document.getElementById("visitor-count");
  
  // Başlangıç yükleniyor animasyonu
  if (countSpan) {
    countSpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }
  
  fetch(apiEndpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data);
      
      if (!countSpan) {
        console.error("Error: HTML element with id='visitor-count' not found!");
        return;
      }
      
      if (data.visitorCount === undefined) {
        console.error("Error: 'visitorCount' missing in API response!");
        countSpan.innerText = "Error loading count";
        return;
      }
      
      // Numarayı animasyonla göster
      animateCounter(countSpan, data.visitorCount);
    })
    .catch((err) => {
      console.error("Error fetching visitor count:", err);
      if (countSpan) {
        countSpan.innerText = "Unable to load count";
      }
    });
}

function animateCounter(element, targetCount) {
  // Basit bir sayaç animasyonu
  let currentCount = 0;
  const duration = 1000; // milisaniye
  const step = targetCount / (duration / 16);
  
  const updateCount = () => {
    currentCount += step;
    
    if (currentCount >= targetCount) {
      element.textContent = targetCount;
      return;
    }
    
    element.textContent = Math.floor(currentCount);
    requestAnimationFrame(updateCount);
  };
  
  requestAnimationFrame(updateCount);
}

function animateOnScroll() {
  // IntersectionObserver kullanarak scroll'da animasyonları etkinleştir
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

function setupSmoothScrolling() {
  // Navigasyon bağlantıları için smooth scroll
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Nav yüksekliği için offset
          behavior: 'smooth'
        });
      }
    });
  });
}

// Dark mode toggling
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Check for saved theme preference or respect OS preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  
  // Set initial theme based on saved preference or OS preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme;
    
    if (currentTheme === 'light') {
      newTheme = 'dark';
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      newTheme = 'light';
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
// Sayfa yükleme animasyonu
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  const content = document.querySelector('.content-container');
  
  window.addEventListener('load', () => {
    // Tüm kaynaklar yüklendiğinde loader'ı gizle
    setTimeout(() => {
      loader.classList.add('loaded');
      content.classList.add('visible');
    }, 500);
  });
}
