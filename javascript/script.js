const addIncomeButton = document.getElementById("add-income");
const addExpenseButton = document.getElementById("add-expense");
const incomeList = document.getElementById("income-list");
const expenseList = document.getElementById("expense-list");
const addUpcomingButton = document.getElementById("add-upcoming");
const upcomingList = document.getElementById("upcoming-list");


const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const totalSavings = document.getElementById("total-savings");

const totalWeeklyIncome = document.getElementById("total-weekly-income");
const totalWeeklyExpenses = document.getElementById("total-weekly-expenses");
const totalWeeklySavings = document.getElementById("total-weekly-savings");

const totalMonthlyIncome = document.getElementById("total-monthly-income");
const totalMonthlyExpenses = document.getElementById("total-monthly-expenses");
const totalMonthlySavings = document.getElementById("total-monthly-savings");


let incomeTotal = 0;
let expensesTotal = 0;

let weeklyIncomePie;
let weeklyIncomeLine; 
let weeklySavingsLine;
let weeklyCategoryBar;

let monthlyIncomePie;
let monthlyIncomeLine; 
let monthlySavingsLine;
let monthlyCategoryBar;

let yearlyIncomePie;
let yearlyIncomeLine;
let yearlySavingsLine;
let yearlyCategoryBar;


document.addEventListener('DOMContentLoaded', function () {
    const yearlySnapshotTitle = document.getElementById("yearlysnapshot");
    const currentYear = new Date().getFullYear();
    yearlySnapshotTitle.textContent = `${currentYear} Snapshot`;
    initCharts();
    loadData();
    updateWeeklyCharts();
    updateMonthlyCharts();
    updateYearlyCharts();
});

function isDateInThisWeek(date) {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
    return date >= weekStart && date <= weekEnd;
}

function isDateInThisMonth(date) {
    const now = new Date();
    // We check both the month AND the year to prevent past years from sneaking in!
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function isDateInThisYear(date) {
    const now = new Date();
    return date.getFullYear() === now.getFullYear();
}

function calculateSavingsUntilLastWeek() {
    const currentDate = new Date();
    const lastSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());

    let incomeUntilLastWeek = 0;
    let expensesUntilLastWeek = 0;

    for (const li of incomeList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (date < lastSunday) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            incomeUntilLastWeek += amount;
        }
    }

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (date < lastSunday) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            expensesUntilLastWeek += amount;
        }
    }

    return incomeUntilLastWeek - expensesUntilLastWeek;
}

function calculateSavingsUntilLastMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0);

    let incomeUntilLastMonth = 0;
    let expensesUntilLastMonth = 0;

    for (const li of incomeList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (date <= lastDayOfPrevMonth) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            incomeUntilLastMonth += amount;
        }
    }

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (date <= lastDayOfPrevMonth) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            expensesUntilLastMonth += amount;
        }
    }

    return incomeUntilLastMonth - expensesUntilLastMonth;
}

function calculateSavingsUntilLastYear() {
    const currentYear = new Date().getFullYear();

    let incomeUntilLastYear = 0;
    let expensesUntilLastYear = 0;

    for (const li of incomeList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        // Check if the year is BEFORE the current year
        if (date.getFullYear() < currentYear) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            incomeUntilLastYear += amount;
        }
    }

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        // Check if the year is BEFORE the current year
        if (date.getFullYear() < currentYear) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            expensesUntilLastYear += amount;
        }
    }

    return incomeUntilLastYear - expensesUntilLastYear;
}


function updateWeeklyCharts() {
    // Get the data for the current week
    const weeklyIncome = Array(7).fill(0);
    const weeklyExpenses = Array(7).fill(0);

    const startingSavings = calculateSavingsUntilLastWeek();

    for (const li of incomeList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (isDateInThisWeek(date) && isDateInThisMonth(date) && isDateInThisYear(date)) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            weeklyIncome[(date.getDay() + 6) % 7] += amount;
        }
    }

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (isDateInThisWeek(date) && isDateInThisMonth(date) && isDateInThisYear(date)) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            weeklyExpenses[(date.getDay() + 6) % 7] += amount;
        }
    }

    // Update the chart data
    weeklyIncomePie.data.datasets[0].data = [weeklyIncome.reduce((a, b) => a + b, 0), 
                                             weeklyExpenses.reduce((a, b) => a + b, 0)];
    weeklyIncomePie.update();

    weeklyIncomeLine.data.datasets[0].data = weeklyIncome;
    weeklyIncomeLine.data.datasets[1].data = weeklyExpenses;
    weeklyIncomeLine.update();

    // Calculate weekly savings
    const weeklySavings = weeklyIncome.reduce((a, b) => a + b, 0) - weeklyExpenses.reduce((a, b) => a + b, 0);

    const dailySavings = weeklyIncome.map((income, index) => income - weeklyExpenses[index]);
    const cumulativeSavings = dailySavings.reduce((acc, curr, index) => {
        const previousSavings = index > 0 ? acc[index - 1] : startingSavings;
        acc.push(previousSavings + curr);
        return acc;
    }, []);

    weeklySavingsLine.data.datasets[0].data = cumulativeSavings;
    weeklySavingsLine.update();

    // Calculate the weekly expenses for each category
    const categories = ['Bills', 'Transport', 'Groceries', 'Clothes', 'Take-Out', 
                        'Entertainment', 'Gym', 'Retail', 'Other'];
    const weeklyCategoryExpenses = categories.map(() => 0);

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (isDateInThisWeek(date) && isDateInThisMonth(date) && isDateInThisYear(date)) {
            const category = li.textContent.split(" - ")[1]; // Change this line to access the correct category
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            const categoryIndex = categories.indexOf(category);
            if (categoryIndex !== -1) {
                weeklyCategoryExpenses[categoryIndex] += amount;
            }
        }
    }

    // Update the weeklyCategoryBar chart data
    weeklyCategoryBar.data.datasets[0].data = weeklyCategoryExpenses;
    weeklyCategoryBar.update();

    // Update the Weekly Snapshot section
    totalWeeklyIncome.textContent = weeklyIncome.reduce((a, b) => a + b, 0).toFixed(2);
    totalWeeklyExpenses.textContent = weeklyExpenses.reduce((a, b) => a + b, 0).toFixed(2);
    totalWeeklySavings.textContent = weeklySavings.toFixed(2); // This line should now work correctly
}

function updateMonthlyCharts() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();

    const monthlyIncome = Array(daysInCurrentMonth).fill(0);
    const monthlyExpenses = Array(daysInCurrentMonth).fill(0);
    const startingSavings = calculateSavingsUntilLastMonth();

    for (const li of incomeList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        
        // FIX: Replaced old logic with our new helper function!
        if (isDateInThisMonth(date)) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            monthlyIncome[date.getDate() - 1] += amount;
        }
    }

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        
        // FIX: Replaced old logic with our new helper function!
        if (isDateInThisMonth(date)) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            monthlyExpenses[date.getDate() - 1] += amount;
        }
    }

    // Update the monthly chart data
    monthlyIncomePie.data.datasets[0].data = [monthlyIncome.reduce((a, b) => a + b, 0), 
                                               monthlyExpenses.reduce((a, b) => a + b, 0)];
    monthlyIncomePie.update();
    
    monthlyIncomeLine.data.datasets[0].data = monthlyIncome;
    monthlyIncomeLine.data.datasets[1].data = monthlyExpenses;
    monthlyIncomeLine.update();

    const cumulativeMonthlySavings = monthlyIncome.map((income, index) => {
        return income - monthlyExpenses[index];
    }).reduce((cumulativeSavings, currentSavings, index) => {
        const previousSavings = index > 0 ? cumulativeSavings[index - 1] : startingSavings;
        cumulativeSavings.push(previousSavings + currentSavings);
        return cumulativeSavings;
    }, []);

    monthlySavingsLine.data.datasets[0].data = cumulativeMonthlySavings;
    monthlySavingsLine.update();
    
    // Calculate the monthly expenses for each category
    const categories = ['Bills', 'Transport', 'Groceries', 'Clothes', 'Take-Out', 
                        'Entertainment', 'Gym', 'Retail', 'Other'];
    const monthlyCategoryExpenses = categories.map(() => 0);

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        
        // FIX: Replaced old logic with our new helper function to prevent 2023 leaks!
        if (isDateInThisMonth(date)) {
            const category = li.textContent.split(" - ")[1]; 
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            const categoryIndex = categories.indexOf(category);
            if (categoryIndex !== -1) {
                monthlyCategoryExpenses[categoryIndex] += amount;
            }
        }
    }

    // Update the monthlyCategoryBar chart data
    monthlyCategoryBar.data.datasets[0].data = monthlyCategoryExpenses;
    monthlyCategoryBar.update();

    const monthlySavings = monthlyIncome.reduce((a, b) => a + b, 0) - monthlyExpenses.reduce((a, b) => a + b, 0);
    
    // Update the Monthly Snapshot section
    totalMonthlyIncome.textContent = monthlyIncome.reduce((a, b) => a + b, 0).toFixed(2);
    totalMonthlyExpenses.textContent = monthlyExpenses.reduce((a, b) => a + b, 0).toFixed(2);
    totalMonthlySavings.textContent = monthlySavings.toFixed(2); 
}

function updateYearlyCharts() {
    const allTimeIncome = Array(12).fill(0);
    const allTimeExpenses = Array(12).fill(0);
    
    // 1. Get the accrued savings from all previous years
    const startingSavings = calculateSavingsUntilLastYear();

    for (const li of incomeList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        // Cleaned up using your helper function!
        if (isDateInThisYear(date)) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            allTimeIncome[date.getMonth()] += amount;
        }
    }

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        // Cleaned up using your helper function!
        if (isDateInThisYear(date)) {
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            allTimeExpenses[date.getMonth()] += amount; 
        }
    }

    // Update the all-time chart data
    yearlyIncomePie.data.datasets[0].data = [allTimeIncome.reduce((a, b) => a + b, 0), 
                                             allTimeExpenses.reduce((a, b) => a + b, 0)];
    yearlyIncomePie.update();

    yearlyIncomeLine.data.datasets[0].data = allTimeIncome;
    yearlyIncomeLine.data.datasets[1].data = allTimeExpenses;
    yearlyIncomeLine.update();

    const cumulativeYearlySavings = allTimeIncome.map((income, index) => {
        return income - allTimeExpenses[index];
    }).reduce((cumulativeSavings, currentSavings, index) => {
        // 2. FIX: We now use startingSavings instead of 0 for January!
        const previousSavings = index > 0 ? cumulativeSavings[index - 1] : startingSavings;
        cumulativeSavings.push(previousSavings + currentSavings);
        return cumulativeSavings;
    }, []);
    
    yearlySavingsLine.data.datasets[0].data = cumulativeYearlySavings;
    yearlySavingsLine.update();

    // Calculate the yearly expenses for each category
    const categories = ['Bills', 'Transport', 'Groceries', 'Clothes', 'Take-Out', 
                        'Entertainment', 'Gym', 'Retail', 'Other'];
    const yearlyCategoryExpenses = categories.map(() => 0);

    for (const li of expenseList.children) {
        const date = new Date(li.textContent.split(" - ")[0].split("/").reverse().join("-"));
        if (isDateInThisYear(date)) {
            const category = li.textContent.split(" - ")[1]; 
            const amount = parseFloat(li.textContent.split(" - $")[1]);
            const categoryIndex = categories.indexOf(category);
            if (categoryIndex !== -1) {
                yearlyCategoryExpenses[categoryIndex] += amount;
            }
        }
    }

    // Update the yearlyCategoryBar chart data
    yearlyCategoryBar.data.datasets[0].data = yearlyCategoryExpenses;
    yearlyCategoryBar.update();

    updateWeeklyCharts();
}

function initCharts() {
    // Pie chart
    const weeklyIncomePieCtx = document.getElementById('pie-chart').getContext('2d');
    weeklyIncomePie = new Chart(weeklyIncomePieCtx, { 
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0], 
                backgroundColor: ['#4CAF50', '#f44336']
            }]
        }
    });

    // Line chart
    const weeklyIncomeLineCtx = document.getElementById('line-chart').getContext('2d');
    weeklyIncomeLine = new Chart(weeklyIncomeLineCtx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Income',
                data: [0, 0, 0, 0, 0, 0, 0], 
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true
            }, {
                label: 'Expenses',
                data: [0, 0, 0, 0, 0, 0, 0], 
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Line chart
    const weeklySavingsLineCtx = document.getElementById('weekly-savings-line-chart').getContext('2d');
    weeklySavingsLine = new Chart(weeklySavingsLineCtx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Savings',
                data: [0, 0, 0, 0, 0, 0, 0], 
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const weeklyCategoryBarCtx = document.getElementById('weekly-category-bar-chart').getContext('2d');
    weeklyCategoryBar = new Chart(weeklyCategoryBarCtx, {
        type: 'bar',
        data: {
            labels: ['Bills', 'Transport', 'Groceries', 'Clothes', 'Take-Out', 
                     'Entertainment', 'Gym', 'Retail', 'Other'],
            datasets: [{
                label: 'Expenses',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0], 
                backgroundColor: '#0C405A', 
                borderColor: 'rgba(12, 64, 90, 0.5)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // All-time pie chart
    const yearlyIncomePieCtx = document.getElementById('all-time-pie-chart').getContext('2d');
    yearlyIncomePie = new Chart(yearlyIncomePieCtx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4CAF50', '#f44336']
            }]
        }
    });

    // All-time line chart
    const yearlyIncomeLineCtx = document.getElementById('all-time-line-chart').getContext('2d');
    yearlyIncomeLine = new Chart(yearlyIncomeLineCtx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Income',
                data: Array(12).fill(0),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true
            }, {
                label: 'Expenses',
                data: Array(12).fill(0),
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // All-time line chart
    const yearlySavingsLineCtx = document.getElementById('all-time-savings-line-chart').getContext('2d');
    yearlySavingsLine = new Chart(yearlySavingsLineCtx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Savings',
                data: Array(12).fill(0),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    // Yearly Category Bar Chart
    const yearlyCategoryBarCtx = document.getElementById('all-time-category-bar-chart').getContext('2d');
    yearlyCategoryBar = new Chart(yearlyCategoryBarCtx, {
        type: 'bar',
        data: {
            labels: ['Bills', 'Transport', 'Groceries', 'Clothes', 'Take-Out', 
                     'Entertainment', 'Gym', 'Retail', 'Other'],
            datasets: [{
                label: 'Expenses',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0], 
                backgroundColor: '#0C405A', 
                borderColor: 'rgba(12, 64, 90, 0.5)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Monthly pie chart
    const monthlyIncomePieCtx = document.getElementById('monthly-pie-chart').getContext('2d');
    monthlyIncomePie = new Chart(monthlyIncomePieCtx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4CAF50', '#f44336']
            }]
        }
    });


    // Monthly line chart
    const monthlyIncomeLineCtx = document.getElementById('monthly-line-chart').getContext('2d');
    monthlyIncomeLine = new Chart(monthlyIncomeLineCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: new Date().getDate() }, (_, i) => i + 1),
            datasets: [{
                label: 'Income',
                data: Array(new Date().getDate()).fill(0),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                fill: true
            }, {
                label: 'Expenses',
                data: Array(new Date().getDate()).fill(0),
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Monthly line chart #FFD700
    const monthlySavingsLineCtx = document.getElementById('monthly-savings-line-chart').getContext('2d');
    monthlySavingsLine = new Chart(monthlySavingsLineCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: new Date().getDate() }, (_, i) => i + 1),
            datasets: [{
                label: 'Savings',
                data: Array(new Date().getDate()).fill(0),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Monthly Category Bar Chart
    const monthlyCategoryBarCtx = document.getElementById('monthly-category-bar-chart').getContext('2d');
    monthlyCategoryBar = new Chart(monthlyCategoryBarCtx, {
        type: 'bar',
        data: {
            labels: ['Bills', 'Transport', 'Groceries', 'Clothes', 'Take-Out', 
                     'Entertainment', 'Gym', 'Retail', 'Other'],
            datasets: [{
                label: 'Expenses',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0], 
                backgroundColor: '#0C405A', 
                borderColor: 'rgba(12, 64, 90, 0.5)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function createIncomeItem(date, owner, description, amount) {
    const formattedDate = formatDate(date);
    const li = document.createElement("li");
    li.textContent = `${formattedDate} - ${owner} - ${description} - $${amount}`;

    createDeleteButton(li, incomeList, updateTotals, amount);
    return li;;
}

function createExpenseItem(date, category, description, amount) {
    const formattedDate = formatDate(date);
    const li = document.createElement("li");
    li.textContent = `${formattedDate} - ${category} - ${description} - $${amount}`;

    createDeleteButton(li, expenseList, updateTotals, amount);
    return li;
}

function createUpcomingItem(category, description, amount, dueDate, status) {
    const formattedDate = formatDate(dueDate);
    const li = document.createElement("li");
    li.className = "unpaid";
    li.textContent = `${status} - ${formattedDate} - ${category} - ${description} - $${amount}`;
    
    const payButton = document.createElement("button");
    payButton.textContent = "Pay";
    payButton.classList.add("pay");

    if (status === "Unpaid") {
        li.appendChild(payButton);
        payButton.addEventListener("click", () => {
            if (li.className === "unpaid") {
                li.className = "paid";
                status = "Paid"
                li.textContent = `${status} - ${formattedDate} - ${category} - ${description} - $${amount}`;
                payButton.disabled = true;
    
                const expenseItem = createExpenseItem(dueDate, category, description, amount);
                expenseList.appendChild(expenseItem);
                expensesTotal += amount;
    
                updateTotals();
                updateWeeklyCharts();
                updateMonthlyCharts();
                updateYearlyCharts();
                saveData();
            } else {
                payButton.disabled = true;
            }
        });
    } else {
        li.className = "paid";
    }

    createDeleteButton(li, upcomingList, () => {});
    return li;
}

function updateTotals() {
    totalIncome.textContent = incomeTotal.toFixed(2);
    totalExpenses.textContent = expensesTotal.toFixed(2);
    const savings = incomeTotal - expensesTotal;
    totalSavings.textContent = savings.toFixed(2);

    let bgColor, textColor;
    if (savings >= incomeTotal * 0.25) {
        bgColor = "rgba(0, 128, 0, 0.5)";
        textColor = "white";
    } else if (savings >= 0) {
        bgColor = "rgba(255, 165, 0, 0.5)";
        textColor = "black";
    } else {
        bgColor = "rgba(255, 0, 0, 0.5)";
        textColor = "white";
    }
    
    totalSavings.style.backgroundColor = bgColor;
    totalSavings.style.color = textColor;
    totalSavings.style.padding = "2px";
}

addUpcomingButton.addEventListener("click", () => {
    const category = document.getElementById("upcoming-category").value;
    const description = document.getElementById("upcoming-description").value;
    const amount = parseFloat(document.getElementById("upcoming-amount").value);
    const dueDate = document.getElementById("upcoming-due-date").value;
    const status = "Unpaid";

    if (category && description && amount > 0 && dueDate) {
        const li = createUpcomingItem(category, description, amount, dueDate, status);
        upcomingList.insertBefore(li, upcomingList.firstChild);
        saveData();
    } else {
        alert("Please fill in all fields with valid values.");
    }
});

addIncomeButton.addEventListener("click", () => {
    const date = document.getElementById("income-date").value;
    const owner = document.getElementById("income-owner").value; 
    const description = document.getElementById("income-description").value;
    const amount = parseFloat(document.getElementById("income-amount").value);

    if (date && owner && description && amount > 0) {
        const li = createIncomeItem(date, owner, description, amount);
        incomeList.insertBefore(li, incomeList.firstChild);
        incomeTotal += amount;
        updateTotals();
        updateWeeklyCharts();
        updateMonthlyCharts();
        updateYearlyCharts();
        saveData();
    } else {
        alert("Please fill in all fields with valid values.");
    }
});

addExpenseButton.addEventListener("click", () => {
    const date = document.getElementById("expense-date").value;
    const category = document.getElementById("expense-category").value;
    const description = document.getElementById("expense-description").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);

    if (date && category && description && amount > 0) {
        const li = createExpenseItem(date, category, description, amount);
        expenseList.insertBefore(li, expenseList.firstChild);
        expensesTotal += amount;
        updateTotals();
        updateWeeklyCharts();
        updateMonthlyCharts();
        updateYearlyCharts();
        saveData();
    } else {
        alert("Please fill in all fields with valid values.");
    }
});

function createDeleteButton(li, list, updateFunction, amount) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    
    deleteButton.addEventListener("click", () => {
        list.removeChild(li);
        if (list === incomeList) {
            incomeTotal = incomeTotal - amount;
        } else if (list === expenseList) {
            expensesTotal = expensesTotal - amount;
        }

        updateFunction();
        saveData();
        updateWeeklyCharts();
        updateMonthlyCharts();
        updateYearlyCharts();
        updateTotals();
    });
    li.appendChild(deleteButton);
}

function saveData() {
    const incomeData = [];
    for (const li of incomeList.children) {
        incomeData.push({
            content: li.textContent.replace("Delete", "")
        });
    }
    localStorage.setItem('incomeData', JSON.stringify(incomeData));

    const expenseData = [];
    for (const li of expenseList.children) {
        expenseData.push({
            content: li.textContent.replace("Delete", "")
        });
    }
    localStorage.setItem('expenseData', JSON.stringify(expenseData));

    const upcomingData = [];
    for (const li of upcomingList.children) {
        upcomingData.push({
            content: li.textContent.replace("Pay", "").replace("Delete", ""),
            className: li.className
        });
    }
    localStorage.setItem('upcomingData', JSON.stringify(upcomingData));
}

function loadData() {
    const incomeData = JSON.parse(localStorage.getItem('incomeData')) || [];
    const expenseData = JSON.parse(localStorage.getItem('expenseData')) || [];
    const upcomingData = JSON.parse(localStorage.getItem('upcomingData')) || [];

    for (const item of incomeData) {
        const [dateString, owner, description, amount] = item.content.split(' - ');
        const [day, month, year] = dateString.split("/").map(Number); 
        const dateObject = new Date(year, month - 1, day); 

        const li = createIncomeItem(dateObject, owner, description, parseFloat(amount.substring(1)));
        incomeList.insertBefore(li, incomeList.firstChild);

        const stringWithout = amount.replace("$", "");
        const amountFloat = parseFloat(stringWithout);
        incomeTotal += amountFloat;
    }

    for (const item of expenseData) {
        const [dateString, category, description, amount] = item.content.split(' - ');
        const [day, month, year] = dateString.split("/").map(Number); 

        const dateObject = new Date(year, month - 1, day); 

        const li = createExpenseItem(dateObject, category, description, parseFloat(amount.substring(1)));
        expenseList.insertBefore(li, expenseList.firstChild);

        const stringWithout = amount.replace("$", "");
        const amountFloat = parseFloat(stringWithout);
        expensesTotal += amountFloat;
    }

    for (const item of upcomingData) {
        const [status, dueDateString, category, description, amount] = item.content.split(/ - /);
        const [day, month, year] = dueDateString.split("/").map(Number);
        const dueDate = new Date(year, month - 1, day);

        console.log("dueDateString: " + dueDateString + " category: " + category + 
                    " description: " + description + " amount: " + amount + "\n");

        console.log("dueDate: " + dueDate);
    
        const li = createUpcomingItem(category, description, parseFloat(amount.substring(1)), dueDate, status);
    
        upcomingList.insertBefore(li, upcomingList.firstChild);
    }

    updateTotals();
    updateWeeklyCharts();
    updateMonthlyCharts();
    updateYearlyCharts();
}