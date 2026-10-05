function DashboardCard({
  title,
  value,
  change,
  icon: Icon,
  currency = false,
}) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-top">
        <div className="admin-stat-icon">
          {currency ? (
            <span>₦</span>
          ) : (
            Icon && <Icon size={22} />
          )}
        </div>

        {change && (
          <span className="admin-stat-change">
            {change}
          </span>
        )}
      </div>

      <span className="admin-stat-title">
        {title}
      </span>

      <strong>{value}</strong>

      {change && (
        <small>Compared to last month</small>
      )}
    </article>
  );
}

export default DashboardCard;