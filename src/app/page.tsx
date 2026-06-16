import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">🔐 Auth System Demo</h1>

        <p className="text-gray-600 mb-6">
          Next.js authentication with OTP, JWT & protected routes
        </p>

        <div className="space-y-3">


          <Link
            href="/login"
            className="block w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </Link>


        </div>
      </div>
    </main>
  );
}
