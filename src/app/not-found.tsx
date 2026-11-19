import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-night px-5 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="h-display mt-4 text-5xl text-ivory sm:text-6xl">This page has gone dark.</h1>
        <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn btn-gold mt-8">Return Home</Link>
      </div>
    </main>
  );
}
