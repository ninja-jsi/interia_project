// Initialize Supabase Client
const supabaseUrl = 'https://qzdnysgstmacdtuzglmw.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG55c2dzdG1hY2R0dXpnbG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzk4NTUsImV4cCI6MjA1NjgxNTg1NX0.DeS3jOTdGclWoj7gYIcBXH0ysu4hy07TG1tSrwCt6iM';
let supabase;

try {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
}

// Track Visitor
async function trackVisitor() {
    try {
        // Get visitor information
        const visitorData = {
            ip_address: '', // Will be set by the server
            location: {}, // Will be set by the server
            browser: getBrowser(),
            os: getOS(),
            device: getDevice(),
            page: window.location.pathname
        };

        // Insert visitor data into the visits table
        const { error } = await supabase
            .from('visits')
            .insert([visitorData]);

        if (error) throw error;
        console.log('Visitor tracked successfully');
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

// Helper functions to get visitor information
function getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
}

function getOS() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
}

function getDevice() {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
        return 'Mobile';
    }
    if (/iPad|Android|Tablet/.test(userAgent)) {
        return 'Tablet';
    }
    return 'Desktop';
}

// DOM Elements
const sidebarToggle = document.querySelector('.header__toggle')
const sidebar = document.querySelector('.sidebar')
const header = document.querySelector('.header')
const main = document.querySelector('.main')
const navLinks = document.querySelectorAll('.nav__link')
const sections = document.querySelectorAll('.section')
const submissionTypeSelect = document.querySelector('#submission-type')
const emailSearch = document.querySelector('#email-search')
const taskForm = document.querySelector('.task-form')
const taskInput = document.querySelector('.task-input')
const taskLists = document.querySelectorAll('.task-list')
const overlay = document.querySelector('.overlay')

// State
let submissions = []
let analyticsData = {
    devices: {},
    browsers: {},
    os: {},
    locations: {}
}
let tasks = [
    { id: 1, title: 'Design Dashboard UI', status: 'todo' },
    { id: 2, title: 'Implement Charts', status: 'inProgress' },
    { id: 3, title: 'Add Drag and Drop', status: 'done' }
]

// Navigation Functions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Authentication Functions
function logout() {
    fetch('includes/logout.php')
        .then(() => {
            window.location.href = 'login';
        })
        .catch(error => {
            console.error('Logout error:', error);
            window.location.href = 'login';
        });
}

function checkAuth() {
    return fetch('includes/check-auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                window.location.href = 'login';
                return false;
            }
            // Update the user name in the header
            const userNameElement = document.querySelector('.header__user-name');
            if (userNameElement) {
                userNameElement.textContent = data.email;
            }
            return true;
        })
        .catch(() => {
            window.location.href = 'login';
            return false;
        });
}

// Mobile Menu Toggle
function toggleSidebar() {
    sidebar.classList.toggle('show');
    sidebar.classList.toggle('hide');
    overlay.classList.toggle('show');
    document.body.classList.toggle('no-scroll');
}

// Close sidebar when clicking overlay
overlay.addEventListener('click', () => {
    if (sidebar.classList.contains('show')) {
        toggleSidebar();
    }
});

// Initialize Dashboard
async function initDashboard() {
    try {
        // Check authentication first
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) return;
        
        // Initialize navigation
        initNavigation();
        
        // Add sidebar toggle event listener
        sidebarToggle.addEventListener('click', toggleSidebar);
        
        // Show Overview section by default
        showSection('overview');
        
        // Track visitor
        await trackVisitor();
        
        // Load all data
        await Promise.all([
            loadOverviewData(),
            loadAnalyticsData(),
            loadRecentVisitors(),
            renderTasks()
        ]);
        
        // Initialize charts
        await initCharts();
        
        // Setup filters
        setupFilters();

        // Add logout button event listener
        const logoutButton = document.querySelector('.btn-outline-danger');
        if (logoutButton) {
            logoutButton.addEventListener('click', logout);
        }
        
        // Set up periodic auth check
        setInterval(checkAuth, 300000); // Check every 5 minutes
        
        console.log('Dashboard initialization completed');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to initialize dashboard. Please try again later.');
    }
}

// Call initDashboard when the page loads
document.addEventListener('DOMContentLoaded', initDashboard);

// Counter Animation Function
function animateCounter(element, targetValue, duration = 2000) {
    const startValue = 0;
    const increment = targetValue / (duration / 16); // 60fps
    let currentValue = startValue;
    const elementRef = element;

    const updateCounter = () => {
        currentValue += increment;
        if (currentValue < targetValue) {
            elementRef.textContent = Math.floor(currentValue);
            requestAnimationFrame(updateCounter);
        } else {
            elementRef.textContent = targetValue;
        }
    };

    updateCounter();
}

// Load Overview Data
async function loadOverviewData() {
    try {
        console.log('Loading overview data...');
        
        // Get total visitors count
        const { count: totalVisitors, error: visitorsError } = await supabase
            .from('visits')
            .select('*', { count: 'exact', head: true });
            
        if (visitorsError) throw visitorsError;
        
        // Get total form submissions count
        const { count: totalForms, error: formsError } = await supabase
            .from('user_quotes')
            .select('*', { count: 'exact', head: true });
            
        if (formsError) throw formsError;
        
        // Get total survey responses count
        const { count: totalSurveys, error: surveysError } = await supabase
            .from('survey_responses')
            .select('*', { count: 'exact', head: true });
            
        if (surveysError) throw surveysError;

        // Animate the counters
        animateCounter(document.getElementById('total-visitors'), totalVisitors || 0);
        animateCounter(document.getElementById('forms-submitted'), totalForms || 0);
        animateCounter(document.getElementById('surveys-completed'), totalSurveys || 0);

        console.log('Overview data loaded:', {
            totalVisitors,
            totalForms,
            totalSurveys
        });

        return {
            totalVisitors,
            totalForms,
            totalSurveys
        };
    } catch (error) {
        console.error('Error loading overview data:', error);
        showNotification('Failed to load overview data', 'error');
        return {
            totalVisitors: 0,
            totalForms: 0,
            totalSurveys: 0
        };
    }
}

// Load Analytics Data
async function loadAnalyticsData() {
    try {
        console.log('Loading analytics data...');
        
        // Get device distribution
        const { data: devices, error: devicesError } = await supabase
            .from('visits')
            .select('device')
            .not('device', 'is', null);
            
        if (devicesError) throw devicesError;
        
        // Get browser distribution
        const { data: browsers, error: browsersError } = await supabase
            .from('visits')
            .select('browser')
            .not('browser', 'is', null);
            
        if (browsersError) throw browsersError;
        
        // Get OS distribution
        const { data: os, error: osError } = await supabase
            .from('visits')
            .select('os')
            .not('os', 'is', null);
            
        if (osError) throw osError;
        
        // Get visitor locations
        const { data: locations, error: locationsError } = await supabase
            .from('visits')
            .select('location')
            .not('location', 'is', null);
            
        if (locationsError) throw locationsError;

        // Process device data
        const deviceCounts = devices.reduce((acc, curr) => {
            acc[curr.device] = (acc[curr.device] || 0) + 1;
            return acc;
        }, {});

        // Process browser data
        const browserCounts = browsers.reduce((acc, curr) => {
            acc[curr.browser] = (acc[curr.browser] || 0) + 1;
            return acc;
        }, {});

        // Process OS data
        const osCounts = os.reduce((acc, curr) => {
            acc[curr.os] = (acc[curr.os] || 0) + 1;
            return acc;
        }, {});

        // Process location data
        const locationCounts = locations.reduce((acc, curr) => {
            try {
                // Parse the location JSON if it's a string
                const locationData = typeof curr.location === 'string' 
                    ? JSON.parse(curr.location) 
                    : curr.location;
                
                // Extract region from the location data
                if (locationData && locationData.region) {
                    const region = locationData.region;
                    acc[region] = (acc[region] || 0) + 1;
                }
            } catch (e) {
                console.error('Error processing location data:', e);
            }
            return acc;
        }, {});

        analyticsData = {
            devices: deviceCounts,
            browsers: browserCounts,
            os: osCounts,
            locations: locationCounts
        };

        console.log('Analytics data loaded:', analyticsData);
        return analyticsData;
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showNotification('Failed to load analytics data', 'error');
        return { devices: {}, browsers: {}, os: {}, locations: {} };
    }
}

// Load Submissions
async function loadSubmissions() {
    try {
        console.log('Loading submissions...');
        
        // Get form submissions from user_quotes table
        const formResult = await supabase
            .from('user_quotes')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (formResult.error) throw formResult.error;
        const formSubmissions = formResult.data || [];

        // Get survey submissions from survey_responses table
        const surveyResult = await supabase
            .from('survey_responses')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (surveyResult.error) throw surveyResult.error;
        const surveySubmissions = surveyResult.data || [];

        submissions = [
            ...formSubmissions.map(f => ({ 
                ...f, 
                type: 'form',
                displayData: {
                    'Name': f.name,
                    'Mobile': f.mobile,
                    'Service': f.service,
                    'Message': f.message
                }
            })),
            ...surveySubmissions.map(s => ({ 
                ...s, 
                type: 'survey',
                displayData: {
                    'Property Details': s.property_details,
                    'Home Configuration': s.home_configuration,
                    'Home Size': s.home_size,
                    'Scope of Work': s.scope_of_work,
                    'Custom Modules': s.custom_modules,
                    'Budget': s.budget,
                    'Package': s.package
                }
            }))
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        console.log('Submissions loaded:', submissions.length);
        renderSubmissions();
        return submissions;
    } catch (error) {
        console.error('Error loading submissions:', error);
        showNotification('Failed to load submissions', 'error');
        return [];
    }
}

// Render Submissions
function renderSubmissions() {
    const submissionsList = document.getElementById('submissions-list')
    const type = submissionTypeSelect.value
    const searchTerm = emailSearch.value.toLowerCase()

    const filteredSubmissions = submissions.filter(sub => {
        const typeMatch = type === 'all' || sub.type === type
        const emailMatch = sub.email.toLowerCase().includes(searchTerm)
        return typeMatch && emailMatch
    })

    submissionsList.innerHTML = filteredSubmissions.map(sub => `
        <div class="submission-card ${sub.type}">
            <div class="submission-header">
                <span class="submission-type">${sub.type === 'form' ? 'Quote Request' : 'Survey Response'}</span>
                <span class="submission-date">${new Date(sub.created_at).toLocaleString()}</span>
            </div>
            <div class="submission-body">
                <div class="submission-email">
                    <i class='bx bx-envelope'></i> ${sub.email}
                    ${sub.type === 'form' ? `
                        <span class="submission-mobile">
                            <i class='bx bx-phone'></i> ${sub.mobile}
                        </span>
                    ` : ''}
                </div>
                <div class="submission-details">
                    ${Object.entries(sub.displayData).map(([key, value]) => `
                        <div class="submission-field">
                            <strong>${key}:</strong> ${value || 'N/A'}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('')

    if (filteredSubmissions.length === 0) {
        submissionsList.innerHTML = `
            <div class="no-submissions">
                <i class='bx bx-search-alt'></i>
                <p>No submissions found</p>
            </div>
        `
    }
}

// Load Submission Trends Data
async function loadSubmissionTrends() {
    try {
        // Get form submissions by date
        const { data: formSubmissions, error: formError } = await supabase
            .from('user_quotes')
            .select('created_at')
            .order('created_at', { ascending: true });
            
        if (formError) throw formError;
        
        // Get survey submissions by date
        const { data: surveySubmissions, error: surveyError } = await supabase
            .from('survey_responses')
            .select('created_at')
            .order('created_at', { ascending: true });
            
        if (surveyError) throw surveyError;

        // Process the data for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const formCounts = last7Days.map(date => {
            return formSubmissions.filter(sub => 
                sub.created_at.startsWith(date)
            ).length;
        });

        const surveyCounts = last7Days.map(date => {
            return surveySubmissions.filter(sub => 
                sub.created_at.startsWith(date)
            ).length;
        });

        return {
            labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
            formData: formCounts,
            surveyData: surveyCounts
        };
    } catch (error) {
        console.error('Error loading submission trends:', error);
        return {
            labels: [],
            formData: [],
            surveyData: []
        };
    }
}

// Load Daily Activity Data
async function loadDailyActivity() {
    try {
        // Get all submissions (forms and surveys) for today
        const today = new Date().toISOString().split('T')[0];
        
        const { data: formSubmissions, error: formError } = await supabase
            .from('user_quotes')
            .select('created_at')
            .gte('created_at', today)
            .lt('created_at', new Date(new Date(today).getTime() + 86400000).toISOString());
            
        if (formError) throw formError;
        
        const { data: surveySubmissions, error: surveyError } = await supabase
            .from('survey_responses')
            .select('created_at')
            .gte('created_at', today)
            .lt('created_at', new Date(new Date(today).getTime() + 86400000).toISOString());
            
        if (surveyError) throw surveyError;

        // Process the data for each hour
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const formCounts = hours.map(hour => {
            return formSubmissions.filter(sub => {
                const submissionHour = new Date(sub.created_at).getHours();
                return submissionHour === hour;
            }).length;
        });

        const surveyCounts = hours.map(hour => {
            return surveySubmissions.filter(sub => {
                const submissionHour = new Date(sub.created_at).getHours();
                return submissionHour === hour;
            }).length;
        });

        return {
            labels: hours.map(hour => `${hour}:00`),
            formData: formCounts,
            surveyData: surveyCounts
        };
    } catch (error) {
        console.error('Error loading daily activity:', error);
        return {
            labels: [],
            formData: [],
            surveyData: []
        };
    }
}

// Initialize Charts
async function initCharts() {
    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    try {
        // Load and initialize Submission Trends Chart
        const submissionTrendsData = await loadSubmissionTrends();
        const submissionTrendsCtx = document.getElementById('submissionTrendsChart');
        if (submissionTrendsCtx) {
            new Chart(submissionTrendsCtx, {
                type: 'line',
                data: {
                    labels: submissionTrendsData.labels,
                    datasets: [
                        {
                            label: 'Form Submissions',
                            data: submissionTrendsData.formData,
                            borderColor: 'rgb(67, 97, 238)',
                            backgroundColor: 'rgba(67, 97, 238, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Survey Submissions',
                            data: submissionTrendsData.surveyData,
                            borderColor: 'rgb(247, 37, 133)',
                            backgroundColor: 'rgba(247, 37, 133, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Submission Trends (Last 7 Days)',
                            font: {
                                size: 16
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        // Load and initialize Daily Activity Chart
        const dailyActivityData = await loadDailyActivity();
        const dailyActivityCtx = document.getElementById('dailyActivityChart');
        if (dailyActivityCtx) {
            new Chart(dailyActivityCtx, {
                type: 'bar',
                data: {
                    labels: dailyActivityData.labels,
                    datasets: [
                        {
                            label: 'Form Submissions',
                            data: dailyActivityData.formData,
                            backgroundColor: 'rgba(67, 97, 238, 0.8)',
                            borderColor: 'rgb(67, 97, 238)',
                            borderWidth: 1
                        },
                        {
                            label: 'Survey Submissions',
                            data: dailyActivityData.surveyData,
                            backgroundColor: 'rgba(247, 37, 133, 0.8)',
                            borderColor: 'rgb(247, 37, 133)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Daily Activity (Today)',
                            font: {
                                size: 16
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        // Initialize other charts (device, browser, OS, location)
        const deviceCtx = document.getElementById('deviceChart');
        if (deviceCtx) {
            new Chart(deviceCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(analyticsData.devices),
                    datasets: [{
                        data: Object.values(analyticsData.devices),
                        backgroundColor: [
                            'rgb(67, 97, 238)',
                            'rgb(247, 37, 133)',
                            'rgb(76, 201, 240)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Device Distribution',
                            font: {
                                size: 16
                            }
                        }
                    }
                }
            });
        }

        const browserCtx = document.getElementById('browserChart');
        if (browserCtx) {
            new Chart(browserCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(analyticsData.browsers),
                    datasets: [{
                        data: Object.values(analyticsData.browsers),
                        backgroundColor: [
                            'rgb(67, 97, 238)',
                            'rgb(247, 37, 133)',
                            'rgb(76, 201, 240)',
                            'rgb(63, 55, 201)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Browser Usage',
                            font: {
                                size: 16
                            }
                        }
                    }
                }
            });
        }

        const osCtx = document.getElementById('osChart');
        if (osCtx) {
            new Chart(osCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(analyticsData.os),
                    datasets: [{
                        data: Object.values(analyticsData.os),
                        backgroundColor: [
                            'rgb(67, 97, 238)',
                            'rgb(247, 37, 133)',
                            'rgb(76, 201, 240)',
                            'rgb(63, 55, 201)',
                            'rgb(255, 193, 7)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Operating Systems',
                            font: {
                                size: 16
                            }
                        }
                    }
                }
            });
        }

        const locationCtx = document.getElementById('locationChart');
        if (locationCtx) {
            new Chart(locationCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(analyticsData.locations),
                    datasets: [{
                        data: Object.values(analyticsData.locations),
                        backgroundColor: [
                            'rgb(67, 97, 238)',
                            'rgb(247, 37, 133)',
                            'rgb(76, 201, 240)',
                            'rgb(63, 55, 201)',
                            'rgb(255, 193, 7)',
                            'rgb(40, 167, 69)',
                            'rgb(220, 53, 69)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Visitor Locations',
                            font: {
                                size: 16
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
        showNotification('Failed to initialize charts', 'error');
    }
}

// Load Recent Visitors
async function loadRecentVisitors() {
    try {
        const { data: visitors, error } = await supabase
            .from('visits')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(10);

        if (error) throw error;

        const visitorsList = document.getElementById('visitors-list');
        if (visitorsList) {
            visitorsList.innerHTML = visitors.map(visitor => `
                <div class="visitor-card">
                    <div class="visitor-info">
                        <span class="visitor-time">${new Date(visitor.timestamp).toLocaleString()}</span>
                        <span class="visitor-device">${visitor.device}</span>
                        <button class="delete-visitor" onclick="deleteVisitor('${visitor.id}')">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                    <div class="visitor-details">
                        <span class="visitor-browser">${visitor.browser}</span>
                        <span class="visitor-os">${visitor.os}</span>
                    </div>
                </div>
            `).join('');

            if (visitors.length === 0) {
                visitorsList.innerHTML = '<div class="no-data">No recent visitors</div>';
            }
        }
    } catch (error) {
        console.error('Error loading recent visitors:', error);
        const visitorsList = document.getElementById('visitors-list');
        if (visitorsList) {
            visitorsList.innerHTML = '<div class="no-data">Error loading visitors</div>';
        }
    }
}

// Delete visitor function
async function deleteVisitor(visitorId) {
    if (!confirm('Are you sure you want to delete this visitor record?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('visits')
            .delete()
            .eq('id', visitorId);

        if (error) throw error;

        // Reload the visitors list
        await loadRecentVisitors();
        showNotification('Visitor record deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting visitor:', error);
        showNotification('Failed to delete visitor record', 'error');
    }
}

// Initialize Kanban Board
async function initKanbanBoard() {
    try {
        console.log('Initializing Kanban board...');
        await renderTasks();
        
        // Add event listeners for filters
        const taskSearch = document.getElementById('taskSearch');
        const taskTypeFilter = document.getElementById('taskTypeFilter');
        const taskStatusFilter = document.getElementById('taskStatusFilter');

        if (taskSearch) taskSearch.addEventListener('input', filterTasks);
        if (taskTypeFilter) taskTypeFilter.addEventListener('change', filterTasks);
        if (taskStatusFilter) taskStatusFilter.addEventListener('change', filterTasks);
        
        console.log('Kanban board initialized');
    } catch (error) {
        console.error('Error initializing Kanban board:', error);
        showNotification('Error loading Kanban board', 'error');
    }
}

async function renderTasks() {
    try {
        // Fetch both form submissions and survey responses
        const { data: formData, error: formError } = await supabase
            .from('user_quotes')
            .select('*')
            .order('created_at', { ascending: false });

        const { data: surveyData, error: surveyError } = await supabase
            .from('survey_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (formError) throw formError;
        if (surveyError) throw surveyError;

        // Clear all task lists
        document.querySelectorAll('.task-list').forEach(list => {
            list.innerHTML = '';
        });

        // Process form submissions
        const tasks = [];
        if (formData) {
            formData.forEach(form => {
                tasks.push({
                    id: `form-${form.id}`,
                    type: 'Form',
                    name: form.name,
                    email: form.email,
                    phone: form.mobile,
                    service: form.service,
                    message: form.message,
                    date: new Date(form.created_at),
                    status: form.status || 'todo'
                });
            });
        }

        // Process survey responses
        if (surveyData) {
            surveyData.forEach(survey => {
                tasks.push({
                    id: `survey-${survey.id}`,
                    type: 'Survey',
                    email: survey.email,
                    property_details: survey.property_details,
                    home_configuration: survey.home_configuration,
                    home_size: survey.home_size,
                    scope_of_work: survey.scope_of_work,
                    custom_modules: survey.custom_modules,
                    budget: survey.budget,
                    package: survey.package,
                    date: new Date(survey.created_at),
                    status: survey.status || 'todo'
                });
            });
        }

        // Sort tasks by date
        tasks.sort((a, b) => b.date - a.date);

        // Render tasks in their respective columns
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            appendTaskToList(taskElement, task.status);
        });

        // Show "No tasks" message if a column is empty
        document.querySelectorAll('.task-list').forEach(list => {
            if (!list.children.length) {
                const noTasksMessage = document.createElement('div');
                noTasksMessage.className = 'no-tasks';
                noTasksMessage.textContent = 'No tasks yet';
                list.appendChild(noTasksMessage);
            }
        });

        // Initialize drag and drop
        initDragAndDrop();

    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;
    taskElement.dataset.status = task.status;

    if (task.type === 'Form') {
        taskElement.innerHTML = `
            <div class="task-header">
                <span class="task-type">📝 Form</span>
                <span class="task-date">${new Date(task.date).toLocaleString()}</span>
            </div>
            <div class="task-content">
                <div class="task-field"><strong>ID:</strong> ${task.id.split('-')[1]}</div>
                <div class="task-field"><strong>Name:</strong> ${task.name || 'N/A'}</div>
                <div class="task-field"><strong>Email:</strong> ${task.email || 'N/A'}</div>
                <div class="task-field"><strong>Mobile:</strong> ${task.phone || 'N/A'}</div>
                <div class="task-field"><strong>Service:</strong> ${task.service || 'N/A'}</div>
                <div class="task-field"><strong>Message:</strong> ${task.message || 'N/A'}</div>
                <div class="task-field"><strong>Created:</strong> ${new Date(task.date).toLocaleString()}</div>
                <div class="task-field"><strong>Status:</strong> ${task.status || 'N/A'}</div>
            </div>
            <button class="delete-task" onclick="deleteTask('${task.id}')">×</button>
        `;
    } else {
        taskElement.innerHTML = `
            <div class="task-header">
                <span class="task-type">📊 Survey</span>
                <span class="task-date">${new Date(task.date).toLocaleString()}</span>
            </div>
            <div class="task-content">
                <div class="task-field"><strong>ID:</strong> ${task.id.split('-')[1]}</div>
                <div class="task-field"><strong>Email:</strong> ${task.email || 'N/A'}</div>
                <div class="task-field"><strong>Property Details:</strong> ${task.property_details || 'N/A'}</div>
                <div class="task-field"><strong>Home Configuration:</strong> ${task.home_configuration || 'N/A'}</div>
                <div class="task-field"><strong>Home Size:</strong> ${task.home_size || 'N/A'}</div>
                <div class="task-field"><strong>Scope of Work:</strong> ${task.scope_of_work || 'N/A'}</div>
                <div class="task-field"><strong>Custom Modules:</strong> ${task.custom_modules || 'N/A'}</div>
                <div class="task-field"><strong>Budget:</strong> ${task.budget || 'N/A'}</div>
                <div class="task-field"><strong>Package:</strong> ${task.package || 'N/A'}</div>
                <div class="task-field"><strong>Created:</strong> ${new Date(task.date).toLocaleString()}</div>
                <div class="task-field"><strong>Status:</strong> ${task.status || 'N/A'}</div>
            </div>
            <button class="delete-task" onclick="deleteTask('${task.id}')">×</button>
        `;
    }

    return taskElement;
}

function appendTaskToList(taskElement, status) {
    const column = document.querySelector(`[data-status="${status}"] .task-list`);
    if (column) {
        // Remove "No tasks" message if it exists
        const noTasksMessage = column.querySelector('.no-tasks');
        if (noTasksMessage) {
            noTasksMessage.remove();
        }
        column.appendChild(taskElement);
    }
}

function initDragAndDrop() {
    const taskItems = document.querySelectorAll('.task-item');
    const taskLists = document.querySelectorAll('.task-list');

    taskItems.forEach(task => {
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
    });

    taskLists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

async function handleDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    const newStatus = e.currentTarget.closest('.kanban-column').dataset.status;

    if (taskElement && newStatus) {
        const [type, id] = taskId.split('-');
        const table = type === 'form' ? 'user_quotes' : 'survey_responses';

        try {
            const { error } = await supabase
                .from(table)
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            appendTaskToList(taskElement, newStatus);
            taskElement.dataset.status = newStatus;
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }

    e.currentTarget.classList.remove('drag-over');
}

async function deleteTask(taskId) {
    try {
        // Show confirmation dialog
        const confirmed = confirm('Are you sure you want to delete this task? This action cannot be undone.');
        
        if (!confirmed) {
            return; // Exit if user cancels
        }

        // Split the taskId to get type and id
        const [type, id] = taskId.split('-');
        const table = type === 'form' ? 'user_quotes' : 'survey_responses';

        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Remove task from UI
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
            
            // Add "No tasks" message if the list is empty
            const taskList = taskElement.closest('.task-list');
            if (taskList && !taskList.children.length) {
                const noTasksMessage = document.createElement('div');
                noTasksMessage.className = 'no-tasks';
                noTasksMessage.textContent = 'No tasks yet';
                taskList.appendChild(noTasksMessage);
            }
        }

        showNotification('Task deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// Filter and Search Functions
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');

    searchInput.addEventListener('input', filterTasks);
    typeFilter.addEventListener('change', filterTasks);
}

function filterTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    
    document.querySelectorAll('.task-item').forEach(task => {
        // Search in all task fields for the search term
        const taskContent = task.querySelector('.task-content').textContent.toLowerCase();
        const matchesSearch = searchTerm === '' || taskContent.includes(searchTerm);
        
        // Get the task type from the header
        const typeElement = task.querySelector('.task-type');
        const type = typeElement ? typeElement.textContent.toLowerCase() : '';
        
        // Check type filter
        const matchesType = typeFilter === 'all' || 
            (typeFilter === 'form' && type.includes('form')) || 
            (typeFilter === 'survey' && type.includes('survey'));
        
        // Show/hide based on both conditions independently
        task.style.display = (matchesSearch && matchesType) ? 'block' : 'none';
    });

    // Update "No tasks" messages for each column
    document.querySelectorAll('.kanban-column').forEach(column => {
        const taskList = column.querySelector('.task-list');
        const visibleTasks = taskList.querySelectorAll('.task-item[style="display: block"]').length;
        let noTasksMessage = taskList.querySelector('.no-tasks');
        
        if (visibleTasks === 0) {
            if (!noTasksMessage) {
                noTasksMessage = document.createElement('div');
                noTasksMessage.className = 'no-tasks';
                noTasksMessage.textContent = 'No tasks found';
                taskList.appendChild(noTasksMessage);
            }
        } else if (noTasksMessage) {
            noTasksMessage.remove();
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initDashboard)

sidebarToggle.addEventListener('click', toggleSidebar)

taskForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = taskInput.value.trim()
    
    if (title) {
        const newTask = {
            id: tasks.length + 1,
            title: title,
            status: 'todo'
        }
        
        tasks.push(newTask)
        renderTasks()
        taskInput.value = ''
    }
})

submissionTypeSelect?.addEventListener('change', renderSubmissions)
emailSearch?.addEventListener('input', renderSubmissions)

// Helper Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification--${type}`
    notification.textContent = message

    document.body.appendChild(notification)
    setTimeout(() => {
        notification.remove()
    }, 3000)
}

// Helper function to show errors
function showError(message) {
    console.error(message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.kanban-board').prepend(errorDiv);
}

// Add event listener for logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
}); 