import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { Transaction, Category } from "../types";
import {
  CATEGORIES,
  getSpendingByCategory,
  getDailySpending,
  formatCurrency,
} from "../utils/helpers";

interface SpendingChartProps {
  transactions: Transaction[];
  month: string;
}

export function SpendingDonut({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const spending = getSpendingByCategory(transactions);
  const data = CATEGORIES.map((cat) => ({
    name: cat.label,
    value: spending[cat.key],
    color: cat.color,
  })).filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="chart-empty">
        <p>No expenses to visualize yet.</p>
      </div>
    );
  }

  return (
    <div className="donut-chart">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              background: "#1e1e2e",
              border: "1px solid #313244",
              borderRadius: "8px",
              color: "#cdd6f4",
              fontSize: "13px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-chart__center">
        <span className="donut-chart__total">{formatCurrency(total)}</span>
        <span className="donut-chart__label">Total Spent</span>
      </div>
      <div className="donut-chart__legend">
        {data.map((d) => (
          <div key={d.name} className="donut-chart__legend-item">
            <span
              className="donut-chart__legend-dot"
              style={{ backgroundColor: d.color }}
            />
            <span className="donut-chart__legend-name">{d.name}</span>
            <span className="donut-chart__legend-value">
              {formatCurrency(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpendingTrend({ transactions, month }: SpendingChartProps) {
  const dailyData = getDailySpending(transactions, month);
  const hasData = dailyData.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <div className="chart-empty">
        <p>No spending data to show trends.</p>
      </div>
    );
  }

  return (
    <div className="trend-chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={dailyData}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#313244"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#6c7086" }}
            tickLine={false}
            axisLine={{ stroke: "#313244" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6c7086" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v}`}
            width={50}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Spent"]}
            contentStyle={{
              background: "#1e1e2e",
              border: "1px solid #313244",
              borderRadius: "8px",
              color: "#cdd6f4",
              fontSize: "13px",
            }}
            cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
          />
          <Bar
            dataKey="amount"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
            animationBegin={0}
            animationDuration={600}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBreakdown({
  spendingByCategory,
  totalExpenses,
}: {
  spendingByCategory: Record<Category, number>;
  totalExpenses: number;
}) {
  if (totalExpenses === 0) return null;

  return (
    <div className="category-breakdown">
      {CATEGORIES.map((cat) => {
        const spent = spendingByCategory[cat.key];
        if (spent === 0) return null;
        const pct = ((spent / totalExpenses) * 100).toFixed(1);
        return (
          <div key={cat.key} className="category-breakdown__item">
            <div
              className="category-breakdown__bar"
              style={{
                width: `${pct}%`,
                backgroundColor: cat.color,
              }}
            />
            <span className="category-breakdown__label">{cat.label}</span>
            <span className="category-breakdown__pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
