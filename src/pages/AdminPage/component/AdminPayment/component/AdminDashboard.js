import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import api from "../../../../../utils/api"; // API 설정 파일 가져오기
import Chart from "chart.js/auto";
import LoadingSpinner from "../../../../../common/components/LoadingSpinner";

const AdminDashboard = ({ showModal }) => {

    const [salesData, setSalesData] = useState([]);
    const [dailySalesData, setDailySalesData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProductSales = async () => {
        setLoading(true);
        try {
            const response = await api.get("/sales/product"); // GET 요청
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
            const response = await api.get("/sales/daily"); // GET 요청
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
                backgroundColor: "#5f5f5f", // 판매 금액의 배경색 (Camel Brown)
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
                position: "top", // 범례 위치
            },
        },
        scales: {
            y1: {
                type: "linear", // 기본값: 선형 축
                position: "left",
                title: {
                    display: true,
                    text: "판매 갯수",
                    font: {
                        style: "italic", // 기울임꼴
                        size: 14, // 폰트 크기
                    },
                    color: "rgba(75, 192, 192, 1)", // 폰트 색상
                },
                ticks: {
                    beginAtZero: true, // 0부터 시작
                },
            },
        },
    };

    const dailySalesChart = {
        labels: dailySalesData.map((item) => item.date), // 날짜별 라벨
        datasets: [
            {
                label: "판매 갯수",
                data: dailySalesData.map((item) => item.totalQuantity), // 날짜별 판매 갯수
                backgroundColor: "#A9B388", // 판매 갯수의 배경색 (Sage Green)
                borderColor: "#A9B388",    // 판매 갯수의 테두리색
                borderWidth: 1,
                yAxisID: "y1", // 왼쪽 Y축에 매핑
            },
            {
                label: "판매 금액",
                data: dailySalesData.map((item) => item.totalSales), // 날짜별 판매 금액
                backgroundColor: "#5f5f5f", // 판매 금액의 배경색 (Camel Brown)
                borderColor: "#5f5f5f", 
                borderWidth: 1,
                yAxisID: "y2", // 오른쪽 Y축에 매핑
            },
        ],
    };

    const dailySalesChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top", // 범례 위치
            },
        },
        scales: {
            y1: {
                type: "linear", // 기본값: 선형 축
                position: "left",
                title: {
                    display: true,
                    text: "판매 갯수",
                    font: {
                        style: "italic", // 기울임꼴
                        size: 14, // 폰트 크기
                    },
                    color: "rgba(75, 192, 192, 1)", // 폰트 색상
                },
                ticks: {
                    beginAtZero: true, // 0부터 시작
                },
            },
            y2: {
                type: "linear", // 오른쪽 Y축
                position: "right",
                title: {
                    display: true,
                    text: "판매 금액 (₩)",
                    font: {
                        style: "italic", // 기울임꼴
                        size: 14, // 폰트 크기
                    },
                    color: "rgba(153, 102, 255, 1)", // 폰트 색상
                },
                ticks: {
                    beginAtZero: true, // 0부터 시작
                },
                grid: {
                    drawOnChartArea: false, // 오른쪽 Y축 그리드 숨기기
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