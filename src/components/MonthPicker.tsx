import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear, getCurrentMonth } from "../utils/helpers";

interface MonthPickerProps {
  currentMonth: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ currentMonth, onChange }: MonthPickerProps) {
  const navigate = (delta: number) => {
    const [year, month] = currentMonth.split("-").map(Number);
    const d = new Date(year, month - 1 + delta);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    onChange(newMonth);
  };

  const isCurrentMonth = currentMonth === getCurrentMonth();

  return (
    <div className="month-picker">
      <button
        className="month-picker__btn"
        onClick={() => navigate(-1)}
        aria-label="Previous month"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="month-picker__label">
        {formatMonthYear(currentMonth)}
      </span>
      <button
        className="month-picker__btn"
        onClick={() => navigate(1)}
        disabled={isCurrentMonth}
        aria-label="Next month"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
