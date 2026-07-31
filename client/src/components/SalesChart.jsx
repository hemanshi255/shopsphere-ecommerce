import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "../css/chart.css";

function SalesChart({ data }) {
  
  return (
    <div className="card p-2 h-100">
      <h5>Monthly Sales</h5>

      <div className="chart-scroll">
        <LineChart width={data.length * 100} height={300} data={data}>
          <CartesianGrid />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="totalSales"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  );
}

export default SalesChart;
