import axios from "axios";
import CreateSpend from "../../components/createSpend/createspend";
import React, { useEffect, useState } from "react";
import styles from "./spend.module.css";
import moment from "moment";
import { Card, Tag, Space, Table, Button, Modal, Carousel, Spin } from "antd";
import AddTag from "../../components/addTransactionTag/addTag";

export default function Expense() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [spin, setSpin] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({
    title: "",
    location: "",
    price: "",
    tags: [],
    description: "",
    links: [],
  });

  const columns = [
    {
      title: "Title",
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{parseFloat(text).toFixed(2)}</span>,
    },
    {
      title: "Tags",
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.hasDetail && (
            <Button onClick={() => showModal(record.id)}>View Details</Button>
          )}
        </Space>
      ),
    },
  ];

  const showModal = (id) => {
    axios.get(`http://localhost:5207/api/Spend/${id}`).then((res) => {
      setCurrentRecord(res.data);
      console.log(res.data);

      setIsModalVisible(true);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getTransactions = async (page) => {
    setSpin(true);

    let res = await axios.get(
      `http://localhost:5207/api/Spend?PageNumber=${page}`
    );
    // console.log(res.data);

    const { data } = res;
    setTransactions(data);

    if (data.length === 0) setTotalPages(0);
    else setTotalPages(data[0].totalPages);
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
        <div className={styles.buttons}>
          <CreateSpend finish={() => getTransactions(currentPage)} />
          <AddTag />
        </div>

        <div>
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
      </div>
      <div className={styles.content}>
        <Spin spinning={spin}>
          {transactions.map(({ createTime, total, items }) => (
            <Card
              title={moment(createTime).format("YYYY-MM-DD")}
              hoverable
              extra={<strong>{total.toFixed(2)}</strong>}
              key={createTime}
              style={{ marginBottom: "20px" }}
            >
              <Table
                columns={columns}
                dataSource={items}
                rowKey={(record) => record.title + record.location}
                showHeader={false}
                pagination={false}
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
                src={`https://myblogprobiotics.s3.ap-southeast-2.amazonaws.com/${item.link}`}
              />
            ))}
          </Carousel>
        )}
        {currentRecord?.description && <p>{currentRecord.description}</p>}
      </Modal>
    </div>
  );
}
