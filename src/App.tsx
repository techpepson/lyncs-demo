import { useState } from "react";
import { LayoutDashboard, List, PiggyBank } from "lucide-react";
import { useFinance } from "./hooks/useFinance";
import { SummaryCards } from "./components/SummaryCards";
import {
  SpendingDonut,
  SpendingTrend,
  CategoryBreakdown,
} from "./components/Charts";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { BudgetManager } from "./components/BudgetManager";
import { MonthPicker } from "./components/MonthPicker";
import "./App.css";

type Tab = "dashboard" | "transactions" | "budgets";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const finance = useFinance();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__top">
          <h1 className="app-header__title">
            <PiggyBank size={28} />
            Lyncs
          </h1>
          <MonthPicker
            currentMonth={finance.currentMonth}
            onChange={finance.setCurrentMonth}
          />
        </div>
        <nav className="tab-nav">
          <button
            className={`tab-nav__btn ${activeTab === "dashboard" ? "tab-nav__btn--active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            className={`tab-nav__btn ${activeTab === "transactions" ? "tab-nav__btn--active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            <List size={18} />
            Transactions
          </button>
          <button
            className={`tab-nav__btn ${activeTab === "budgets" ? "tab-nav__btn--active" : ""}`}
            onClick={() => setActiveTab("budgets")}
          >
            <PiggyBank size={18} />
            Budgets
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === "dashboard" && (
          <div className="dashboard">
            <SummaryCards
              totalIncome={finance.totalIncome}
              totalExpenses={finance.totalExpenses}
              balance={finance.balance}
            />

            <div className="dashboard__charts">
              <section className="card">
                <h2 className="card__title">Spending by Category</h2>
                <SpendingDonut transactions={finance.monthTransactions} />
              </section>

              <section className="card">
                <h2 className="card__title">Daily Spending</h2>
                <SpendingTrend
                  transactions={finance.monthTransactions}
                  month={finance.currentMonth}
                />
              </section>
            </div>

            <section className="card">
              <h2 className="card__title">Category Breakdown</h2>
              <CategoryBreakdown
                spendingByCategory={finance.spendingByCategory}
                totalExpenses={finance.totalExpenses}
              />
            </section>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="transactions-page">
            <section className="card">
              <h2 className="card__title">Transactions</h2>
              <TransactionList
                transactions={finance.monthTransactions}
                onDelete={finance.deleteTransaction}
              />
            </section>
          </div>
        )}

        {activeTab === "budgets" && (
          <div className="budgets-page">
            <section className="card">
              <h2 className="card__title">Monthly Budgets</h2>
              <p className="card__subtitle">
                Set spending limits for each category. Click a limit to edit it.
              </p>
              <BudgetManager
                budgets={finance.budgets}
                spendingByCategory={finance.spendingByCategory}
                onUpdateBudget={finance.updateBudget}
              />
            </section>
          </div>
        )}
      </main>

      <TransactionForm
        onAdd={finance.addTransaction}
        currentMonth={finance.currentMonth}
      />
    </div>
  );
}

export default App;
