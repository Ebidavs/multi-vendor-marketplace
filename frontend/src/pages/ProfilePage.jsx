import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  const name = user?.name?.trim() || "Customer";
  const email = user?.email || "";
  const phone =
    user?.phoneNumber || user?.phone || "";
  const role = user?.role
    ? String(user.role)
    : "customer";

  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        XI Market
      </p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">
        My Profile
      </h1>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-gray-900">
              {name}
            </p>
            {email && (
              <p className="truncate text-sm text-gray-600">
                {email}
              </p>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Full name
            </dt>
            <dd className="mt-1 text-sm text-gray-800">
              {name}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Email
            </dt>
            <dd className="mt-1 text-sm text-gray-800">
              {email || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Phone
            </dt>
            <dd className="mt-1 text-sm text-gray-800">
              {phone || "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Account type
            </dt>
            <dd className="mt-1 text-sm capitalize text-gray-800">
              {role}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            My Orders
          </Link>
          <Link
            to="/settings"
            className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            Settings
          </Link>
          <Link
            to="/products"
            className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
