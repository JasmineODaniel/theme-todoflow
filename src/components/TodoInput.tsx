import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TodoInputProps {
  onAdd: (title: string) => void;
  loading: boolean;
}

export function TodoInput({ onAdd, loading }: TodoInputProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Create a new todo..."
          disabled={loading}
          className="todo-card pr-12"
        />
        {title && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-medium">
            |
          </span>
        )}
      </div>
      <Button type="submit" disabled={loading || !title.trim()} size="icon">
        <Plus className="h-5 w-5" />
      </Button>
    </form>
  );
}
