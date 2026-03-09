import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/helpers";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function SummaryCards({
  totalIncome,
  totalExpenses,
  balance,
}: SummaryCardsProps) {
  return (
    <div className="summary-cards">
      <div className="summary-card summary-card--income">
        <div className="summary-card__icon">
          <TrendingUp size={22} />
        </div>
        <div className="summary-card__content">
          <span className="summary-card__label">Income</span>
          <span className="summary-card__value">
            {formatCurrency(totalIncome)}
          </span>
        </div>
      </div>

      <div className="summary-card summary-card--expense">
        <div className="summary-card__icon">
          <TrendingDown size={22} />
        </div>
        <div className="summary-card__content">
          <span className="summary-card__label">Expenses</span>
          <span className="summary-card__value">
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>

      <div
        className={`summary-card summary-card--balance ${balance < 0 ? "summary-card--negative" : ""}`}
      >
        <div className="summary-card__icon">
          <Wallet size={22} />
        </div>
        <div className="summary-card__content">
          <span className="summary-card__label">Balance</span>
          <span className="summary-card__value">{formatCurrency(balance)}</span>
        </div>
      </div>
    </div>
  );
}
