import { Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency, formatDate } from "../utils/helpers";
import { CategoryBadge } from "./CategoryBadge";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet this month.</p>
        <p className="empty-state__hint">Tap the + button to add one!</p>
      </div>
    );
  }

  const sorted = [...transactions].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  );

  // Group by date
  const groups = new Map<string, Transaction[]>();
  for (const tx of sorted) {
    const existing = groups.get(tx.date);
    if (existing) {
      existing.push(tx);
    } else {
      groups.set(tx.date, [tx]);
    }
  }

  return (
    <div className="transaction-list">
      {Array.from(groups.entries()).map(([date, txs]) => (
        <div key={date} className="transaction-group">
          <div className="transaction-group__date">{formatDate(date)}</div>
          {txs.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div className="transaction-item__icon">
                {tx.type === "income" ? (
                  <ArrowUpRight size={18} className="icon--income" />
                ) : (
                  <ArrowDownRight size={18} className="icon--expense" />
                )}
              </div>
              <div className="transaction-item__details">
                <span className="transaction-item__desc">{tx.description}</span>
                <CategoryBadge category={tx.category} size="sm" />
              </div>
              <div className="transaction-item__right">
                <span
                  className={`transaction-item__amount ${
                    tx.type === "income"
                      ? "transaction-item__amount--income"
                      : "transaction-item__amount--expense"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
                <button
                  className="transaction-item__delete"
                  onClick={() => onDelete(tx.id)}
                  aria-label={`Delete ${tx.description}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
