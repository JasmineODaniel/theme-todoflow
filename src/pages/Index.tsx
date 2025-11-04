import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@/components/Auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";
import { TodoFilters } from "@/components/TodoFilters";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import heroBgLight from "@/assets/hero-bg-light.jpg";
import heroBgDark from "@/assets/hero-bg-dark.jpg";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  order_index: number;
  user_id: string;
  created_at: string;
}

type FilterType = "all" | "active" | "completed";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const { theme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTodos();

      const channel = supabase
        .channel("todos")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "todos",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchTodos();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to fetch todos");
    } else {
      setTodos(data || []);
    }
  };

  const addTodo = async (title: string) => {
    setLoading(true);
    const maxOrder = Math.max(...todos.map((t) => t.order_index), -1);

    const { error } = await supabase.from("todos").insert({
      title,
      user_id: user.id,
      order_index: maxOrder + 1,
    });

    if (error) {
      toast.error("Failed to add todo");
    }
    setLoading(false);
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update todo");
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete todo");
    }
  };

  const reorderTodos = async (reorderedTodos: Todo[]) => {
    setTodos(reorderedTodos);

    const updates = reorderedTodos.map((todo) => ({
      id: todo.id,
      order_index: todo.order_index,
    }));

    for (const update of updates) {
      await supabase
        .from("todos")
        .update({ order_index: update.order_index })
        .eq("id", update.id);
    }
  };

  const clearCompleted = async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);

    const { error } = await supabase
      .from("todos")
      .delete()
      .in("id", completedIds);

    if (error) {
      toast.error("Failed to clear completed todos");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (!user) {
    return <Auth />;
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const hasCompleted = todos.some((t) => t.completed);

  return (
    <div
      className="min-h-screen gradient-bg relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${theme === "light" ? heroBgLight : heroBgDark})`,
      }}
    >
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <div className="relative min-h-screen flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-widest">
              TODO
            </h1>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <TodoInput onAdd={addTodo} loading={loading} />

            <div className="todo-card rounded-2xl shadow-2xl overflow-hidden">
              {filteredTodos.length > 0 ? (
                <div className="p-4">
                  <TodoList
                    todos={filteredTodos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onReorder={reorderTodos}
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  {filter === "completed"
                    ? "No completed todos yet"
                    : filter === "active"
                    ? "No active todos"
                    : "No todos yet. Create one to get started!"}
                </div>
              )}

              {todos.length > 0 && (
                <div className="border-t border-border p-4">
                  <TodoFilters
                    activeFilter={filter}
                    onFilterChange={setFilter}
                    activeCount={activeCount}
                    onClearCompleted={clearCompleted}
                    hasCompleted={hasCompleted}
                  />
                </div>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Drag and drop to reorder list
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
