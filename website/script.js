// AWS visitor count API endpoint (GET returns JSON with visitorCount)
const apiEndpoint = "https://t3115glt5c.execute-api.eu-central-1.amazonaws.com/Prod/visitorcount";

document.addEventListener("DOMContentLoaded", () => {
  // Ziyaretçi sayacını yükle
  fetchVisitorCount();
  // Sayfa yükleme animasyonu
  initPageLoader();
  // Projeler bölümünü dinamik olarak oluştur
  populateProjects();
  // Animasyonları etkinleştir
  animateOnScroll();
  // Dark mode toggle
  initThemeToggle();
  // Smooth scroll yönlendirmeleri için
  setupSmoothScrolling();
});

function fetchVisitorCount() {
  const countSpan = document.getElementById("visitor-count");
  // Başlangıçta yükleniyor animasyonu göster
  if (countSpan) {
    countSpan.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }
  fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!countSpan) return;
      if (data.visitorCount === undefined) {
        console.error("Error: 'visitorCount' missing in API response!");
        countSpan.innerText = "Error loading count";
        return;
      }
      // Numarayı animasyonla göster
      animateCounter(countSpan, data.visitorCount);
    })
    .catch(err => {
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
  const step = targetCount / (duration / 16);  // increase per frame (~60fps)
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
  // IntersectionObserver ile scroll sırasında bölümleri görünce animasyon uygula
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));
}

function setupSmoothScrolling() {
  // Navigasyon linkleri için yumuşak kaydırma
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,  // sabit menü yüksekliği için offset
          behavior: 'smooth'
        });
      }
    });
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  const savedTheme = localStorage.getItem('theme');
  // Tercihe göre başlangıç temasını ayarla (varsayılan: dark)
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  // Toggle theme when button is clicked
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

function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  const content = document.querySelector('.content-container');
  window.addEventListener('load', () => {
    // Tüm kaynaklar yüklendiğinde yükleme animasyonunu gizle
    setTimeout(() => {
      loader.classList.add('loaded');
      if (content) content.classList.add('visible');
    }, 500);
  });
}

function populateProjects() {
  // Projeleri tanımla (başlık, açıklama, simge, teknoloji etiketleri, bağlantı)
  const projects = [
    {
      title: "Cloud Resume Challenge",
      description: "Static website with serverless backend integration.",
      icon: "fas fa-cloud",
      tech: ["(you are here :)", "S3", "CloudFront", "Lambda", "DynamoDB"],
      link: "https://github.com/ofSener/cloud-resume"
    },
    {
      title: "Personal Blog Platform",
      description: "A simple blog platform built with vanilla JS and localStorage.",
      icon: "fas fa-code",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "#"
    }
  ];
  const container = document.getElementById('projects-container');
  if (!container) return;
  // Her proje için kart oluştur ve container içine ekle
  projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-icon"><i class="${proj.icon}"></i></div>
      <h4>${proj.title}</h4>
      <p>${proj.description}</p>
      <div class="tech-stack">
        ${proj.tech.map(t => `<span class="tech-badge">${t}</span>`).join(' ')}
      </div>
      <a href="${proj.link}" class="project-link" target="_blank" rel="noopener noreferrer">
        Details <i class="fas fa-arrow-right"></i>
      </a>
    `;
    container.appendChild(card);
  });
}
