/**
 * Admin Dashboard - Blockchain-Based Transparent Charity Donation Tracking System
 * Author: Blockchain Charity System
 * Description: This file handles all admin dashboard functionalities including
 * donation management, user management, transaction monitoring, and analytics
 */

// =============================================
// Global Variables and Configuration
// =============================================

const API_BASE_URL = '/api';
const CHART_COLORS = {
    primary: '#0066cc',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
};

let adminUser = null;
let donationData = [];
let userStats = {};
let transactionHistory = [];
let charityOrganizations = [];

// =============================================
// Initialization Functions
// =============================================

/**
 * Initialize the admin dashboard
 */
function initAdminDashboard() {
    console.log('Initializing Admin Dashboard...');
    
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        redirectToLogin();
        return;
    }
    
    // Load admin user data
    loadAdminUser();
    
    // Load dashboard data
    loadDashboardData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize charts
    initializeCharts();
    
    console.log('Admin Dashboard initialized successfully');
}

/**
 * Load admin user information
 */
function loadAdminUser() {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
        adminUser = JSON.parse(userData);
        updateAdminUserDisplay();
    }
}

/**
 * Load all dashboard data
 */
function loadDashboardData() {
    loadDonationStats();
    loadUserStats();
    loadTransactionHistory();
    loadCharityOrganizations();
}

// =============================================
// Data Loading Functions
// =============================================

/**
 * Load donation statistics
 */
function loadDonationStats() {
    console.log('Loading donation statistics...');
    
    // Base simulated data
    let baseData = [
        {
            id: 1,
            donorName: 'John Doe',
            amount: 500,
            date: new Date('2026-02-28'),
            organization: 'Water For All',
            status: 'completed',
            transactionHash: '0x1a2b3c4d5e6f7g8h9i0j',
            category: 'Healthcare'
        },
        {
            id: 2,
            donorName: 'Jane Smith',
            amount: 1000,
            date: new Date('2026-02-27'),
            organization: 'Education Foundation',
            status: 'completed',
            transactionHash: '0x9i8h7g6f5e4d3c2b1a0j',
            category: 'Education'
        },
        {
            id: 3,
            donorName: 'Robert Johnson',
            amount: 250,
            date: new Date('2026-02-26'),
            organization: 'Food Bank',
            status: 'pending',
            transactionHash: '0x5e4d3c2b1a0j9i8h7g6f',
            category: 'Food & Nutrition'
        },
        {
            id: 4,
            donorName: 'Emily Davis',
            amount: 750,
            date: new Date('2026-02-25'),
            organization: 'Emergency Relief',
            status: 'completed',
            transactionHash: '0x2b1a0j9i8h7g6f5e4d3c',
            category: 'Emergency'
        },
        {
            id: 5,
            donorName: 'Michael Brown',
            amount: 1500,
            date: new Date('2026-02-24'),
            organization: 'Children\'s Care',
            status: 'completed',
            transactionHash: '0x8h7g6f5e4d3c2b1a0j9i',
            category: 'Children'
        }
    ];
    
    // Load real donations from localStorage
    try {
        const realDonations = localStorage.getItem('donations')
            ? JSON.parse(localStorage.getItem('donations'))
            : [];
        
        if (realDonations.length > 0) {
            const startId = baseData.length + 1;
            const categoryMap = {
                'Emergency Relief Fund': 'Emergency',
                'Education Program': 'Education',
                'Healthcare Initiative': 'Healthcare',
                'Environmental Protection': 'Environment',
                'Community Development': 'Community'
            };
            
            realDonations.forEach((d, idx) => {
                baseData.push({
                    id: startId + idx,
                    donorName: d.donor,
                    amount: d.amount,
                    date: new Date(d.date),
                    organization: d.charity,
                    status: 'completed',
                    transactionHash: '0x' + Math.random().toString(16).slice(2, 18),
                    category: categoryMap[d.campaign] || 'General'
                });
            });
        }
    } catch (e) {
        console.error('Failed to load donations from localStorage', e);
    }
    
    donationData = baseData.sort((a, b) => b.date - a.date);
    updateDonationDisplay();
}

/**
 * Update donation display in the table
 */
function updateDonationDisplay() {
    const tbody = document.querySelector('#donationTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (donationData.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="8" style="text-align:center;color:#666;">No donation records found</td>';
        tbody.appendChild(row);
        return;
    }
    
    donationData.forEach(donation => {
        const row = document.createElement('tr');
        const dateStr = donation.date.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
        const statusClass = donation.status === 'completed' ? 'badge-success' : 
                           donation.status === 'pending' ? 'badge-warning' : 'badge-danger';
        
        row.innerHTML = `
            <td>#DON-2026-${5000 + donation.id}</td>
            <td>${donation.donorName}</td>
            <td>${donation.organization}</td>
            <td>₹${donation.amount.toLocaleString()}</td>
            <td>${dateStr}</td>
            <td><span class="${statusClass}">${donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}</span></td>
            <td><code>${donation.transactionHash}</code></td>
            <td><button class="btn btn-info btn-sm">Details</button></td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Load user statistics
 */
function loadUserStats() {
    console.log('Loading user statistics...');
    
    userStats = {
        totalUsers: 1245,
        activeUsers: 892,
        newUsersThisMonth: 156,
        totalVerifiedDonors: 745,
        suspiciousAccounts: 12,
        blockedUsers: 8
    };
    
    updateUserStatsDisplay();
}

/**
 * Load transaction history
 */
function loadTransactionHistory() {
    console.log('Loading transaction history...');
    
    transactionHistory = donationData.map(donation => ({
        ...donation,
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 50000),
        timestamp: donation.date.getTime(),
        confirmation: donation.status === 'completed' ? Math.floor(Math.random() * 10) + 20 : 0
    }));
    
    updateTransactionDisplay();
}

/**
 * Load charity organizations
 */
function loadCharityOrganizations() {
    console.log('Loading charity organizations...');
    
    charityOrganizations = [
        {
            id: 1,
            name: 'Water For All',
            category: 'Healthcare',
            totalDonations: 45000,
            donorCount: 234,
            verificationStatus: 'verified',
            walletAddress: '0xAbc123...789Def'
        },
        {
            id: 2,
            name: 'Education Foundation',
            category: 'Education',
            totalDonations: 78500,
            donorCount: 456,
            verificationStatus: 'verified',
            walletAddress: '0xDef456...012Ghi'
        },
        {
            id: 3,
            name: 'Food Bank',
            category: 'Food & Nutrition',
            totalDonations: 23000,
            donorCount: 189,
            verificationStatus: 'pending',
            walletAddress: '0xGhi789...345Jkl'
        },
        {
            id: 4,
            name: 'Emergency Relief',
            category: 'Emergency',
            totalDonations: 156000,
            donorCount: 678,
            verificationStatus: 'verified',
            walletAddress: '0xJkl012...678Mno'
        },
        {
            id: 5,
            name: 'Children\'s Care',
            category: 'Children',
            totalDonations: 89000,
            donorCount: 432,
            verificationStatus: 'verified',
            walletAddress: '0xMno345...901Pqr'
        }
    ];
    
    updateCharityOrganizationsDisplay();
}

// =============================================
// Display Update Functions
// =============================================

/**
 * Update admin user display
 */
function updateAdminUserDisplay() {
    if (adminUser) {
        const adminNameEl = document.getElementById('adminName');
        const adminEmailEl = document.getElementById('adminEmail');
        const adminAvatarEl = document.getElementById('adminAvatar');
        
        if (adminNameEl) adminNameEl.textContent = adminUser.name || 'Admin';
        if (adminEmailEl) adminEmailEl.textContent = adminUser.email || 'admin@charity.com';
        if (adminAvatarEl) adminAvatarEl.textContent = (adminUser.name || 'A').charAt(0).toUpperCase();
    }
}

/**
 * Update donation display in dashboard
 */
function updateDonationDisplay() {
    const donationTableBody = document.getElementById('donationTableBody');
    
    if (donationTableBody) {
        donationTableBody.innerHTML = '';
        
        donationData.forEach(donation => {
            const row = createDonationRow(donation);
            donationTableBody.appendChild(row);
        });
    }
    
    updateDonationMetrics();
}

/**
 * Create a donation table row
 */
function createDonationRow(donation) {
    const row = document.createElement('tr');
    const statusBadge = getStatusBadge(donation.status);
    
    row.innerHTML = `
        <td>${donation.id}</td>
        <td>${donation.donorName}</td>
        <td>$${donation.amount.toFixed(2)}</td>
        <td>${donation.organization}</td>
        <td>${donation.date.toLocaleDateString()}</td>
        <td>${statusBadge}</td>
        <td>
            <button class="btn btn-sm btn-info" onclick="viewTransactionDetails('${donation.transactionHash}')">
                View
            </button>
            <button class="btn btn-sm btn-warning" onclick="editDonation(${donation.id})">
                Edit
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
    const badges = {
        'completed': '<span class="badge badge-success">Completed</span>',
        'pending': '<span class="badge badge-warning">Pending</span>',
        'failed': '<span class="badge badge-danger">Failed</span>',
        'processing': '<span class="badge badge-info">Processing</span>'
    };
    
    return badges[status] || '<span class="badge badge-secondary">Unknown</span>';
}

/**
 * Update user statistics display
 */
function updateUserStatsDisplay() {
    const statsElements = {
        'totalUsers': 'totalUsersEl',
        'activeUsers': 'activeUsersEl',
        'newUsersThisMonth': 'newUsersEl',
        'totalVerifiedDonors': 'verifiedDonorsEl',
        'suspiciousAccounts': 'suspiciousAccountsEl',
        'blockedUsers': 'blockedUsersEl'
    };
    
    Object.keys(statsElements).forEach(key => {
        const element = document.getElementById(statsElements[key]);
        if (element) {
            element.textContent = userStats[key];
        }
    });
}

/**
 * Update transaction display
 */
function updateTransactionDisplay() {
    const transactionTableBody = document.getElementById('transactionTableBody');
    
    if (transactionTableBody) {
        transactionTableBody.innerHTML = '';
        
        transactionHistory.slice(0, 10).forEach(transaction => {
            const row = createTransactionRow(transaction);
            transactionTableBody.appendChild(row);
        });
    }
}

/**
 * Create transaction table row
 */
function createTransactionRow(transaction) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.transactionHash.substring(0, 10)}...</td>
        <td>$${transaction.amount.toFixed(2)}</td>
        <td>${transaction.blockNumber}</td>
        <td>${transaction.confirmation}</td>
        <td>${transaction.date.toLocaleDateString()}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="viewBlockchainDetails('${transaction.transactionHash}')">
                Details
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Update charity organizations display
 */
function updateCharityOrganizationsDisplay() {
    const orgTableBody = document.getElementById('charityOrgTableBody');
    
    if (orgTableBody) {
        orgTableBody.innerHTML = '';
        
        charityOrganizations.forEach(org => {
            const row = createOrganizationRow(org);
            orgTableBody.appendChild(row);
        });
    }
}

/**
 * Create organization table row
 */
function createOrganizationRow(org) {
    const row = document.createElement('tr');
    const verificationBadge = getVerificationBadge(org.verificationStatus);
    
    row.innerHTML = `
        <td>${org.id}</td>
        <td><strong>${org.name}</strong></td>
        <td>${org.category}</td>
        <td>$${org.totalDonations.toFixed(2)}</td>
        <td>${org.donorCount}</td>
        <td>${verificationBadge}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="viewOrganizationDetails(${org.id})">
                View
            </button>
            <button class="btn btn-sm btn-warning" onclick="editOrganization(${org.id})">
                Edit
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Get verification badge HTML
 */
function getVerificationBadge(status) {
    const badges = {
        'verified': '<span class="badge badge-success">Verified</span>',
        'pending': '<span class="badge badge-warning">Pending Review</span>',
        'suspended': '<span class="badge badge-danger">Suspended</span>',
        'rejected': '<span class="badge badge-dark">Rejected</span>'
    };
    
    return badges[status] || '<span class="badge badge-secondary">Unknown</span>';
}

/**
 * Update donation metrics
 */
function updateDonationMetrics() {
    const totalDonations = donationData.reduce((sum, d) => sum + d.amount, 0);
    const completedCount = donationData.filter(d => d.status === 'completed').length;
    const averageDonation = totalDonations / donationData.length;
    
    const metricsElements = {
        'totalDonations': `$${totalDonations.toFixed(2)}`,
        'completedDonations': completedCount.toString(),
        'averageDonation': `$${averageDonation.toFixed(2)}`,
        'totalDonors': donationData.length.toString()
    };
    
    Object.keys(metricsElements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = metricsElements[key];
        }
    });
}

// =============================================
// Chart Functions
// =============================================

/**
 * Initialize all dashboard charts
 */
function initializeCharts() {
    initializeDonationChart();
    initializeCategoryChart();
    initializeMonthlyTrendChart();
    initializeOrganizationChart();
    
    // Analytics section charts
    initializeDonorTrendChart();
    initializeUserGrowthChart();
    initializeCategoryDistributionChart();
}

/**
 * Initialize donation distribution chart
 */
function initializeDonationChart() {
    const ctx = document.getElementById('donationChart');
    if (!ctx) return;
    
    const chartData = {
        labels: donationData.map(d => d.donorName),
        datasets: [{
            label: 'Donation Amount ($)',
            data: donationData.map(d => d.amount),
            backgroundColor: [
                CHART_COLORS.primary,
                CHART_COLORS.success,
                CHART_COLORS.danger,
                CHART_COLORS.warning,
                CHART_COLORS.info
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Initialize category distribution chart
 */
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const categories = {};
    donationData.forEach(d => {
        categories[d.category] = (categories[d.category] || 0) + d.amount;
    });
    
    const chartData = {
        labels: Object.keys(categories),
        datasets: [{
            label: 'Donations by Category ($)',
            data: Object.values(categories),
            backgroundColor: [
                CHART_COLORS.primary,
                CHART_COLORS.success,
                CHART_COLORS.danger,
                CHART_COLORS.warning,
                CHART_COLORS.info
            ]
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true
        }
    });
}

/**
 * Initialize monthly trend chart
 */
function initializeMonthlyTrendChart() {
    const ctx = document.getElementById('monthlyTrendChart');
    if (!ctx) return;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trendData = [12000, 19000, 8500, 21000, 15000, 18000];
    
    const chartData = {
        labels: months,
        datasets: [{
            label: 'Monthly Donations ($)',
            data: trendData,
            borderColor: CHART_COLORS.primary,
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Initialize organization funding chart
 */
function initializeOrganizationChart() {
    const ctx = document.getElementById('organizationChart');
    if (!ctx) return;
    
    const chartData = {
        labels: charityOrganizations.map(org => org.name),
        datasets: [{
            label: 'Total Donations ($)',
            data: charityOrganizations.map(org => org.totalDonations),
            backgroundColor: CHART_COLORS.primary,
            borderColor: CHART_COLORS.primary,
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Initialize donor trend chart (line chart showing donation trends over time)
 */
function initializeDonorTrendChart() {
    const ctx = document.getElementById('donationTrendsChart');
    if (!ctx) return;
    
    // Simulated data - last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const donorTrendData = [15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000];
    
    const chartData = {
        labels: months,
        datasets: [{
            label: 'Donor Trend (₹)',
            data: donorTrendData,
            borderColor: CHART_COLORS.primary,
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: CHART_COLORS.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize user growth chart (line chart showing user growth over time)
 */
function initializeUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;
    
    // Simulated data - userbase growth
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const userGrowthData = [5000, 6200, 7500, 9000, 10800, 12500, 14200, 16500, 18900, 21000, 23500, 24560];
    
    const chartData = {
        labels: months,
        datasets: [{
            label: 'Total Users',
            data: userGrowthData,
            borderColor: CHART_COLORS.success,
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: CHART_COLORS.success,
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y.toLocaleString('en-IN') + ' users';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize donation category distribution chart (pie/doughnut chart)
 */
function initializeCategoryDistributionChart() {
    const ctx = document.getElementById('categoryDistributionChart');
    if (!ctx) return;
    
    // Simulated category data
    const categoryData = {
        'Healthcare': 2850000,
        'Education': 2100000,
        'Environment': 1680000,
        'Disaster Relief': 1890000,
        'Child Welfare': 1620000,
        'Animal Welfare': 1200000
    };
    
    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: 'Donation Distribution (₹)',
            data: Object.values(categoryData),
            backgroundColor: [
                CHART_COLORS.primary,
                CHART_COLORS.success,
                CHART_COLORS.danger,
                CHART_COLORS.warning,
                CHART_COLORS.info,
                '#ff9800'
            ],
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return '₹' + context.parsed.toLocaleString('en-IN') + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// =============================================
// Event Listeners
// =============================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('donationSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleDonationSearch);
    }
    
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleStatusFilter);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add donation form
    const addDonationForm = document.getElementById('addDonationForm');
    if (addDonationForm) {
        addDonationForm.addEventListener('submit', handleAddDonation);
    }
}

/**
 * Handle donation search
 */
function handleDonationSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = donationData.filter(donation => 
        donation.donorName.toLowerCase().includes(searchTerm) ||
        donation.organization.toLowerCase().includes(searchTerm)
    );
    
    console.log('Search results:', filteredData);
    // Update display with filtered data
}

/**
 * Handle status filter
 */
function handleStatusFilter(event) {
    const status = event.target.value;
    const filteredData = status === 'all' 
        ? donationData 
        : donationData.filter(d => d.status === status);
    
    console.log('Filtered by status:', status, filteredData);
    // Update display with filtered data
}

/**
 * Handle logout
 */
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    redirectToLogin();
}

/**
 * Handle add donation form submission
 */
function handleAddDonation(event) {
    event.preventDefault();
    console.log('Add donation form submitted');
    // Handle form submission
}

// =============================================
// Action Functions
// =============================================

/**
 * View transaction details
 */
function viewTransactionDetails(transactionHash) {
    console.log('Viewing transaction details:', transactionHash);
    
    // Find transaction in history
    const transaction = transactionHistory.find(t => t.transactionHash === transactionHash);
    if (transaction) {
        showModal('Transaction Details', createTransactionDetailsHTML(transaction));
    }
}

/**
 * Create transaction details HTML
 */
function createTransactionDetailsHTML(transaction) {
    return `
        <div class="transaction-details">
            <p><strong>Transaction Hash:</strong> ${transaction.transactionHash}</p>
            <p><strong>From:</strong> ${transaction.donorName}</p>
            <p><strong>To:</strong> ${transaction.organization}</p>
            <p><strong>Amount:</strong> $${transaction.amount.toFixed(2)}</p>
            <p><strong>Block Number:</strong> ${transaction.blockNumber}</p>
            <p><strong>Confirmations:</strong> ${transaction.confirmation}</p>
            <p><strong>Status:</strong> ${getStatusBadge(transaction.status)}</p>
            <p><strong>Timestamp:</strong> ${new Date(transaction.timestamp).toLocaleString()}</p>
        </div>
    `;
}

/**
 * View blockchain transaction details
 */
function viewBlockchainDetails(transactionHash) {
    console.log('Viewing blockchain details for:', transactionHash);
    alert('Blockchain details would be displayed here for: ' + transactionHash);
}

/**
 * Edit donation
 */
function editDonation(donationId) {
    const donation = donationData.find(d => d.id === donationId);
    if (donation) {
        console.log('Editing donation:', donation);
        showEditDonationModal(donation);
    }
}

/**
 * Show edit donation modal
 */
function showEditDonationModal(donation) {
    const modalContent = `
        <form id="editDonationForm" onsubmit="submitEditDonation(event)">
            <div class="form-group">
                <label>Donor Name:</label>
                <input type="text" class="form-control" id="editDonorName" value="${donation.donorName}">
            </div>
            <div class="form-group">
                <label>Amount:</label>
                <input type="number" class="form-control" id="editAmount" value="${donation.amount}" step="0.01">
            </div>
            <div class="form-group">
                <label>Organization:</label>
                <input type="text" class="form-control" id="editOrganization" value="${donation.organization}">
            </div>
            <div class="form-group">
                <label>Status:</label>
                <select class="form-control" id="editStatus">
                    <option value="completed" ${donation.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="pending" ${donation.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="failed" ${donation.status === 'failed' ? 'selected' : ''}>Failed</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `;
    
    showModal('Edit Donation', modalContent);
}

/**
 * Submit edit donation form
 */
function submitEditDonation(event) {
    event.preventDefault();
    console.log('Submitting edit donation form');
    // Handle form submission
}

/**
 * View organization details
 */
function viewOrganizationDetails(orgId) {
    const org = charityOrganizations.find(o => o.id === orgId);
    if (org) {
        console.log('Viewing organization details:', org);
        showModal('Organization Details', createOrgDetailsHTML(org));
    }
}

/**
 * Create organization details HTML
 */
function createOrgDetailsHTML(org) {
    return `
        <div class="org-details">
            <p><strong>Name:</strong> ${org.name}</p>
            <p><strong>Category:</strong> ${org.category}</p>
            <p><strong>Total Donations:</strong> $${org.totalDonations.toFixed(2)}</p>
            <p><strong>Number of Donors:</strong> ${org.donorCount}</p>
            <p><strong>Verification Status:</strong> ${getVerificationBadge(org.verificationStatus)}</p>
            <p><strong>Wallet Address:</strong> ${org.walletAddress}</p>
        </div>
    `;
}

/**
 * Edit organization
 */
function editOrganization(orgId) {
    const org = charityOrganizations.find(o => o.id === orgId);
    if (org) {
        console.log('Editing organization:', org);
        showEditOrganizationModal(org);
    }
}

/**
 * Show edit organization modal
 */
function showEditOrganizationModal(org) {
    const modalContent = `
        <form id="editOrgForm" onsubmit="submitEditOrganization(event)">
            <div class="form-group">
                <label>Organization Name:</label>
                <input type="text" class="form-control" id="editOrgName" value="${org.name}">
            </div>
            <div class="form-group">
                <label>Category:</label>
                <input type="text" class="form-control" id="editOrgCategory" value="${org.category}">
            </div>
            <div class="form-group">
                <label>Verification Status:</label>
                <select class="form-control" id="editVerification">
                    <option value="verified" ${org.verificationStatus === 'verified' ? 'selected' : ''}>Verified</option>
                    <option value="pending" ${org.verificationStatus === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="suspended" ${org.verificationStatus === 'suspended' ? 'selected' : ''}>Suspended</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    `;
    
    showModal('Edit Organization', modalContent);
}

/**
 * Submit edit organization form
 */
function submitEditOrganization(event) {
    event.preventDefault();
    console.log('Submitting edit organization form');
    // Handle form submission
}

// =============================================
// Utility Functions
// =============================================

/**
 * Show modal dialog
 */
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
    
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
    window.location.href = '/login.html';
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

/**
 * Log admin action for audit trail
 */
function logAdminAction(action, details) {
    const auditLog = {
        admin: adminUser.email,
        action: action,
        details: details,
        timestamp: new Date().toISOString()
    };
    
    console.log('Admin Action Log:', auditLog);
    // Send to backend for audit logging
}

/**
 * Export donation data to CSV
 */
function exportDonationsToCSV() {
    let csv = 'ID,Donor Name,Amount,Organization,Date,Status\n';
    
    donationData.forEach(donation => {
        csv += `${donation.id},"${donation.donorName}",${donation.amount},"${donation.organization}",${donation.date.toLocaleDateString()},"${donation.status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donations_export.csv';
    a.click();
    
    logAdminAction('EXPORT', 'Donations exported to CSV');
}

/**
 * Generate report
 */
function generateReport() {
    const report = {
        generatedAt: new Date().toISOString(),
        totalDonations: donationData.reduce((sum, d) => sum + d.amount, 0),
        donationCount: donationData.length,
        averageDonation: donationData.reduce((sum, d) => sum + d.amount, 0) / donationData.length,
        userStats: userStats,
        organizationCount: charityOrganizations.length,
        verifiedOrganizations: charityOrganizations.filter(o => o.verificationStatus === 'verified').length
    };
    
    console.log('Generated Report:', report);
    logAdminAction('REPORT_GENERATED', report);
    
    return report;
}

// =============================================
// Initialize on Page Load
// =============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
    initAdminDashboard();
}
