import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

const PieChart = ({
  title,
  description,
  chartType: ChartComponent,
  data,
  onReloadData,
}) => {
  const chartHeight = 300;

  return (
    <Grid item xs={12} md={6}>
      <Card className="card" sx={{ backgroundColor: "#ffffff" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#000000" }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#000000" }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onReloadData}
            sx={{ marginBottom: "10px" }}
          >
            Reload Data
          </Button>
          {data.labels.length > 0 ? (
            <ChartComponent data={data} height={chartHeight} />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PieChart;
