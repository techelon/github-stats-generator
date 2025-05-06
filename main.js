// DOM Elements
const fetchUserBtn = document.getElementById('fetch-user');
const usernameInput = document.getElementById('username');
const generateBtn = document.getElementById('generate-btn');
const previewContent = document.getElementById('preview-content');
const copyBtn = document.getElementById('copy-btn');
const exportBtn = document.getElementById('export-btn');
const shareBtn = document.getElementById('share-btn');
const helpBtn = document.getElementById('help-btn');
const settingsBtn = document.getElementById('settings-btn');
const customizeBtn = document.getElementById('customize-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const refreshBtn = document.querySelector('.preview-header button:first-child');
const sizeButtons = document.querySelectorAll('.size-options button');
const themeButtons = document.querySelectorAll('.theme-options button');
const viewButtons = document.querySelectorAll('.view-options button');

// Form Elements
const themeSelect = document.getElementById('theme-select');
const layoutSelect = document.getElementById('layout-select');
const localeSelect = document.getElementById('locale-select');
const showAvatar = document.getElementById('show-avatar');
const showBio = document.getElementById('show-bio');
const showLocation = document.getElementById('show-location');
const privateContributions = document.getElementById('private-contributions');
const showStreaks = document.getElementById('show-streaks');
const contribGraph = document.getElementById('contrib-graph');
const repoInsights = document.getElementById('repo-insights');
const topLangs = document.getElementById('top-langs');
const starsForks = document.getElementById('stars-forks');
const achievements = document.getElementById('achievements');
const activityGraph = document.getElementById('activity-graph');
const metrics = document.getElementById('metrics');

// State
let currentUser = 'techelon';
let userData = null;
let repoData = [];
let languageData = {};
let contributionData = [];
let statsConfig = {
  theme: 'github',
  layout: 'default',
  locale: 'en',
  cardSize: 'medium',
  showAvatar: true,
  showBio: true,
  showLocation: true,
  privateContributions: true,
  showStreaks: true,
  contribGraph: true,
  repoInsights: true,
  topLangs: true,
  starsForks: true,
  achievements: true,
  activityGraph: true,
  metrics: true,
  viewMode: 'grid'
};

// GitHub API Token (Note: In production, this should be handled via backend)
const GITHUB_TOKEN = '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'; // Add your GitHub token here if needed

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set initial values from HTML
  statsConfig.theme = themeSelect.value;
  statsConfig.layout = layoutSelect.value;
  statsConfig.locale = localeSelect.value;
  
  // Load default user
  fetchUserData(currentUser);
  
  // Update UTC time every second
  updateUTCTime();
  setInterval(updateUTCTime, 1000);
});

// Event Listeners
fetchUserBtn.addEventListener('click', () => {
  currentUser = usernameInput.value.trim();
  if (currentUser) {
    fetchUserData(currentUser);
  }
});

usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    currentUser = usernameInput.value.trim();
    if (currentUser) {
      fetchUserData(currentUser);
    }
  }
});


generateBtn.addEventListener('click', generateStats);

copyBtn.addEventListener('click', copyStats);
exportBtn.addEventListener('click', exportStats);
shareBtn.addEventListener('click', shareStats);
helpBtn.addEventListener('click', showHelp);
settingsBtn.addEventListener('click', showSettings);
customizeBtn.addEventListener('click', showCustomize);
refreshBtn.addEventListener('click', refreshPreview);

// Tab switching
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active', 'border-brand-500', 'text-brand-600'));
    tabButtons.forEach(btn => btn.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300'));
    
    button.classList.add('active', 'border-brand-500', 'text-brand-600');
    button.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    
    switchTab(button.textContent.trim().toLowerCase());
  });
});

// Size options
sizeButtons.forEach(button => {
  button.addEventListener('click', () => {
    sizeButtons.forEach(btn => btn.classList.remove('bg-brand-50', 'text-brand-600'));
    button.classList.add('bg-brand-50', 'text-brand-600');
    statsConfig.cardSize = button.textContent.toLowerCase();
    updatePreview();
  });
});

// Theme options
themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const theme = button.getAttribute('title').toLowerCase().replace(' ', '-');
    themeSelect.value = theme;
    statsConfig.theme = theme;
    updatePreview();
  });
});

// View options
viewButtons.forEach(button => {
  button.addEventListener('click', () => {
    viewButtons.forEach(btn => btn.classList.remove('bg-gray-100', 'text-gray-700'));
    button.classList.add('bg-gray-100', 'text-gray-700');
    statsConfig.viewMode = button.querySelector('svg').getAttribute('aria-hidden') ? 'grid' : 'list';
    updatePreview();
  });
});

// Form change listeners
themeSelect.addEventListener('change', (e) => {
  statsConfig.theme = e.target.value;
  updatePreview();
});

layoutSelect.addEventListener('change', (e) => {
  statsConfig.layout = e.target.value;
  updatePreview();
});

localeSelect.addEventListener('change', (e) => {
  statsConfig.locale = e.target.value;
  updatePreview();
});

showAvatar.addEventListener('change', (e) => {
  statsConfig.showAvatar = e.target.checked;
  updatePreview();
});

showBio.addEventListener('change', (e) => {
  statsConfig.showBio = e.target.checked;
  updatePreview();
});

showLocation.addEventListener('change', (e) => {
  statsConfig.showLocation = e.target.checked;
  updatePreview();
});

privateContributions.addEventListener('change', (e) => {
  statsConfig.privateContributions = e.target.checked;
  updatePreview();
});

showStreaks.addEventListener('change', (e) => {
  statsConfig.showStreaks = e.target.checked;
  updatePreview();
});

contribGraph.addEventListener('change', (e) => {
  statsConfig.contribGraph = e.target.checked;
  updatePreview();
});

repoInsights.addEventListener('change', (e) => {
  statsConfig.repoInsights = e.target.checked;
  updatePreview();
});

topLangs.addEventListener('change', (e) => {
  statsConfig.topLangs = e.target.checked;
  updatePreview();
});

starsForks.addEventListener('change', (e) => {
  statsConfig.starsForks = e.target.checked;
  updatePreview();
});

achievements.addEventListener('change', (e) => {
  statsConfig.achievements = e.target.checked;
  updatePreview();
});

activityGraph.addEventListener('change', (e) => {
  statsConfig.activityGraph = e.target.checked;
  updatePreview();
});

metrics.addEventListener('change', (e) => {
  statsConfig.metrics = e.target.checked;
  updatePreview();
});

// Functions
async function fetchUserData(username) {
  try {
    // Show loading state
    showLoadingState();
    
    // Fetch user data from GitHub API
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {}
    });
    
    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }
    
    userData = await userResponse.json();
    
    // Fetch user repositories
    const reposResponse = await fetch(userData.repos_url + '?per_page=100', {
      headers: GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {}
    });
    repoData = await reposResponse.json();
    
    // Calculate language data
    calculateLanguageData();
    
    // Fetch contribution data (using GitHub's contribution calendar)
    // Note: GitHub doesn't provide an official API for this, so we'll simulate it
    simulateContributionData();
    
    updatePreview();
    updateLastUpdated();
  } catch (error) {
    console.error('Error fetching user data:', error);
    showErrorState(error);
  }
}

function calculateLanguageData() {
  languageData = {};
  
  repoData.forEach(repo => {
    if (repo.language) {
      languageData[repo.language] = (languageData[repo.language] || 0) + 1;
    }
  });
}

function simulateContributionData() {
  contributionData = [];
  const now = new Date();
  
  // Generate 1 year of contribution data
  for (let i = 0; i < 365; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    contributionData.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10) // Simulate 0-9 contributions per day
    });
  }
  
  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  
  contributionData.forEach(day => {
    if (day.count > 0) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  });
  
  // Add streaks to user data
  userData.current_streak = currentStreak;
  userData.longest_streak = longestStreak;
  userData.total_contributions = contributionData.reduce((sum, day) => sum + day.count, 0);
}

function generateStats() {
  if (!userData) {
    showAlert('Please fetch user data first');
    return;
  }
  
  // Show loading state on button
  generateBtn.disabled = true;
  generateBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Generating...
  `;
  
  // Simulate processing time
  setTimeout(() => {
    updatePreview();
    generateBtn.disabled = false;
    generateBtn.innerHTML = 'Generate Stats <svg class="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>';
    updateLastUpdated();
  }, 1000);
}

function refreshPreview() {
  if (!userData) {
    showAlert('No user data to refresh');
    return;
  }
  
  showLoadingState();
  
  // Simulate refresh delay
  setTimeout(() => {
    updatePreview();
    updateLastUpdated();
  }, 800);
}

function updatePreview() {
  if (!userData) return;
  
  // Generate HTML preview based on current config
  let previewHTML = `
    <div class="github-stats-preview theme-${statsConfig.theme} layout-${statsConfig.layout} size-${statsConfig.cardSize} view-${statsConfig.viewMode}">
      <div class="stats-header">
  `;
  
  if (statsConfig.showAvatar) {
    previewHTML += `
      <img src="${userData.avatar_url}" alt="${userData.login}" class="user-avatar">
    `;
  }
  
  previewHTML += `
        <h2 class="username">${userData.name || userData.login}</h2>
  `;
  
  if (statsConfig.showBio && userData.bio) {
    previewHTML += `
      <p class="user-bio">${userData.bio}</p>
    `;
  }
  
  if (statsConfig.showLocation && userData.location) {
    previewHTML += `
      <p class="user-location">
        <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        ${userData.location}
      </p>
    `;
  }
  
  previewHTML += `
      </div>
      <div class="stats-container">
  `;
  
  if (statsConfig.viewMode === 'grid') {
    previewHTML += `<div class="stats-grid">`;
  } else {
    previewHTML += `<div class="stats-list">`;
  }
  
  // General stats
  previewHTML += generateStatCard('Repositories', userData.public_repos, 'folder');
  previewHTML += generateStatCard('Followers', userData.followers, 'users');
  previewHTML += generateStatCard('Following', userData.following, 'user-plus');
  
  // Contribution stats
  if (statsConfig.privateContributions || statsConfig.showStreaks) {
    previewHTML += generateStatCard('Contributions', userData.total_contributions, 'git-commit');
    
    if (statsConfig.showStreaks) {
      previewHTML += generateStatCard('Current Streak', userData.current_streak, 'flame');
      previewHTML += generateStatCard('Longest Streak', userData.longest_streak, 'award');
    }
  }
  
  // Repository stats
  if (statsConfig.repoInsights || statsConfig.topLangs || statsConfig.starsForks) {
    if (statsConfig.starsForks) {
      const totalStars = repoData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repoData.reduce((sum, repo) => sum + repo.forks_count, 0);
      previewHTML += generateStatCard('Stars', totalStars, 'star');
      previewHTML += generateStatCard('Forks', totalForks, 'git-branch');
    }
    
    if (statsConfig.topLangs && Object.keys(languageData).length > 0) {
      const topLanguages = Object.entries(languageData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(lang => lang[0])
        .join(', ');
      previewHTML += generateStatCard('Top Languages', topLanguages, 'code');
    }
  }
  
  // Additional stats
  if (statsConfig.achievements || statsConfig.metrics) {
    const accountAge = Math.floor((new Date() - new Date(userData.created_at)) / (1000 * 60 * 60 * 24 * 365));
    previewHTML += generateStatCard('GitHub Age', `${accountAge} years`, 'calendar');
  }
  
  if (statsConfig.viewMode === 'grid') {
    previewHTML += `</div>`; // Close stats-grid
  } else {
    previewHTML += `</div>`; // Close stats-list
  }
  
  // Contribution graph
  if (statsConfig.contribGraph) {
    previewHTML += generateContributionGraph();
  }
  
  // Activity graph
  if (statsConfig.activityGraph) {
    previewHTML += generateActivityGraph();
  }
  
  previewHTML += `
      </div>
    </div>
    ${generateStyles()}
  `;
  
  previewContent.innerHTML = previewHTML;
}

function generateStatCard(label, value, icon) {
  const icons = {
    'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    'user-plus': 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    'git-commit': 'M12 15a3 3 0 100-6 3 3 0 000 6zm0 0a9 9 0 11-9-9 9 9 0 019 9z',
    'flame': 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z',
    'award': 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    'star': 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    'git-branch': 'M5 3v16M19 3v16M5 7h8a4 4 0 014 4v4M5 11h6a2 2 0 002-2V7m0 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2',
    'code': 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  };
  
  return `
    <div class="stat-card">
      <div class="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icons[icon]}"/>
        </svg>
      </div>
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    </div>
  `;
}

function generateContributionGraph() {
  // Group contributions by day of week (0-6) and week number (0-51)
  const weeks = Array(7).fill().map(() => Array(52).fill(0));
  
  contributionData.forEach(day => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
    const weekOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
    
    if (weekOfYear >= 0 && weekOfYear < 52) {
      weeks[dayOfWeek][51 - weekOfYear] = day.count;
    }
  });
  
  // Generate graph cells
  let cells = '';
  for (let day = 0; day < 7; day++) {
    for (let week = 0; week < 52; week++) {
      const count = weeks[day][week];
      const intensity = Math.min(4, Math.floor(count / 3));
      cells += `<div class="graph-cell intensity-${intensity}" title="${count} contributions"></div>`;
    }
  }
  
  return `
    <div class="contribution-graph">
      <h3 class="graph-title">Contribution Activity</h3>
      <div class="graph-grid">
        ${cells}
      </div>
      <div class="graph-legend">
        <span>Less</span>
        ${Array(5).fill().map((_, i) => `<div class="legend-cell intensity-${i}"></div>`).join('')}
        <span>More</span>
      </div>
    </div>
  `;
}

function generateActivityGraph() {
  // Generate random activity data for demo
  const dataPoints = 30;
  const points = Array(dataPoints).fill().map((_, i) => {
    return {
      day: i + 1,
      activity: Math.floor(Math.random() * 10)
    };
  });
  
  // Generate SVG path
  let path = `M0,${100 - points[0].activity * 10}`;
  points.forEach((point, i) => {
    if (i > 0) {
      path += ` L${(i / dataPoints) * 100},${100 - point.activity * 10}`;
    }
  });
  
  // Generate dots
  const dots = points.map((point, i) => {
    return `<circle cx="${(i / dataPoints) * 100}%" cy="${100 - point.activity * 10}%" r="3" fill="currentColor"/>`;
  }).join('');
  
  return `
    <div class="activity-graph">
      <h3 class="graph-title">Recent Activity</h3>
      <div class="graph-container">
        <svg width="100%" height="200">
          <path d="${path}" fill="none" stroke="currentColor" stroke-width="2" />
          ${dots}
        </svg>
      </div>
    </div>
  `;
}

function generateStyles() {
  return `
    <style>
      .github-stats-preview {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: white;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .stats-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      
      .user-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: 0 auto 1rem;
        display: block;
        border: 3px solid #f3f4f6;
      }
      
      .username {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #1f2937;
      }
      
      .user-bio {
        color: #4b5563;
        margin-bottom: 0.5rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .user-location {
        color: #6b7280;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
      }
      
      .location-icon {
        width: 1rem;
        height: 1rem;
      }
      
      .stats-container {
        margin-top: 1.5rem;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .stats-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 2rem;
      }
      
      .stat-card {
        background: #f9fafb;
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .stats-list .stat-card {
        flex-direction: row;
        text-align: left;
        gap: 1rem;
        padding: 0.75rem 1rem;
      }
      
      .stat-icon {
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
      }
      
      .stats-list .stat-icon {
        margin-bottom: 0;
      }
      
      .stat-icon svg {
        width: 1.25rem;
        height: 1.25rem;
        stroke-width: 1.5;
      }
      
      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
      }
      
      .stats-list .stat-value {
        margin-right: auto;
      }
      
      .stat-label {
        font-size: 0.875rem;
        color: #6b7280;
      }
      
      .contribution-graph, .activity-graph {
        margin-top: 2rem;
      }
      
      .graph-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #1f2937;
      }
      
      .graph-grid {
        display: grid;
        grid-template-columns: repeat(52, 1fr);
        gap: 0.25rem;
      }
      
      .graph-cell {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 0.125rem;
        background: #ebedf0;
      }
      
      .graph-cell.intensity-1 { background: #9be9a8; }
      .graph-cell.intensity-2 { background: #40c463; }
      .graph-cell.intensity-3 { background: #30a14e; }
      .graph-cell.intensity-4 { background: #216e39; }
      
      .graph-legend {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.25rem;
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: #6b7280;
      }
      
      .legend-cell {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.125rem;
      }
      
      .legend-cell.intensity-0 { background: #ebedf0; }
      .legend-cell.intensity-1 { background: #9be9a8; }
      .legend-cell.intensity-2 { background: #40c463; }
      .legend-cell.intensity-3 { background: #30a14e; }
      .legend-cell.intensity-4 { background: #216e39; }
      
      .graph-container svg {
        display: block;
        margin: 0 auto;
      }
      
      /* Size variations */
      .size-small .user-avatar {
        width: 80px;
        height: 80px;
      }
      
      .size-small .username {
        font-size: 1.25rem;
      }
      
      .size-small .stat-card {
        padding: 0.75rem;
      }
      
      .size-small .stat-value {
        font-size: 1.25rem;
      }
      
      .size-large .user-avatar {
        width: 160px;
        height: 160px;
      }
      
      .size-large .username {
        font-size: 2rem;
      }
      
      .size-large .stat-card {
        padding: 1.5rem;
      }
      
      .size-large .stat-value {
        font-size: 2rem;
      }
      
      /* Theme variations */
      .theme-github {
        --primary-color: #24292e;
      }
      
      .theme-dracula {
        --primary-color: #282a36;
        background: #282a36;
        color: #f8f8f2;
      }
      
      .theme-dracula .stat-card {
        background: #44475a;
      }
      
      .theme-dracula .stat-value,
      .theme-dracula .username,
      .theme-dracula .graph-title {
        color: #f8f8f2;
      }
      
      .theme-dracula .stat-label,
      .theme-dracula .user-bio,
      .theme-dracula .user-location {
        color: #bd93f9;
      }
      
      .theme-dracula .graph-cell {
        background: #44475a;
      }
      
      .theme-dracula .graph-cell.intensity-1 { background: #6272a4; }
      .theme-dracula .graph-cell.intensity-2 { background: #50fa7b; }
      .theme-dracula .graph-cell.intensity-3 { background: #8be9fd; }
      .theme-dracula .graph-cell.intensity-4 { background: #ffb86c; }
      
      .theme-radical {
        --primary-color: #fe428e;
        background: #141321;
        color: #a9fef7;
      }
      
      .theme-radical .stat-card {
        background: #1e1e3f;
      }
      
      .theme-radical .stat-value {
        color: #f8d847;
      }
      
      .theme-radical .stat-label,
      .theme-radical .user-bio,
      .theme-radical .user-location {
        color: #a9fef7;
      }
      
      .theme-radical .graph-cell {
        background: #1e1e3f;
      }
      
      .theme-radical .graph-cell.intensity-1 { background: #6e40c9; }
      .theme-radical .graph-cell.intensity-2 { background: #fe428e; }
      .theme-radical .graph-cell.intensity-3 { background: #f8d847; }
      .theme-radical .graph-cell.intensity-4 { background: #a9fef7; }
      
      /* Layout variations */
      .layout-compact .stats-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      }
      
      .layout-compact .stat-card {
        padding: 0.5rem;
      }
      
      .layout-compact .stat-value {
        font-size: 1.25rem;
      }
      
      .layout-detailed .stat-card {
        padding: 1.5rem;
      }
      
      .layout-detailed .stat-value {
        font-size: 1.75rem;
      }
      
      .layout-detailed .stat-label {
        font-size: 1rem;
      }
    </style>
  `;
}

function copyStats() {
  const statsHTML = previewContent.innerHTML;
  const blob = new Blob([statsHTML], { type: 'text/html' });
  
  navigator.clipboard.write([
    new ClipboardItem({ 'text/html': blob })
  ]).then(() => {
    // Show success feedback
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg class="h-4 w-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      Copied!
    `;
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    showAlert('Failed to copy stats to clipboard');
  });
}

function exportStats() {
  // In a real app, this would use a library like html2canvas or dom-to-image
  showAlert('Export functionality would save as image or PDF in a real implementation');
}

function shareStats() {
  if (navigator.share) {
    navigator.share({
      title: `${userData.login}'s GitHub Stats`,
      text: `Check out ${userData.login}'s GitHub statistics`,
      url: window.location.href
    }).catch(err => {
      console.error('Error sharing:', err);
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    const twitterUrl = `https://twitter.com/intent/tweet?text=Check%20out%20${userData.login}'s%20GitHub%20stats&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, '_blank');
  }
}

function showHelp() {
  alert('GitHub Stats Generator Help:\n\n1. Enter a GitHub username\n2. Configure the display options\n3. Click "Generate Stats"\n4. Copy, export or share your stats card');
}

function showSettings() {
  alert('Settings would be displayed in a modal in a real implementation');
}

function showCustomize() {
  alert('Advanced customization options would be displayed here');
}

function switchTab(tabName) {
  // In a real app, this would switch between different views
  console.log(`Switched to ${tabName} tab`);
  showAlert(`Switched to ${tabName} view`);
}

function updateUTCTime() {
  const now = new Date();
  const utcTime = now.toISOString().replace('T', ' ').substring(0, 19);
  document.querySelector('.status-bar span').textContent = `UTC: ${utcTime}`;
}

function updateLastUpdated() {
  const now = new Date();
  const timeString = now.toLocaleString();
  document.querySelector('.preview-header span').textContent = `Last updated: ${timeString}`;
}

function showLoadingState() {
  previewContent.innerHTML = `
    <div class="animate-pulse">
      <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
      <div class="grid grid-cols-3 gap-4">
        <div class="h-20 bg-gray-200 rounded-lg"></div>
        <div class="h-20 bg-gray-200 rounded-lg"></div>
        <div class="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  `;
}

function showErrorState(error) {
  previewContent.innerHTML = `
    <div class="text-center py-8">
      <svg class="h-12 w-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Error fetching user data</h3>
      <p class="mt-1 text-sm text-gray-500">${error.message}</p>
      <button onclick="fetchUserData(usernameInput.value.trim())" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
        Try Again
      </button>
    </div>
  `;
}

function showAlert(message) {
  const alert = document.createElement('div');
  alert.className = 'fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-xs z-50 border-l-4 border-brand-500';
  alert.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm text-gray-700">${message}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}




// Make functions available globally for HTML onclick handlers
window.fetchUserData = fetchUserData;

