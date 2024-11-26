import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import axiosInstance from "../../axiosInstance";
import moment from "moment";

export default function SpendingsChart({ item }) {
  const [x, setX] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(`/spendchart/${item}`);
      const { data } = res;
      console.log(data);
      const xData = data.map((i) => {
        return item === "month"
          ? i["createTime"]
          : moment(i["createTime"]).format("YYYY-MM-DD");
      });
      const seriesData = data.map((i) => i["price"]);
      setX(xData);
      setSeries(seriesData);
    };
    fetchData();
  }, [item]);

  useEffect(() => {
    const chart = echarts.init(document.getElementById("mainChart" + item)); // 确保ID唯一
    chart.setOption({
      xAxis: {
        // type: "category",
        data: x,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: series,
          type: "line",
          label: {
            show: true,
            position: "top",
          },
        },
      ],
    });

    return () => {
      chart.dispose();
    };
  }, [series]);

  return (
    <div
      id={"mainChart" + item}
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
}
