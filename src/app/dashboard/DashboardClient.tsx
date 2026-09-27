"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
};

const STATUS_COLUMNS: {
  status: TaskStatus;
  title: string;
  subtitle: string;
  color: string;
  lightColor: string;
}[] = [
  {
    status: "TODO",
    title: "To Do",
    subtitle: "Things to get started",
    color: "#B98296",
    lightColor: "#F5DCE3",
  },
  {
    status: "IN_PROGRESS",
    title: "In Progress",
    subtitle: "Currently working on",
    color: "#E49A52",
    lightColor: "#FBE2CB",
  },
  {
    status: "DONE",
    title: "Done",
    subtitle: "Completed tasks",
    color: "#72A98D",
    lightColor: "#DCEEE5",
  },
];

export default function DashboardClient({
  user,
}: {
  user: User;
}) {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTasks = async () => {
    try {
      setError("");

      const res = await fetch("/api/tasks");

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load tasks");
      }

      setTasks(data.tasks || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load tasks"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showSuccess = (message: string) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTasks((prev) => [data.task, ...prev]);
      setIsModalOpen(false);
      showSuccess("Task created successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create task"
      );
    }
  };

  const handleUpdateTask = async (
    id: string,
    updates: {
      title?: string;
      description?: string;
      status?: TaskStatus;
    }
  ) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? data.task : task
        )
      );

      setEditingTask(null);
      showSuccess("Task updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update task"
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete task");
      }

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );

      showSuccess("Task deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete task"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(
      (task) => task.status === "DONE"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;

    const todo = tasks.filter(
      (task) => task.status === "TODO"
    ).length;

    const completionRate =
      total === 0 ? 0 : Math.round((done / total) * 100);

    return {
      total,
      done,
      inProgress,
      todo,
      completionRate,
    };
  }, [tasks]);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  return (
    <main className="min-h-screen bg-[#FFF0EC] text-[#4A3035]">
      {/* Header */}
      <header className="border-b border-[#F0C5C0] bg-[#FFE4DD]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center">
            <Image
              src="/logo.png"
              alt="Task Flow"
              width={44}
              height={44}
              className="object-contain"
            />
          </div>

            <div>
              <h1 className="text-lg font-bold text-[#4A3035]">
                TaskFlow
              </h1>
              <p className="hidden text-xs text-[#8C6B71] sm:block">
                Keep your work moving
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#5A3D43]">
                {user.name}
              </p>
              <p className="text-xs text-[#9A747B]">
                {user.email}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8D7DF] text-sm font-bold text-[#C96F87]">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#EABEB8] bg-[#FDE9E4] px-3 py-2 text-sm font-semibold text-[#8B5963] transition hover:bg-[#F8D7DF] hover:text-[#A95570]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-[#C96F87]">
              Your workspace
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[#4A3035] sm:text-3xl">
              Good to see you, {user.name.split(" ")[0]}!
            </h2>

            <p className="mt-1 text-sm text-[#805F66]">
              Manage your tasks and keep your progress on track.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#F4A261] px-5 py-3 text-sm font-semibold text-[#FFF0EC] shadow-md shadow-[#C97F72]/20 transition hover:bg-[#E98F4F] hover:shadow-lg"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Task
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-[#E9A9B2] bg-[#F8D7DF] px-4 py-3">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-[#C95F6B]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>

              <p className="text-sm font-medium text-[#A84E5B]">
                {error}
              </p>
            </div>

            <button
              onClick={() => setError("")}
              className="text-[#A84E5B] hover:text-[#843D49]"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-[#B7DCCB] bg-[#DCEEE5] px-4 py-3">
            <p className="text-sm font-semibold text-[#4E7D68]">
              {success}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#F0C5C0] bg-[#FFE4DD] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9A747B]">
              Total
            </p>
            <p className="mt-1 text-2xl font-bold text-[#4A3035]">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-[#EABEB8] bg-[#FDE9E4] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9A747B]">
              To Do
            </p>
            <p className="mt-1 text-2xl font-bold text-[#B98296]">
              {stats.todo}
            </p>
          </div>

          <div className="rounded-2xl border border-[#F0C99F] bg-[#FBE2CB] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9A747B]">
              In Progress
            </p>
            <p className="mt-1 text-2xl font-bold text-[#C97B35]">
              {stats.inProgress}
            </p>
          </div>

          <div className="rounded-2xl border border-[#B7DCCB] bg-[#DCEEE5] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#648C79]">
              Completed
            </p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-2xl font-bold text-[#5D927A]">
                {stats.done}
              </p>
              <span className="text-xs font-bold text-[#5D927A]">
                {stats.completionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Task board */}
        {isLoading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-[#F0C5C0] bg-[#FFE4DD]">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" color="peach" />
              <p className="text-sm font-medium text-[#8C6B71]">
                Loading your tasks...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {STATUS_COLUMNS.map((column) => {
              const columnTasks = getTasksByStatus(column.status);

              return (
                <section
                  key={column.status}
                  className="min-h-[420px] rounded-3xl border border-[#F0C5C0] bg-[#FFE4DD] p-4 shadow-sm"
                >
                  {/* Column header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl"
                        style={{
                          backgroundColor: column.lightColor,
                        }}
                      >
                        <div
                          className="mx-auto mt-2 h-6 w-6 rounded-full"
                          style={{
                            backgroundColor: column.color,
                          }}
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#4A3035]">
                          {column.title}
                        </h3>
                        <p className="text-xs text-[#9A747B]">
                          {column.subtitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: column.lightColor,
                        color: column.color,
                      }}
                    >
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {columnTasks.length === 0 ? (
                      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#EABEB8] bg-[#FDE9E4] px-5 text-center">
                        <div
                          className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: column.lightColor,
                          }}
                        >
                          <svg
                            className="h-5 w-5"
                            style={{ color: column.color }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M9 5a3 3 0 016 0v1H9V5zM9 12h6M9 16h4"
                            />
                          </svg>
                        </div>

                        <p className="text-sm font-semibold text-[#6F5057]">
                          No tasks here
                        </p>

                        <p className="mt-1 text-xs text-[#A9848A]">
                          {column.status === "TODO"
                            ? "Add something you want to work on."
                            : column.status === "IN_PROGRESS"
                            ? "Tasks you're actively working on will appear here."
                            : "Completed tasks will appear here."}
                        </p>
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={() => setEditingTask(task)}
                          onDelete={() => handleDeleteTask(task.id)}
                          onStatusChange={(status) =>
                            handleUpdateTask(task.id, { status })
                          }
                        />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleCreateTask}
        />
      )}

      {editingTask && !isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={async (data) => {
            await handleUpdateTask(editingTask.id, data);
          }}
        />
      )}
    </main>
  );
}