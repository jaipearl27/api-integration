import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

// Register the components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const BarChart = ({ data }) => {
  const options = {
    scales: {
      x: {
        type: "category", // Correct type for x-axis
        barPercentage: 0.5,
        categoryPercentage: 0.5,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'y',
        },
        zoom: {
          animation: {
            duration: 1000,
            easing: 'easeOutCubic'
          },
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
  };

  return <Bar data={data} options={options} className="min-h-[320px]" />;
};

export default BarChart;
