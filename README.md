## Personal Finance Dashboard
![Finance Dashboard Screenshot](images/finance.png)  
[View site here](https://c-kendrick.github.io/finance-tool/)  

## Core Features
* **Dashboard Analytics:** Visualises income, expenses, and savings via dynamic charts.
* **Expense Tracking:** Allows users to log, categorise, and delete daily transactions.
* **Local State Management:** Persists user data securely across sessions without requiring an account.

## Technologies Used

### Vanilla JavaScript (ES6)
I built the core logic and state management entirely in vanilla ES6 JavaScript, intentionally bypassing heavy front-end frameworks.

> **Why I chose it:** For a lightweight dashboard focused on DOM manipulation and data processing, a large framework introduces unnecessary overhead. Vanilla JS keeps the codebase maintainable, ensures zero build-step bloat (no Webpack or Babel configurations), and delivers exceptionally fast loading times.

---

### Chart.js
To translate raw financial data into readable metrics, I integrated Chart.js for all graphical representations.

> **Why I chose it:** It’s a robust, canvas-based library that streamlines responsive data visualisation. It allowed me to efficiently implement dynamic **Pie charts** (Income vs. Expenses), **Line charts** (daily savings trends), and **Bar charts** (expense categorisation). Leveraging an established library meant I could focus my time on the core data logic rather than custom canvas rendering.

---

### LocalStorage API
The application utilises the browser's native `localStorage` API for persistent client-side data management.

> **Why I chose it:** I set out to build a strictly "local-first" application. By storing income, expense, and budget data directly in the browser, the app guarantees absolute data privacy—the user's financial metrics never leave their machine. This approach also ensures zero-latency data retrieval and demonstrates how to manage persistent state without relying on backend databases or complex authentication loops.

### Roadmap & Future Iterations
* **Data Export:** Implement a feature to export `localStorage` data to a CSV file for user backup.
* **Currency Localisation:** Add a toggle to format values dynamically based on regional currency standards.
