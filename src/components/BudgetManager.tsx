import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import type { Budget, Category } from "../types";
import { getCategoryInfo, formatCurrency, CATEGORIES } from "../utils/helpers";
import { CategoryIcon } from "./CategoryBadge";

interface BudgetManagerProps {
  budgets: Budget[];
  spendingByCategory: Record<Category, number>;
  onUpdateBudget: (category: Category, limit: number) => void;
}

export function BudgetManager({
  budgets,
  spendingByCategory,
  onUpdateBudget,
}: BudgetManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (category: Category, currentLimit: number) => {
    setEditingCategory(category);
    setEditValue(String(currentLimit));
  };

  const handleSave = (category: Category) => {
    const value = parseFloat(editValue);
    if (value > 0) {
      onUpdateBudget(category, value);
    }
    setEditingCategory(null);
  };

  return (
    <div className="budget-manager">
      {CATEGORIES.map((cat) => {
        const budget = budgets.find((b) => b.category === cat.key);
        const limit = budget?.limit ?? 0;
        const spent = spendingByCategory[cat.key] ?? 0;
        const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const overBudget = spent > limit && limit > 0;
        const info = getCategoryInfo(cat.key);

        return (
          <div
            key={cat.key}
            className={`budget-item ${overBudget ? "budget-item--over" : ""}`}
          >
            <div className="budget-item__header">
              <div className="budget-item__category">
                <CategoryIcon category={cat.key} size={18} />
                <span>{info.label}</span>
              </div>
              <div className="budget-item__amounts">
                <span
                  className={`budget-item__spent ${overBudget ? "budget-item__spent--over" : ""}`}
                >
                  {formatCurrency(spent)}
                </span>
                <span className="budget-item__separator">/</span>
                {editingCategory === cat.key ? (
                  <div className="budget-item__edit">
                    <span className="budget-item__edit-prefix">$</span>
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave(cat.key);
                        if (e.key === "Escape") setEditingCategory(null);
                      }}
                      autoFocus
                      min="1"
                    />
                    <button
                      className="budget-item__save"
                      onClick={() => handleSave(cat.key)}
                      aria-label="Save budget"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="budget-item__limit-btn"
                    onClick={() => handleEdit(cat.key, limit)}
                    aria-label={`Edit ${info.label} budget`}
                  >
                    {formatCurrency(limit)}
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            </div>
            <div className="budget-item__bar">
              <div
                className={`budget-item__fill ${overBudget ? "budget-item__fill--over" : ""}`}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: overBudget ? "#ef4444" : info.color,
                }}
              />
            </div>
            {overBudget && (
              <span className="budget-item__warning">
                Over budget by {formatCurrency(spent - limit)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
