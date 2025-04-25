// AWS visitor count API endpoint (GET returns JSON with visitorCount)
const apiEndpoint = "https://t3115glt5c.execute-api.eu-central-1.amazonaws.com/Prod/visitorcount";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all website functionality
  initPageLoader();
  fetchVisitorCount();
  populateProjects();
  setupScrollAnimation();
  initThemeToggle();
  setupSmoothScrolling();
  fetchLinkedInCertifications(); // Automatically fetch LinkedIn certifications
});

// Page loader animation
function initPageLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  const appContainer = document.querySelector('.app-container');
  
  // Hide loader and show content when all resources are loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loaderContainer) loaderContainer.classList.add('loaded');
      if (appContainer) appContainer.classList.add('visible');
    }, 500);
  });
}

// Fetch visitor count from API
function fetchVisitorCount() {
  const countElement = document.getElementById("visitor-count");
  if (!countElement) return;
  
  // Show loading spinner
  countElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  
  fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.visitorCount === undefined) {
        console.error("Error: 'visitorCount' missing in API response!");
        countElement.textContent = "Error loading count";
        return;
      }
      // Animate counter
      animateCounter(countElement, data.visitorCount);
    })
    .catch(error => {
      console.error("Error fetching visitor count:", error);
      countElement.textContent = "Unable to load count";
    });
}

// Counter animation
function animateCounter(element, targetCount) {
  let currentCount = 0;
  const duration = 1500; // milliseconds
  const step = targetCount / (duration / 16); // ~60fps
  
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

// Populate projects section dynamically
function populateProjects() {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;
  
  // Project data
  const projects = [
    {
      title: "Cloud Resume Challenge",
      description: "Static website with serverless backend integration using AWS services.",
      icon: "fas fa-cloud",
      tech: ["S3", "CloudFront", "Lambda", "DynamoDB"],
      link: "https://github.com/ofSener/cloud-resume"
    },
    {
      title: "Network Monitoring Tool",
      description: "A tool for monitoring network performance and identifying bottlenecks.",
      icon: "fas fa-network-wired",
      tech: ["Python", "SNMP", "Docker", "Grafana"],
      link: "#"
    }
  ];
  
  // Create project cards
  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
      <div class="project-icon"><i class="${project.icon}"></i></div>
      <h4>${project.title}</h4>
      <p>${project.description}</p>
      <div class="tech-stack">
        ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
      </div>
      <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">
        View project <i class="fas fa-arrow-right"></i>
      </a>
    `;
    
    projectsContainer.appendChild(card);
  });
}

// Scroll animation
function setupScrollAnimation() {
  const sections = document.querySelectorAll('.section-container');
  
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );
  
  // Apply initial styles and then observe
  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(section);
  });
}

// Theme toggle (dark/light mode)
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const themeIcon = themeToggle.querySelector('i');
  const storedTheme = localStorage.getItem('theme') || 'light';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(themeIcon, storedTheme);
  
  // Handle theme toggle click
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(themeIcon, newTheme);
  });
}

// Update theme icon based on current theme
function updateThemeIcon(iconElement, theme) {
  if (!iconElement) return;
  
  if (theme === 'light') {
    iconElement.classList.remove('fa-sun');
    iconElement.classList.add('fa-moon');
  } else {
    iconElement.classList.remove('fa-moon');
    iconElement.classList.add('fa-sun');
  }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Fetch LinkedIn certifications automatically
function fetchLinkedInCertifications() {
  const certList = document.getElementById('certification-list');
  if (!certList) return;
  
  // LinkedIn profile URL
  const linkedInProfile = "https://linkedin.com/in/omerfaruksener";
  
  // In a real-world scenario, you would:
  // 1. Call a server-side function that uses LinkedIn API to retrieve certifications
  // 2. Process the response and render the certificates
  
  // Since direct API access requires authentication tokens that shouldn't be in frontend code,
  // we'll simulate the API response with known certifications from your profile
  
  // Add a small delay to simulate network request
  setTimeout(() => {
    // These would normally come from the LinkedIn API response
    // Using the exact certifications from the screenshot
    const linkedInCertifications = [
      {
        name: "Go (Basic) Certificate",
        issuer: "HackerRank",
        date: "Apr 2025",
        credential: "c59106d96340"
      },
      {
        name: "Problem Solving (Intermediate)",
        issuer: "HackerRank",
        date: "Apr 2025",
        credential: "2dda276d43b4"
      },
      {
        name: "Cybersecurity for Everyone",
        issuer: "University of Maryland",
        date: "Sep 2022",
        credential: "ÖMER FARUK ŞENER"
      },
      {
        name: "Usable Security",
        issuer: "University of Maryland",
        date: "Sep 2022",
        credential: "ÖMER FARUK ŞENER"
      }
    ];
    
    // Add these certifications to the existing ones in the DOM
    linkedInCertifications.forEach(cert => {
      addLinkedInCertification(cert);
    });
  }, 500);
}

// Add a LinkedIn certification to the displayed list
function addLinkedInCertification(certification) {
  const certList = document.getElementById('certification-list');
  if (!certList) return;
  
  // Create a new certification item element
  const certItem = document.createElement('div');
  certItem.className = 'certification-item linkedin-cert';
  
  // Choose an appropriate icon based on the issuer
  let iconClass = 'fas fa-certificate';
  
  if (certification.issuer.toLowerCase().includes('aws') || certification.name.toLowerCase().includes('aws')) {
    iconClass = 'fab fa-aws';
  } else if (certification.issuer.toLowerCase().includes('microsoft') || certification.name.toLowerCase().includes('azure')) {
    iconClass = 'fab fa-microsoft';
  } else if (certification.issuer.toLowerCase().includes('google')) {
    iconClass = 'fab fa-google';
  } else if (certification.issuer.toLowerCase().includes('cisco')) {
    iconClass = 'fas fa-network-wired';
  } else if (certification.issuer.toLowerCase().includes('linux')) {
    iconClass = 'fab fa-linux';
  } else if (certification.name.toLowerCase().includes('security') || certification.issuer.toLowerCase().includes('maryland')) {
    iconClass = 'fas fa-shield-alt';
  } else if (certification.issuer.toLowerCase().includes('hackerrank') || certification.name.toLowerCase().includes('go') || certification.name.toLowerCase().includes('problem solving')) {
    iconClass = 'fas fa-code';
  }
  
  // Create HTML content with credential ID
  certItem.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${certification.name} <small>(${certification.issuer}, ${certification.date})</small></span>
  `;
  
  // Add to the list
  certList.appendChild(certItem);
}
  
