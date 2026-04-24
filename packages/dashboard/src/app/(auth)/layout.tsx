export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MediaForge</h1>
          <p className="text-gray-500 mt-1">Self-hosted media delivery</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
