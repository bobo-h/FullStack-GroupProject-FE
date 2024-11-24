import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import api from "../../../../../utils/api";
import LoadingSpinner from "../../../../../common/components/LoadingSpinner";

const AdminDashboard = ({ showModal }) => {
  const [salesData, setSalesData] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductSales = async () => {
    setLoading(true);
    try {
      const response = await api.get("/sales/product");
      const result = response.data;

      if (result.status === "success") {
        setSalesData(result.data);
      } else {
        console.error("Failed to fetch data:", result.error);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailySales = async () => {
    setLoading(true);
    try {
      const response = await api.get("/sales/daily");
      const result = response.data;
      if (result.status === "success") {
        setDailySalesData(result.data);
      } else {
        console.error("Failed to fetch data:", result.error);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchProductSales();
      fetchDailySales();
    }
  }, [showModal]);

  const productSalesChart = {
    labels: salesData.map((item) => item.productName),
    datasets: [
      {
        label: "판매 금액",
        data: salesData.map((item) => item.totalSales),
        backgroundColor: "#5f5f5f",
        borderColor: "#5f5f5f",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "판매 갯수",
          font: {
            style: "italic",
            size: 14,
          },
          color: "rgba(75, 192, 192, 1)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  const dailySalesChart = {
    labels: dailySalesData.map((item) => item.date),
    datasets: [
      {
        label: "판매 갯수",
        data: dailySalesData.map((item) => item.totalQuantity),
        backgroundColor: "#A9B388",
        borderColor: "#A9B388",
        borderWidth: 1,
        yAxisID: "y1",
      },
      {
        label: "판매 금액",
        data: dailySalesData.map((item) => item.totalSales),
        backgroundColor: "#5f5f5f",
        borderColor: "#5f5f5f",
        borderWidth: 1,
        yAxisID: "y2",
      },
    ],
  };

  const dailySalesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y1: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "판매 갯수",
          font: {
            style: "italic",
            size: 14,
          },
          color: "rgba(75, 192, 192, 1)",
        },
        ticks: {
          beginAtZero: true,
        },
      },
      y2: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "판매 금액 (₩)",
          font: {
            style: "italic",
            size: 14,
          },
          color: "rgba(153, 102, 255, 1)",
        },
        ticks: {
          beginAtZero: true,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div>
      <div>
        {loading ? (
          <div className="text-align-center">
            <LoadingSpinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </LoadingSpinner>
          </div>
        ) : (
          <>
            <div>
              <Bar data={productSalesChart} options={{ responsive: true }} />
            </div>
            <div>
              <Bar data={dailySalesChart} options={{ responsive: true }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
