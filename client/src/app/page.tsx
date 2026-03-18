import Link from "next/link";
import { ShieldCheck, UserPlus, LogIn } from "lucide-react";

export default function AuthLandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center mb-10 mt-[-5vh]">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 text-white dark:bg-blue-500">
            <ShieldCheck size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto mt-4">
          Welcome back! Please choose your account type to proceed to the system.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full justify-center">
        {/* New Admin Card */}
        <Link
          href="/register"
          className="group relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 w-full md:w-80 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 z-10">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 z-10">
            New Admin
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 z-10 text-sm">
            Set up a new organization or create a new administrator account.
          </p>
          <div className="mt-8 w-full py-3 bg-gray-50 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400 font-semibold rounded-xl text-center group-hover:bg-blue-600 group-hover:text-white transition-colors z-10 shadow-sm group-hover:shadow-md">
            Create Account
          </div>
        </Link>

        {/* Existing Admin Card */}
        <Link
          href="/login"
          className="group relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 w-full md:w-80 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 z-10">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 z-10">
            Existing Admin
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 z-10 text-sm">
            Log in to your existing account to manage your inventory and settings.
          </p>
          <div className="mt-8 w-full py-3 bg-gray-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-center group-hover:bg-indigo-600 group-hover:text-white transition-colors z-10 shadow-sm group-hover:shadow-md">
            Sign In
          </div>
        </Link>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} Inventory Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
