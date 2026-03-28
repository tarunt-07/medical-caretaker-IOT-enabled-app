import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function RecoveryBarChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Recovery Score",
        data: [58, 64, 70, 74, 82, 88],
        backgroundColor: "rgba(32, 199, 207, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#eaf6ff" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#d8e8f2" },
      },
      y: {
        ticks: { color: "#d8e8f2" },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default RecoveryBarChart;