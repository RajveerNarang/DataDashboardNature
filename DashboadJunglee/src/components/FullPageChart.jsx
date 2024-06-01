// src/components/FullPageChart.jsx
import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Card, CardContent, Typography, Container, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const FullPageChart = () => {
  const location = useLocation();
  const { type, data, title, description } = location.state || {};

  if (!type || !data) {
    return (
      <Container>
        <Typography variant="h6">No chart data available.</Typography>
      </Container>
    );
  }

  const chartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
  };

  const ChartComponent = chartComponents[type];

  return (
    <Container sx={{ marginTop: 4 }}>
      <Box display="flex" justifyContent="center">
        <Card
          className="card"
          sx={{ width: "100%", maxWidth: "800px", backgroundColor: "#ffffff" }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#000000" }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000000" }}>
              {description}
            </Typography>
            <ChartComponent
              data={data}
              options={{ maintainAspectRatio: false }}
              height={400}
            />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default FullPageChart;
