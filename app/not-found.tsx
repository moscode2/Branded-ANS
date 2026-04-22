import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="block font-display font-800 text-[8rem] text-cyan/8 leading-none mb-6">404</span>
        <div className="flex justify-center mb-6"><span className="dot-pulse" /></div>
        <h1 className="font-display font-700 text-3xl text-sand tracking-tight mb-4">Page Not Found</h1>
        <p className="text-sm text-muted leading-relaxed mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          ← Return Home
        </Link>
      </div>
    </div>
  );
}