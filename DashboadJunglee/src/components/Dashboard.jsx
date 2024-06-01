import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Card, CardContent, Typography, Grid } from "@mui/material";
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
  });

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

    // Assign colors to unique signatures and categories
    const signatureColors = generateRandomColors(uniqueSignatures.length);
    const categoryColors = generateRandomColors(uniqueCategories.length);

    // Create datasets for signature and category pie charts
    const signatureData = uniqueSignatures.map((signature, index) => {
      const count = signatureCategories.filter(
        (sc) => sc.signature === signature
      ).length;
      return {
        label: signature,
        data: [count],
        backgroundColor: signatureColors[index],
      };
    });

    const categoryData = uniqueCategories.map((category, index) => {
      const count = signatureCategories.filter(
        (sc) => sc.category === category
      ).length;
      return {
        label: category,
        data: [count],
        backgroundColor: categoryColors[index],
      };
    });

    setChartData({
      line: {
        labels: timestamps,
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
        labels: timestamps,
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
        labels: timestamps,
        datasets: [
          {
            label: "Alerts Over Time",
            data: alerts.map((item) => item.alert.severity),
            backgroundColor: "#ffcc00",
          },
        ],
      },
      alertPie: {
        labels: ["Signature & Category"],
        datasets: [
          {
            label: "Signature Distribution",
            data: signatureData.map((d) => d.data[0]),
            backgroundColor: signatureData.map((d) => d.backgroundColor),
          },
          {
            label: "Category Distribution",
            data: categoryData.map((d) => d.data[0]),
            backgroundColor: categoryData.map((d) => d.backgroundColor),
          },
        ],
      },
    });
  }, []);

  const chartHeight = 300; // Adjust the height as needed

  const yAxisOptions = {
    ticks: {
      callback: function (value) {
        return value.toLocaleString(); // Format the y-axis values
      },
    },
    title: {
      display: true,
      text: "Values", // Y-axis title
    },
  };

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

  const legendOptions = {
    display: true,
    position: "bottom",
    labels: {
      generateLabels: function (chart) {
        const labels = [];
        const datasets = chart.data.datasets;
        datasets.forEach((dataset) => {
          dataset.data.forEach((dataItem, index) => {
            labels.push({
              text: `${dataset.label}: ${dataItem}`,
              fillStyle: dataset.backgroundColor[index],
            });
          });
        });
        return labels;
      },
    },
  };

  return (
    <Grid container spacing={3}>
      {/* Flow ID Over Time Chart */}
      <Grid item xs={12} md={6}>
        <Grid container justifyContent="center">
          <Grid item>
            <Card className="card" sx={{ backgroundColor: "#ffffff" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#000000" }}>
                  Flow ID Over Time
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000" }}>
                  Displays the flow ID over time
                </Typography>
                {chartData.line.labels.length > 0 ? (
                  <Line
                    data={chartData.line}
                    options={{
                      scales: {
                        y: yAxisOptions,
                      },
                    }}
                    height={chartHeight}
                  />
                ) : (
                  <Typography>Loading...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Source Port Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Grid container justifyContent="center">
          <Grid item>
            <Card className="card" sx={{ backgroundColor: "#ffffff" }}>
              <CardContent>
                <Typography
                  variant="

body2"
                  sx={{ color: "#000000" }}
                >
                  Source Port Distribution
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000" }}>
                  Displays the source port distribution
                </Typography>
                {chartData.bar.labels.length > 0 ? (
                  <Bar
                    data={chartData.bar}
                    options={{
                      scales: {
                        y: yAxisOptions,
                      },
                    }}
                    height={chartHeight}
                  />
                ) : (
                  <Typography>Loading...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Severity Distribution Pie Chart */}
      <Grid item xs={12} md={6}>
        <Grid container justifyContent="center">
          <Grid item>
            <Card className="card" sx={{ backgroundColor: "#ffffff" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#000000" }}>
                  Severity Distribution
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000" }}>
                  Displays severity distribution
                </Typography>
                {chartData.pie.labels.length > 0 ? (
                  <Pie data={chartData.pie} height={chartHeight} />
                ) : (
                  <Typography>Loading...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Alerts Over Time Bar Chart */}
      <Grid item xs={12} md={6}>
        <Grid container justifyContent="center">
          <Grid item>
            <Card className="card" sx={{ backgroundColor: "#ffffff" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#000000" }}>
                  Alerts Over Time
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000" }}>
                  Displays the number of alerts over time
                </Typography>
                {chartData.alertBar.labels.length > 0 ? (
                  <Bar
                    data={chartData.alertBar}
                    options={{
                      scales: {
                        y: yAxisOptions,
                      },
                    }}
                    height={chartHeight}
                  />
                ) : (
                  <Typography>Loading...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Signature & Category Distribution Pie Chart */}
      <Grid item xs={12} md={12}>
        <Grid container justifyContent="center">
          <Grid item>
            <Card className="card" sx={{ backgroundColor: "#ffffff" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: "#000000" }}>
                  Signature & Category Distribution
                </Typography>
                <Typography variant="body2" sx={{ color: "#000000" }}>
                  Displays the total number of alerts by signature and category
                </Typography>
                {chartData.alertPie.labels.length > 0 ? (
                  <Pie
                    data={chartData.alertPie}
                    height={chartHeight}
                    options={{
                      tooltips: {
                        callbacks: {
                          label: function (tooltipItem, data) {
                            const dataset =
                              data.datasets[tooltipItem.datasetIndex];
                            const label = dataset.labels[tooltipItem.index];
                            const value = dataset.data[tooltipItem.index];
                            return `${label}: ${value}`;
                          },
                        },
                      },
                      legend: legendOptions,
                    }}
                  />
                ) : (
                  <Typography>Loading...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
