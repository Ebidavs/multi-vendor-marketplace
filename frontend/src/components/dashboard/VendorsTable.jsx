import {
  Store,
  Power,
  PowerOff,
} from "lucide-react";

function VendorsTable({
  vendors,
  onStatusChange,
}) {
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

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
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td>
                <div className="admin-user-cell">
                  <div className="admin-store-avatar">
                    <Store size={18} />
                  </div>

                  <strong>
                    {vendor.store}
                  </strong>
                </div>
              </td>

              <td>
                {vendor.owner}
              </td>

              <td>
                {vendor.email || "—"}
              </td>

              <td>
                {formatDate(
                  vendor.createdAt
                )}
              </td>

              <td>
                <span
                  className={`admin-status ${
                    vendor.isActive
                      ? "approved"
                      : "inactive"
                  }`}
                >
                  {vendor.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className={
                    vendor.isActive
                      ? "admin-icon-button"
                      : "approve-vendor-button"
                  }
                  onClick={() =>
                    onStatusChange(
                      vendor.id,
                      !vendor.isActive
                    )
                  }
                  title={
                    vendor.isActive
                      ? "Deactivate vendor"
                      : "Activate vendor"
                  }
                >
                  {vendor.isActive ? (
                    <PowerOff
                      size={17}
                    />
                  ) : (
                    <>
                      <Power
                        size={16}
                      />
                      Activate
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VendorsTable;