export type TransactionType = "income" | "expense";

export type Category =
  | "housing"
  | "food"
  | "transportation"
  | "entertainment"
  | "utilities";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface MonthlyData {
  month: string; // YYYY-MM
  transactions: Transaction[];
  budgets: Budget[];
}

export interface CategoryInfo {
  key: Category;
  label: string;
  color: string;
  icon: string;
}
