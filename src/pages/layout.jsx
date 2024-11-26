import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Menu } from "antd";
import { MailOutlined, SettingOutlined } from "@ant-design/icons";

const HeaderMenu = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [current, setCurrent] = useState("expenses");
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    navigate(e.key);
  };

  const items = [
    {
      label: "Spend",
      key: "spend",
      icon: <SettingOutlined />,
      children: [
        {
          label: "Expenses",
          key: "expenses",
        },
        {
          label: "Chart",
          key: "chart",
        },
      ],
    },
    {
      label: "Learn",
      key: "learn",
      icon: <MailOutlined />,
      children: [
        {
          label: "SQL",
          key: "sql",
        },
        {
          label: "Algorithm",
          key: "algorithm",
        },
      ],
    },
  ];
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
      style={{ position: "fixed", top: "0", width: "100%", zIndex: "2000" }}
    />
  );
};
export default function layout() {
  return (
    <div>
      <HeaderMenu />
      <div style={{ marginTop: "46px" }}>
        <Outlet /> {/* Renders the child routes' components */}
      </div>
    </div>
  );
}
