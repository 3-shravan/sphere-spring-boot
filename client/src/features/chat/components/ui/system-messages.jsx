export function SystemMessage({ label }) {
  return (
    <div className="my-4 flex items-center justify-center">
      <span className="rounded-full bg-card/40 px-3 py-1 text-muted-foreground/50 text-xs">
        {label}
      </span>
    </div>
  )
}
