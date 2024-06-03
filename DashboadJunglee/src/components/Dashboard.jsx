import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Grid } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import data from "../../eve.json"; // Import the JSON data
import ChartCard from "./ChartCard"; // Import the ChartCard component
import PieChart from "./PieChart"; // Import the PieChart componentChartCard component

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    line: { labels: [], datasets: [] },
    bar: { labels: [], datasets: [] },
    pie: { labels: [], datasets: [] },
    alertBar: { labels: [], datasets: [] },
    alertPie: { labels: [], datasets: [] },
    protoBar: { labels: [], datasets: [] },
  });

  const [showTimestamps, setShowTimestamps] = useState(true);

  const [uniqueSignatures, setUniqueSignatures] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  useEffect(() => {
    // Process the JSON data to create chart data
    const timestamps = data.map((item) => item.timestamp);
    const flowIds = data.map((item) => item.flow_id);
    const srcPorts = data.map((item) => item.src_port);
    const severities = data
      .filter((item) => item.alert && item.alert.severity !== undefined)
      .map((item) => item.alert.severity);

    // Filter alert data
    const alerts = data.filter((item) => item.alert !== undefined);
    // Extract signature and category data
    const signatureCategories = data
      .filter(
        (item) => item.alert && item.alert.signature && item.alert.category
      )
      .map((item) => ({
        signature: item.alert.signature,
        category: item.alert.category,
      }));

    // Get unique signatures and categories
    const uniqueSignatures = Array.from(
      new Set(signatureCategories.map((sc) => sc.signature))
    );
    const uniqueCategories = Array.from(
      new Set(signatureCategories.map((sc) => sc.category))
    );

    // Get proto data
    const protoData = data.map((item) => item.proto);
    const protoCounts = protoData.reduce((acc, proto) => {
      acc[proto] = (acc[proto] || 0) + 1;
      return acc;
    }, {});

    // Assign colors to unique signatures and categories
    const signatureColors = generateRandomColors(uniqueSignatures.length);
    const categoryColors = generateRandomColors(uniqueCategories.length);

    setChartData({
      line: {
        labels: showTimestamps
          ? timestamps.slice(0, Math.ceil(timestamps.length / 20))
          : [],
        datasets: [
          {
            label: "Flow ID Over Time",
            data: flowIds,
            borderColor: "#3e95cd",
            fill: false,
          },
        ],
      },
      bar: {
        labels: showTimestamps
          ? timestamps.slice(0, Math.ceil(timestamps.length / 20))
          : [],
        datasets: [
          {
            label: "Source Port Distribution",
            data: srcPorts,
            backgroundColor: "#8e5ea2",
          },
        ],
      },
      pie: {
        labels: ["Severity 1", "Severity 2", "Severity 3"],
        datasets: [
          {
            label: "Severity Distribution",
            data: [
              severities.filter((s) => s === 1).length,
              severities.filter((s) => s === 2).length,
              severities.filter((s) => s === 3).length,
            ],
            backgroundColor: ["#3cba9f", "#e8c3b9", "#c45850"],
          },
        ],
      },
      alertBar: {
        labels: showTimestamps
          ? timestamps.slice(0, Math.ceil(timestamps.length / 20))
          : [],
        datasets: [
          {
            label: "Alerts Over Time",
            data: alerts.map((item) => item.alert.severity),
            backgroundColor: "#ffcc00",
          },
        ],
      },
      alertPie: {
        labels: [...uniqueSignatures, ...uniqueCategories],
        datasets: [
          {
            label: "Signatures",
            data: uniqueSignatures.map(
              (signature) =>
                signatureCategories.filter((sc) => sc.signature === signature)
                  .length
            ),
            backgroundColor: signatureColors,
          },
          {
            label: "Categories",
            data: uniqueCategories.map(
              (category) =>
                signatureCategories.filter((sc) => sc.category === category)
                  .length
            ),
            backgroundColor: categoryColors,
          },
        ],
      },
      protoBar: {
        labels: Object.keys(protoCounts),
        datasets: [
          {
            label: "Protocol Distribution",
            data: Object.values(protoCounts),
            backgroundColor: generateRandomColors(
              Object.keys(protoCounts).length
            ),
          },
        ],
      },
    });

    setUniqueSignatures(uniqueSignatures);
    setUniqueCategories(uniqueCategories);
  }, [showTimestamps]);

  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(
        `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.6)`
      );
    }
    return colors;
  };

  const handleReloadData = () => {
    setShowTimestamps((prev) => !prev); // Toggle timestamps for demonstration
  };

  return (
    <Grid container spacing={4} sx={{ paddingTop: "60px" }}>
      <ChartCard
        title="Flow ID Over Time"
        description="Displays the flow ID over time"
        chartType={Line}
        data={chartData.line}
        onReloadData={handleReloadData}
      />
      <ChartCard
        title="Source Port Distribution"
        description="Displays the source port distribution"
        chartType={Bar}
        data={chartData.bar}
        onReloadData={handleReloadData}
      />
      <PieChart
        title="Severity Distribution"
        description="Displays severity distribution"
        chartType={Pie}
        data={chartData.pie}
        onReloadData={handleReloadData}
      />
      <ChartCard
        title="Alerts Over Time"
        description="Displays the number of alerts over time"
        chartType={Bar}
        data={chartData.alertBar}
        onReloadData={handleReloadData}
      />
      <PieChart
        title="Signature & Category Distribution"
        description="Displays the distribution of signatures and categories"
        chartType={Pie}
        data={chartData.alertPie}
        onReloadData={handleReloadData}
      />
      <ChartCard
        title="Protocol Distribution"
        description="Displays the distribution of protocols"
        chartType={Bar}
        data={chartData.protoBar}
        onReloadData={handleReloadData}
      />
    </Grid>
  );
};

export default Dashboard;
