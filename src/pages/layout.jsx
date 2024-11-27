import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { ReadOutlined, DollarOutlined, ShopOutlined } from "@ant-design/icons";

const HeaderMenu = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const location = useLocation(); // Hook to get the current location
  const [current, setCurrent] = useState(location.pathname.slice(1)); // Initialize with current path

  // Sync current with the location path
  useEffect(() => {
    setCurrent(location.pathname.slice(1)); // Remove leading '/'
  }, [location]);

  const onClick = (e) => {
    setCurrent(e.key); // Update current state
    navigate(`/${e.key}`); // Navigate to the selected path
  };

  const items = [
    {
      label: "Spend",
      key: "spend",
      icon: <DollarOutlined />,
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
      icon: <ReadOutlined />,
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
    {
      label: "Swallow",
      key: "swallow",
      icon: <ShopOutlined />,
    },
  ];

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]} // Highlight the current menu item
      mode="horizontal"
      items={items}
      style={{ position: "fixed", top: "0", width: "100%", zIndex: "2000" }}
    />
  );
};

export default function Layout() {
  return (
    <div>
      <HeaderMenu />
      <div style={{ marginTop: "46px" }}>
        <Outlet /> {/* Renders the child routes' components */}
      </div>
    </div>
  );
}
