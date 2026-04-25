export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">MediaForge</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Self-hosted media delivery</p>
        </div>
        <div className="card p-8 dark:bg-zinc-900 dark:border-zinc-800">
          {children}
        </div>
      </div>
    </div>
  );
}
