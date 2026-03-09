import type { Category } from "../types";
import { getCategoryInfo } from "../utils/helpers";
import { Home, UtensilsCrossed, Car, Gamepad2, Zap } from "lucide-react";

const iconMap = {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  Zap,
};

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md";
}

export function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const info = getCategoryInfo(category);
  const Icon = iconMap[info.icon as keyof typeof iconMap];
  const iconSize = size === "sm" ? 14 : 18;

  return (
    <span
      className={`category-badge category-badge--${size}`}
      style={{ "--cat-color": info.color } as React.CSSProperties}
    >
      <Icon size={iconSize} />
      <span>{info.label}</span>
    </span>
  );
}

export function CategoryIcon({
  category,
  size = 18,
}: {
  category: Category;
  size?: number;
}) {
  const info = getCategoryInfo(category);
  const Icon = iconMap[info.icon as keyof typeof iconMap];
  return <Icon size={size} style={{ color: info.color }} />;
}
