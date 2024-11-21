const entryForm = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const totalIncomeElem = document.getElementById('total-income');
const totalExpensesElem = document.getElementById('total-expenses');
const balanceElem = document.getElementById('balance');
const chartCanvas = document.getElementById('spending-chart');

let transactions = [];
let chart = null;


function loadTransactions() {
  const storedTransactions = localStorage.getItem('transactions');
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
  }
}


function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(description, amount, category) {
  const transaction = {
    id: Date.now(),
    description,
    amount: parseFloat(amount),
    category,
  };
  transactions.push(transaction);
  saveTransactions();
  updateSummary();
  updateChart();
}

function updateSummary() {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income + expenses;

  totalIncomeElem.textContent = income.toFixed(2);
  totalExpensesElem.textContent = Math.abs(expenses).toFixed(2);
  balanceElem.textContent = balance.toFixed(2);
}

function updateChart() {
  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  const data = categories.map((category) =>
    transactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  );

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [
        {
          data,
          backgroundColor: ['#4caf50', '#ff5722', '#ffc107', '#2196f3'],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

entryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const category = categorySelect.value;

  if (!description || isNaN(amount)) {
    alert('Please provide valid description and amount.');
    return;
  }

  addTransaction(description, amount, category);

  descriptionInput.value = '';
  amountInput.value = '';
});

document.addEventListener('DOMContentLoaded', () => {
  loadTransactions();
  updateSummary();
  updateChart();
});
