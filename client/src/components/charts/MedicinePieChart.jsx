import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function MedicinePieChart() {
  const data = {
    labels: ["Taken", "Missed", "Pending"],
    datasets: [
      {
        data: [18, 3, 5],
        backgroundColor: [
          "rgba(32, 199, 207, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(91, 124, 250, 0.8)",
        ],
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
  };

  return <Pie data={data} options={options} />;
}

export default MedicinePieChart;