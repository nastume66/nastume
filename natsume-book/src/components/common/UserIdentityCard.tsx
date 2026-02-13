type Props = {
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  subtitle?: string;
  compact?: boolean;
  variant?: "card" | "inline";
};

export default function UserIdentityCard({
  name,
  email,
  avatarUrl,
  subtitle,
  compact = false,
  variant = "card",
}: Props) {
  const first = (name || "友").slice(0, 1);
  const size = compact ? "h-8 w-8" : "h-9 w-9";
  const cardClass =
    variant === "inline"
      ? "flex items-center gap-2"
      : "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2";
  const nameClass = variant === "inline" ? "text-sm font-medium text-zinc-800" : "text-sm font-medium text-emerald-800";
  const subClass = variant === "inline" ? "text-xs text-zinc-500" : "text-xs text-emerald-700";

  return (
    <div className={cardClass}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} className={`${size} rounded-full object-cover`} />
      ) : (
        <div className={`flex ${size} items-center justify-center rounded-full bg-amber-200 text-xs text-amber-800`}>{first}</div>
      )}
      <div className="leading-tight">
        <p className={nameClass}>{name}</p>
        {subtitle ? <p className={subClass}>{subtitle}</p> : null}
        {!subtitle && email ? <p className={subClass}>{email}</p> : null}
      </div>
    </div>
  );
}
