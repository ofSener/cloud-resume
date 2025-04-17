/* === THEME TOGGLE === */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  const root = document.documentElement;
  root.toggleAttribute('data-theme', root.hasAttribute('data-theme') ? null : 'dark');
});

/* === PAGE LOADER FADE OUT === */
window.addEventListener('load', () => {
  document.querySelector('.page-loader').classList.add('loaded');
});

/* === VISITOR COUNTER (existing Lambda API) === */
const COUNTER_API = 'https://t3115glt5c.execute-api.eu-central-1.amazonaws.com/Prod/visitorcount';

fetch(COUNTER_API, { method: 'GET' })
  .then(res => res.json())
  .then(data => {
    // Cloud‑Resume pattern => { "visitor": 123 }
    document.getElementById('visitor-count').textContent = data.visitor ?? data;
  })
  .catch(() => document.getElementById('visitor-count').textContent = '—');

/* === DYNAMIC PORTFOLIO GRID === */
const projects = [
  {
    title: 'AI Prompt Hub',
    desc: 'Multi‑agent prompt marketplace built with Next.js + LangGraph',
    img: 'assets/prompt-hub.png',
    stack: ['Next.js', 'LangGraph', 'AWS Lambda'],
    url: 'https://github.com/ofSener/ai-prompt-hub'
  },
  {
    title: 'Serverless Limit Calculator',
    desc: 'Scales to 1 K users for < $1/month',
    img: 'assets/limit-calc.png',
    stack: ['API Gateway', 'Step Functions', 'Go'],
    url: 'https://limit-calc.dev'
  },
  {
    title: 'Cloud Resume Challenge',
    desc: 'Static website with serverless backend (this site)',
    img: 'assets/crc.png',
    stack: ['S3', 'CloudFront', 'Lambda', 'DynamoDB'],
    url: 'https://github.com/ofSener/cloud-resume'
  }
];

const grid = document.getElementById('portfolio-grid');
projects.forEach(p => {
  grid.insertAdjacentHTML('beforeend', `
    <div class="project-card">
      <img src="${p.img}" alt="${p.title} screenshot" loading="lazy">
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="tech-stack">
        ${p.stack.map(t => `<span class="tech-badge">${t}</span>`).join('')}
      </div>
      <a href="${p.url}" class="project-link" target="_blank" rel="noopener">
        Details <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  `);
});
