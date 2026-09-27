"use client";

import { useEffect, useState } from "react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => Promise<void> | void;
}

export default function TaskModal({
  task,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(
    task?.description || ""
  );
  const [status, setStatus] = useState<TaskStatus>(
    task?.status || "TODO"
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(task);

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setStatus(task?.status || "TODO");
    setError("");
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#7A4D55]/35 px-4 py-6 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#EABEB8] bg-[#FFE4DD] shadow-2xl shadow-[#7A4D55]/20"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0C5C0] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8D7DF]">
              {isEditing ? (
                <svg
                  className="h-5 w-5 text-[#C96F87]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-[#C96F87]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#4A3035]">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>

              <p className="text-xs text-[#8C6B71]">
                {isEditing
                  ? "Update your task details"
                  : "Add something you want to accomplish"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="rounded-xl p-2 text-[#A9848A] transition hover:bg-[#F8D7DF] hover:text-[#C96F87] disabled:cursor-not-allowed disabled:opacity-50"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-6"
          noValidate
        >
          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-[#E9A9B2] bg-[#F8D7DF] px-4 py-3">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#C95F6B]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>

                <p className="text-sm font-medium text-[#A84E5B]">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-1.5 block text-sm font-semibold text-[#5A3D43]"
            >
              Task title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete project documentation"
              autoFocus
              className="w-full rounded-xl border border-[#EABEB8] bg-[#FDE9E4] px-4 py-3 text-sm text-[#4A3035] outline-none transition-all placeholder:text-[#A9848A] focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/20"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="mb-1.5 block text-sm font-semibold text-[#5A3D43]"
            >
              Description
              <span className="ml-1 font-normal text-[#A9848A]">
                (optional)
              </span>
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Add some details about this task..."
              className="w-full resize-none rounded-xl border border-[#EABEB8] bg-[#FDE9E4] px-4 py-3 text-sm leading-6 text-[#4A3035] outline-none transition-all placeholder:text-[#A9848A] focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/20"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="task-status"
              className="mb-1.5 block text-sm font-semibold text-[#5A3D43]"
            >
              Status
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["TODO", "To Do", "#B98296", "#F5DCE3"],
                  [
                    "IN_PROGRESS",
                    "In Progress",
                    "#E49A52",
                    "#FBE2CB",
                  ],
                  ["DONE", "Done", "#72A98D", "#DCEEE5"],
                ] as const
              ).map(([value, label, color, background]) => {
                const selected = status === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setStatus(value as TaskStatus)
                    }
                    className="rounded-xl border px-3 py-2.5 text-xs font-bold transition-all"
                    style={{
                      borderColor: selected ? color : "#EABEB8",
                      backgroundColor: selected
                        ? background
                        : "#FDE9E4",
                      color: selected ? color : "#8C6B71",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-[#F0C5C0] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#EABEB8] bg-[#F8D7DF] px-5 py-3 text-sm font-semibold text-[#805F66] transition hover:bg-[#F4CBD5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#F4A261] px-5 py-3 text-sm font-semibold text-[#FFF0EC] shadow-md shadow-[#C97F72]/15 transition hover:bg-[#E98F4F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFF0EC] border-t-transparent" />
              )}

              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}