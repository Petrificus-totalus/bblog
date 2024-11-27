"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Rate,
  Row,
  Col,
  Carousel,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Masonry from "react-masonry-css";

import styles from "./swallow.module.css";
import { swallowMasonryCol } from "../../lib/constant";

import Review from "../../components/swallowreview/review";
import axiosInstance from "../../axiosInstance";

export default function Swallow() {
  const contentRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  const getReviews = async (page) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/swallow?PageNumber=${page}&PageSize=24`
      );
      const { data: newData, totalPages } = res.data;
      setReviews((prevData) =>
        page === 1 ? newData : [...prevData, ...newData]
      );
      setTotalPages(totalPages);
      setCurrentPage(page);
      console.log(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getReviews(1);
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFinish = async (values) => {
    const formData = new FormData();
    console.log(values);

    values.images?.forEach((file) => {
      formData.append("file", file.originFileObj);
    });
    formData.append("restaurantName", values.restaurantName);
    formData.append("rating", values.rating);
    formData.append("reviewerName", values.reviewerName);
    formData.append("summary", values.summary);
    formData.append("review", values.review);

    try {
      const response = await fetch("/api/swallow/add", {
        method: "POST",
        body: formData,
      });
      // console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Record added successfully:", data);
        setIsModalVisible(false);
        form.resetFields();
        getReviews(1);
      } else {
        console.error("Failed to add record");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const loadMoreData = useCallback(() => {
    if (!loading && currentPage < totalPages) {
      getReviews(currentPage + 1);
    }
  }, [loading, currentPage, totalPages]);
  const handleScroll = useCallback(() => {
    const contentElement = contentRef.current;
    if (
      contentElement &&
      contentElement.scrollTop + contentElement.clientHeight >=
        contentElement.scrollHeight
    ) {
      loadMoreData();
    }
  }, [loadMoreData]);

  useEffect(() => {
    contentRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      contentRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleDetail = (item) => {
    setIsDetailModalOpen(true);
    setCurrentReview(item);
    console.log(item);
  };
  return (
    <div className={styles.container} ref={contentRef}>
      <div className={styles.header}>
        <input className={styles.search} type="text" />
        <span className={styles.add} onClick={showModal}>
          add
        </span>
      </div>

      <div className={styles.content}>
        <Masonry
          breakpointCols={swallowMasonryCol}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {reviews.map((item) => (
            <div key={item.id}>
              <Review params={item} showDetail={handleDetail} />
            </div>
          ))}
        </Masonry>
      </div>
      {/* <Modal
        title="Add Review"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="restaurantName"
            label="Restaurant Name"
            rules={[
              { required: true, message: "Please input the restaurant name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="Rating"
                rules={[
                  { required: true, message: "Please rate the restaurant!" },
                ]}
              >
                <Rate allowHalf />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reviewerName"
                label="Reviewer Name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="summary"
            label="Summary"
            rules={[{ required: true, message: "Please input a summary!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="review"
            label="Review"
            rules={[{ required: true, message: "Please input your review!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="images"
            label="Upload Images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="images"
              listType="picture"
              multiple
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal> */}

      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        className={styles.modal}
        footer={null}
      >
        {currentReview && (
          <Carousel
            arrows
            dots={false}
            infinite={false}
            className={styles.carousel}
          >
            {currentReview?.links.map((item) => (
              <img
                key={item}
                alt="review"
                src={`https://myblogprobiotics.s3.ap-southeast-2.amazonaws.com/${item}`}
                className={styles.carouselImage}
              />
            ))}
          </Carousel>
        )}

        <div className={styles.detailcontent}>
          <div className={styles.detailheader}>
            <h2 className={styles.restaurant}>{currentReview?.restaurant}</h2>
            <div className={styles.ratingContainer}>
              <div className={styles.ratingNumber}>{currentReview?.rating}</div>
              <div className={styles.ratingCircle}></div>
            </div>
          </div>

          <div className={styles.review}>{currentReview?.review}</div>
        </div>
      </Modal>
    </div>
  );
}
