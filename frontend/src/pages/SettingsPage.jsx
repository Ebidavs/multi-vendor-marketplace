import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const name = user?.name?.trim() || "Customer";
  const email = user?.email || "";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        XI Market
      </p>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">
        Settings
      </h1>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Account
        </h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Signed in as
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
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            My Profile
          </Link>
          <Link
            to="/help"
            className="rounded-md border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            Help / Support
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </section>

      <p className="mt-4 text-xs text-gray-500">
        More preferences will be available here in a future
        release.
      </p>
    </main>
  );
}
