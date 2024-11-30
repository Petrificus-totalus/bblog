import CreateSpend from "../../components/createSpend/createspend";
import React, { useEffect, useState } from "react";
import styles from "./expense.module.css";
import moment from "moment";
import { Card, Tag, Space, Table, Button, Modal, Carousel, Spin } from "antd";
import axiosInstance from "../../axiosInstance.js";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function Expense() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [spin, setSpin] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const isMobile = window.innerWidth <= 758;

  const columns = [
    {
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{parseFloat(text).toFixed(1)}</span>,
    },

    ...(isMobile
      ? []
      : [
          {
            key: "tags",
            dataIndex: "tags",
            render: (tags) => (
              <>
                {tags.map((tag) => (
                  <Tag color="blue" key={tag.id}>
                    {tag.tagName}
                  </Tag>
                ))}
              </>
            ),
          },
          {
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                {record.hasDetail && (
                  <Button onClick={() => showModal(record.id, record.tags)}>
                    View Details
                  </Button>
                )}
              </Space>
            ),
          },
        ]),
  ];

  const showModal = (id, tags) => {
    axiosInstance.get(`/Spend/${id}`).then((res) => {
      setCurrentRecord({ ...res.data, tags });
      setIsModalVisible(true);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getTransactions = async (page) => {
    setSpin(true);

    let res = await axiosInstance.get(`/Spend?PageNumber=${page}`);

    const { data } = res;
    console.log(data);

    setTransactions(data.data);

    setTotalPages(data.totalPages);

    setSpin(false);
  };

  useEffect(() => {
    getTransactions(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    setCurrentPage((current) => Math.max(1, current - 1));
  };

  const handleNext = () => {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CreateSpend finish={() => getTransactions(currentPage)} />

        <div className={styles.pagebuttons}>
          <Button
            style={{ marginRight: "10px" }}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
        <div className={styles.pagebuttonssmall}>
          <Button
            style={{ marginRight: "2px" }}
            onClick={handlePrev}
            disabled={currentPage === 1}
            icon={<LeftOutlined />}
          ></Button>
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            icon={<RightOutlined />}
          ></Button>
        </div>
      </div>
      <div className={styles.content}>
        <Spin spinning={spin}>
          {transactions.map(({ createTime, total, items }) => (
            <Card
              title={moment(createTime).format("YYYY-MM-DD")}
              hoverable
              extra={<strong>{total.toFixed(1)}</strong>}
              key={createTime}
              style={{ marginBottom: "20px", overflowX: "scroll" }}
            >
              <Table
                columns={columns}
                dataSource={items}
                rowKey="id"
                showHeader={false}
                pagination={false}
                onRow={(record) => ({
                  onClick: () => {
                    if (isMobile && record.hasDetail) {
                      showModal(record.id, record.tags);
                    }
                  },
                  style: {
                    cursor:
                      isMobile && record.hasDetail ? "pointer" : "not-allowed", // 根据 hasDetail 设置指针样式
                    background:
                      isMobile && record.hasDetail ? "inherit" : "#f5f5f5", // 无效行背景变灰
                  },
                })}
              />
            </Card>
          ))}
        </Spin>
      </div>
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
        {currentRecord?.pictures?.length > 0 && (
          <Carousel arrows dots={false} infinite={false}>
            {currentRecord.pictures.map((item) => (
              <img
                key={item.id}
                alt="transaction"
                src={`${process.env.REACT_APP_NEXT_AWS_S3_BASEURL}${item.link}`}
              />
            ))}
          </Carousel>
        )}
        {currentRecord?.tags?.map((item) => (
          <Tag color="blue" key={item.id}>
            {item.tagName}
          </Tag>
        ))}
        {currentRecord?.description && <p>{currentRecord.description}</p>}
      </Modal>
    </div>
  );
}
