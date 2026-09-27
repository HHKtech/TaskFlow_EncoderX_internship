"use client";

import { useState } from "react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

const STATUS_STYLES = {
  TODO: {
    badge: "bg-[#F5DCE3] text-[#A66E83]",
    dot: "bg-[#B98296]",
  },
  IN_PROGRESS: {
    badge: "bg-[#FBE2CB] text-[#B87532]",
    dot: "bg-[#E49A52]",
  },
  DONE: {
    badge: "bg-[#DCEEE5] text-[#5D927A]",
    dot: "bg-[#72A98D]",
  },
};

const STATUS_LABELS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;

    // The parent already handles the update.
    // Status is handled separately so we keep this card UI simple.
    if (status !== task.status) {
      onStatusChange(status);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setIsEditing(false);
  };

  const currentStyle = STATUS_STYLES[task.status];

  const formattedDate = new Date(task.createdAt).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  if (isEditing) {
    return (
      <article className="rounded-2xl border border-[#E9A0B3] bg-[#FDE9E4] p-4 shadow-md shadow-[#C97F72]/10">
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label
              htmlFor={`edit-title-${task.id}`}
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#805F66]"
            >
              Title
            </label>

            <input
              id={`edit-title-${task.id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#EABEB8] bg-[#F8D7DF] px-3 py-2.5 text-sm font-medium text-[#4A3035] outline-none transition focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/15"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor={`edit-description-${task.id}`}
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#805F66]"
            >
              Description
            </label>

            <textarea
              id={`edit-description-${task.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-[#EABEB8] bg-[#F8D7DF] px-3 py-2.5 text-sm text-[#4A3035] outline-none transition focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/15"
              placeholder="Add a description..."
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor={`edit-status-${task.id}`}
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#805F66]"
            >
              Status
            </label>

            <select
              id={`edit-status-${task.id}`}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as TaskStatus)
              }
              className="w-full rounded-xl border border-[#EABEB8] bg-[#F8D7DF] px-3 py-2.5 text-sm font-medium text-[#4A3035] outline-none focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/15"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 rounded-xl bg-[#F4A261] px-3 py-2.5 text-sm font-semibold text-[#FFF0EC] transition hover:bg-[#E98F4F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-[#EABEB8] bg-[#F8D7DF] px-4 py-2.5 text-sm font-semibold text-[#805F66] transition hover:bg-[#F4CBD5]"
            >
              Cancel
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group rounded-2xl border border-[#EABEB8] bg-[#FDE9E4] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#E9A0B3] hover:shadow-md hover:shadow-[#C97F72]/10">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="break-words text-sm font-bold text-[#4A3035]">
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-1.5 break-words text-xs leading-5 text-[#805F66]">
              {task.description}
            </p>
          )}
        </div>

        {/* Menu buttons */}
        <div className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-[#A9848A] transition hover:bg-[#F8D7DF] hover:text-[#C96F87]"
          >
            <svg
              className="h-4 w-4"
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
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            aria-label="Delete task"
            className="rounded-lg p-1.5 text-[#A9848A] transition hover:bg-[#F8D7DF] hover:text-[#C95F6B]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="relative">
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(e.target.value as TaskStatus)
            }
            className={`appearance-none rounded-full border-0 py-1.5 pl-3 pr-8 text-xs font-bold outline-none transition ${currentStyle.badge}`}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <span className="text-[11px] font-medium text-[#A9848A]">
          {formattedDate}
        </span>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 rounded-xl border border-[#E9A9B2] bg-[#F8D7DF] p-3">
          <p className="text-xs font-semibold text-[#8F4D59]">
            Delete this task?
          </p>

          <p className="mt-1 text-[11px] text-[#A05D68]">
            This action cannot be undone.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg bg-[#C95F6B] px-3 py-1.5 text-xs font-semibold text-[#FFF0EC] transition hover:bg-[#B94F5C]"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg bg-[#F4CBD5] px-3 py-1.5 text-xs font-semibold text-[#805F66] transition hover:bg-[#E9B7C4]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}