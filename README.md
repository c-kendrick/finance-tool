## 🛠️ Technologies Used

### 🟨 Vanilla JavaScript (ES6)
Rather than using React, Vue, or Angular, I wrote the entire logic in pure, vanilla JavaScript.

> **Why I chose it:** For a lightweight dashboard that primarily relies on DOM manipulation and straightforward math, a heavy front-end framework would be overkill. Vanilla JS keeps the codebase simple, requires zero build steps (no Webpack or Babel configurations), and makes the app incredibly fast to load.

---

### 📊 Chart.js
A finance tracker is useless without good visuals. I used Chart.js to handle all the graphical representations of my data.

> **Why I chose it:** It’s an open-source, canvas-based library that makes building responsive charts a breeze. With just a few lines of configuration, I was able to implement dynamic **Pie charts** (for Income vs. Expenses), **Line charts** (for tracking daily savings trends), and **Bar charts** (for breaking down expenses by category). It does the heavy lifting for data visualization so I didn't have to reinvent the wheel.

---

### 💾 LocalStorage API
The site uses the browser's native `localStorage` API to save data.

> **Why I chose it:** I wanted a "local-first" application. By storing the income, expense, and upcoming bill data directly in the user's browser, the app requires absolutely no backend server, no database hosting, and no complex authentication logic. It also means the user's financial data is completely private and never leaves their machine.
