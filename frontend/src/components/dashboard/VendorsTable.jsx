
import {
  Store,
  Power,
  PowerOff,
} from "lucide-react";

function VendorsTable({
  vendors = [],
  onStatusChange,
  updatingVendorId = null,
}) {
  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isAnyVendorUpdating =
    updatingVendorId !== null &&
    updatingVendorId !== undefined;

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Store</th>
            <th>Owner</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor) => {
            const isUpdating =
              updatingVendorId === vendor.id;

            const isActive = Boolean(vendor.isActive);

            const actionLabel = isActive
              ? "Deactivate vendor"
              : "Activate vendor";

            return (
              <tr key={vendor.id}>
                <td>
                  <div className="admin-user-cell">
                    <div className="admin-store-avatar">
                      <Store size={18} />
                    </div>

                    <strong>
                      {vendor.store || "No shop created"}
                    </strong>
                  </div>
                </td>

                <td>
                  {vendor.owner || "Vendor"}
                </td>

                <td>
                  {vendor.email || "—"}
                </td>

                <td>
                  {formatDate(vendor.createdAt)}
                </td>

                <td>
                  <span
                    className={`admin-status ${
                      isActive
                        ? "approved"
                        : "inactive"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className={
                      isActive
                        ? "admin-icon-button"
                        : "approve-vendor-button"
                    }
                    disabled={
                      isAnyVendorUpdating ||
                      !vendor.id
                    }
                    onClick={() =>
                      onStatusChange(
                        vendor.id,
                        !isActive
                      )
                    }
                    title={
                      isUpdating
                        ? "Updating vendor status..."
                        : actionLabel
                    }
                    aria-label={
                      isUpdating
                        ? "Updating vendor status"
                        : actionLabel
                    }
                    aria-busy={isUpdating}
                  >
                    {isUpdating ? (
                      <span>Updating...</span>
                    ) : isActive ? (
                      <PowerOff size={17} />
                    ) : (
                      <>
                        <Power size={16} />
                        Activate
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VendorsTable;
