import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Transaction, Category, TransactionType } from "../types";
import { CATEGORIES, getCurrentMonth } from "../utils/helpers";
import { CategoryIcon } from "./CategoryBadge";

interface TransactionFormProps {
  onAdd: (tx: Omit<Transaction, "id">) => void;
  currentMonth: string;
}

export function TransactionForm({ onAdd, currentMonth }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    const month = currentMonth || getCurrentMonth();
    const day = String(now.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0 || !description.trim()) return;

    onAdd({
      type,
      amount: parsedAmount,
      category,
      description: description.trim(),
      date,
    });

    setAmount("");
    setDescription("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        className="fab"
        onClick={() => setIsOpen(true)}
        aria-label="Add transaction"
      >
        <Plus size={24} />
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Add Transaction</h2>
          <button
            className="modal__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="type-toggle">
            <button
              type="button"
              className={`type-toggle__btn ${type === "expense" ? "type-toggle__btn--active type-toggle__btn--expense" : ""}`}
              onClick={() => setType("expense")}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-toggle__btn ${type === "income" ? "type-toggle__btn--active type-toggle__btn--income" : ""}`}
              onClick={() => setType("income")}
            >
              Income
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <div className="amount-input">
              <span className="amount-input__prefix">$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="category-picker">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`category-picker__item ${category === cat.key ? "category-picker__item--active" : ""}`}
                  style={{ "--cat-color": cat.color } as React.CSSProperties}
                  onClick={() => setCategory(cat.key)}
                >
                  <CategoryIcon category={cat.key} size={20} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Add {type === "income" ? "Income" : "Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
