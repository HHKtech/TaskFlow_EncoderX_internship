export default function LoadingSpinner({
  size = "md",
  color = "peach",
}: {
  size?: "sm" | "md" | "lg";
  color?: "white" | "blue" | "gray" | "peach" | "pink";
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  };

  const colors = {
    white: "border-[#FFF0EC] border-t-transparent",
    blue: "border-[#F4A261] border-t-transparent",
    gray: "border-[#A9848A] border-t-transparent",
    peach: "border-[#F4A261] border-t-transparent",
    pink: "border-[#C96F87] border-t-transparent",
  };

  return (
    <div
      className={`${sizes[size]} ${colors[color]} inline-block rounded-full border-2 animate-spin`}
      aria-label="Loading"
    />
  );
}