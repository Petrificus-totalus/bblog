import React, { useState } from "react";
import { Tabs } from "antd";
import SpendingsChart from "../../components/SpendingsChart/spendingsChart"; // 使用前面创建的图表组件

const { TabPane } = Tabs;

const Chart = () => {
  const [activeTab, setActiveTab] = useState("day");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Tabs defaultActiveKey="day" onChange={handleTabChange}>
      {/* <TabPane tab="Weekly" key="week">
        {activeTab === "week" && <SpendingsChart item="week" />}
      </TabPane> */}
      <TabPane tab="Monthly" key="month">
        {activeTab === "month" && <SpendingsChart item="month" />}
      </TabPane>
      <TabPane tab="Daily" key="day">
        {activeTab === "day" && <SpendingsChart item="day" />}
      </TabPane>
    </Tabs>
  );
};

export default Chart;
