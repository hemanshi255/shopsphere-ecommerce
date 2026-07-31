import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#FFC107", // Pending
  "#17A2B8", // Processing
  "#0D6EFD", // Shipped
  "#198754", // Delivered
  "#DC3545", // Cancelled
];

function OrderStatusChart({ data }) {
  if (!data || data.length === 0) {
  return (
    <div className="card p-3 h-100">

      <h5>Order Status</h5>

      <div className="chart-empty">

        <div className="chart-empty-icon">
          📦
        </div>

        <h6>No Orders Yet</h6>

        <p>
          Order status analytics will appear after customers place their first order.
        </p>

      </div>

    </div>
  );
}
  return (
    <div className="card p-2  h-100">
      <h5 className="mb-3">Order Status</h5>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrderStatusChart;