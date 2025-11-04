import { Button } from "@/components/ui/button";

type FilterType = "all" | "active" | "completed";

interface TodoFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

export function TodoFilters({
  activeFilter,
  onFilterChange,
  activeCount,
  onClearCompleted,
  hasCompleted,
}: TodoFiltersProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{activeCount} items left</span>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange("all")}
          className={activeFilter === "all" ? "text-primary" : ""}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange("active")}
          className={activeFilter === "active" ? "text-primary" : ""}
        >
          Active
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange("completed")}
          className={activeFilter === "completed" ? "text-primary" : ""}
        >
          Completed
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
        className="hover:text-primary"
      >
        Clear Completed
      </Button>
    </div>
  );
}
