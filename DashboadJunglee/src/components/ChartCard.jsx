import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

const ChartCard = ({
  title,
  description,
  chartType: ChartComponent,
  data,
  onReloadData,
}) => {
  const chartHeight = 300;

  const yAxisOptions = {
    ticks: {
      callback: function (value) {
        return value.toLocaleString();
      },
    },
    title: {
      display: true,
      text: "Volume",
    },
  };

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
            <ChartComponent
              data={data}
              options={{ scales: { y: yAxisOptions } }}
              height={chartHeight}
            />
          ) : (
            <Typography>Loading...</Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ChartCard;
