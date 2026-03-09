import type { Category, CategoryInfo, Transaction } from "../types";

export const CATEGORIES: CategoryInfo[] = [
  { key: "housing", label: "Housing", color: "#6366f1", icon: "Home" },
  {
    key: "food",
    label: "Food & Dining",
    color: "#f59e0b",
    icon: "UtensilsCrossed",
  },
  {
    key: "transportation",
    label: "Transportation",
    color: "#10b981",
    icon: "Car",
  },
  {
    key: "entertainment",
    label: "Entertainment",
    color: "#ec4899",
    icon: "Gamepad2",
  },
  { key: "utilities", label: "Utilities", color: "#3b82f6", icon: "Zap" },
];

export function getCategoryInfo(key: Category): CategoryInfo {
  return CATEGORIES.find((c) => c.key === key)!;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatMonthYear(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getTransactionsForMonth(
  transactions: Transaction[],
  month: string,
): Transaction[] {
  return transactions.filter((t) => t.date.startsWith(month));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getTotalByType(
  transactions: Transaction[],
  type: "income" | "expense",
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getSpendingByCategory(
  transactions: Transaction[],
): Record<Category, number> {
  const result: Record<Category, number> = {
    housing: 0,
    food: 0,
    transportation: 0,
    entertainment: 0,
    utilities: 0,
  };
  for (const t of transactions) {
    if (t.type === "expense") {
      result[t.category] += t.amount;
    }
  }
  return result;
}

export function getDailySpending(
  transactions: Transaction[],
  month: string,
): { date: string; amount: number }[] {
  const [year, mon] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();
  const dailyMap = new Map<string, number>();

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${month}-${String(d).padStart(2, "0")}`;
    dailyMap.set(key, 0);
  }

  for (const t of transactions) {
    if (t.type === "expense" && t.date.startsWith(month)) {
      dailyMap.set(t.date, (dailyMap.get(t.date) ?? 0) + t.amount);
    }
  }

  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({
      date: formatDate(date),
      amount,
    }));
}

export function getSeedTransactions(): Transaction[] {
  const month = getCurrentMonth();
  return [
    {
      id: generateId(),
      type: "income",
      amount: 5200,
      category: "housing",
      description: "Monthly salary",
      date: `${month}-01`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 1400,
      category: "housing",
      description: "Rent payment",
      date: `${month}-01`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 85,
      category: "utilities",
      description: "Electric bill",
      date: `${month}-03`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 45,
      category: "utilities",
      description: "Internet",
      date: `${month}-03`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 62,
      category: "food",
      description: "Grocery run",
      date: `${month}-05`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 38,
      category: "food",
      description: "Dinner out",
      date: `${month}-07`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 50,
      category: "transportation",
      description: "Gas",
      date: `${month}-06`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 15,
      category: "entertainment",
      description: "Streaming subscription",
      date: `${month}-01`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 42,
      category: "entertainment",
      description: "Movie tickets",
      date: `${month}-08`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 28,
      category: "food",
      description: "Coffee & snacks",
      date: `${month}-04`,
    },
    {
      id: generateId(),
      type: "expense",
      amount: 120,
      category: "transportation",
      description: "Car maintenance",
      date: `${month}-09`,
    },
  ];
}

export function getDefaultBudgets() {
  return [
    { category: "housing" as Category, limit: 1500 },
    { category: "food" as Category, limit: 400 },
    { category: "transportation" as Category, limit: 300 },
    { category: "entertainment" as Category, limit: 150 },
    { category: "utilities" as Category, limit: 200 },
  ];
}
