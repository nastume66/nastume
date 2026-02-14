type Props = {
  message?: string | null;
  className?: string;
};

export default function StatusText({ message, className = "" }: Props) {
  if (!message) return null;

  const tone = message.startsWith("✅")
    ? "text-emerald-600"
    : message.startsWith("❌")
      ? "text-rose-600"
      : message.startsWith("⏳")
        ? "text-amber-700"
        : "text-zinc-500";

  return <p className={`text-xs ${tone} ${className}`.trim()}>{message}</p>;
}
