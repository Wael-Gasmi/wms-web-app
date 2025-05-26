import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            401 Unauthorized
          </h1>
          <p className="text-gray-500">
            You don't have permission to view this page.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center rounded-md border border-gray-200 bg-white shadow-sm px-8 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          to="/"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
