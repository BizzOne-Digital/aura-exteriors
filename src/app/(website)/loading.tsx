export default function Loading() {
  return (
    <div className="grid min-h-svh place-items-center bg-night" role="status" aria-label="Loading">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
    </div>
  );
}
