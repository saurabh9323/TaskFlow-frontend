export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" }[size];
  return (
    <div className={`${s} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`} />
  );
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Loading…</p>
    </div>
  );
}
