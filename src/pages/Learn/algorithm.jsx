import { Button, Modal, Form, Input, Select, Row, Col, Spin } from "antd";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useMarkdownEditor from "../../hook/MarkdownEditor";
import MdEditor from "react-markdown-editor-lite";
import styles from "./algorithm.module.css";
import "react-markdown-editor-lite/lib/index.css";
import Algorithmcard from "../../components/algorithmCard/algorithmcard";
import Masonry from "react-masonry-css";
import { masonryCol } from "../../lib/constant";
import Markdown from "markdown-to-jsx";
import axiosInstance from "../../axiosInstance";

import Code from "../../components/Code/code";

const { Option } = Select;

const Algorithm = () => {
  const contentRef = useRef(null);
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { markdown, setMarkdown, mdParser, handleEditorChange } =
    useMarkdownEditor();
  const [form] = Form.useForm();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedSearchTags, setSelectedSearchTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastScrollTop, setLastScrollTop] = useState(0); // 记录上次滚动的位置

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      for (var key in values) {
        formData.append(key, values[key]);
      }
      formData.append("markdown", markdown);

      await fetch("/api/algorithm", {
        method: "POST",
        body: formData,
      });

      setIsModalOpen(false);
      form.resetFields();
      setMarkdown("");
      getAlgorithms(1);
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };

  const getSelectedAlgorithm = () => {
    console.log(selectedSearchTags);
  };

  useEffect(() => {
    const getTags = async () => {
      const res = await axiosInstance.get("/algolabel");
      const { data } = res;
      console.log(data);

      setTags(data);
    };
    getTags();
  }, []);

  const loadMoreData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/algorithm?page=${currentPage + 1}`);
    const { data: newData } = await response.json();
    setData((prevData) => [...prevData, ...newData]);
    setCurrentPage((currentPage) => currentPage + 1);
    setLoading(false);
  }, [currentPage]);

  const onScroll = useCallback(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      const scrollTop = contentElement.scrollTop ?? 0;
      const isScrollingDown = scrollTop > lastScrollTop;

      setLastScrollTop(scrollTop);

      if (
        isScrollingDown &&
        contentElement.scrollTop + contentElement.clientHeight >=
          contentElement.scrollHeight - 10
      ) {
        if (!loading) {
          loadMoreData();
        }
      }
    }
  }, [loading, lastScrollTop, loadMoreData]);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", onScroll);
    }
    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll]);
  const getAlgorithms = async (page) => {
    setLoading(true);
    const res = await axiosInstance.get(`/algorithm?PageNumber=${page}`);
    const { data } = res;
    setData(data.data);
    setLoading(false);
  };

  useEffect(() => {
    getAlgorithms(1);
  }, []);
  const showModal = (item) => {
    setDetail(item);
    setIsDetailModalOpen(true);
  };
  return (
    <div className={styles.container} ref={contentRef}>
      <div className={styles.header}>
        <Button onClick={() => setIsModalOpen(true)}>Add solution</Button>
        <Select
          className={styles.selector}
          mode="multiple"
          allowClear
          placeholder="Please select"
          defaultValue={[]}
          onChange={(tags) => {
            setSelectedSearchTags(tags);
          }}
          options={tags.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />

        <Button onClick={getSelectedAlgorithm} type="primary">
          Search
        </Button>
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Form form={form}>
          <Form.Item name="tags">
            <Select
              placeholder="Select Tags"
              mode="multiple"
              // onChange={(tags) => {
              //   setSelectedTags(tags);
              // }}
              options={tags.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please input Intro",
              },
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                rules={[
                  {
                    required: true,
                    message: "Please choose Difficulty",
                  },
                ]}
              >
                <Select placeholder="Select Difficulty">
                  <Option value="easy">Easy</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="hard">Hard</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="link">
                <Input placeholder="Link" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <MdEditor
              style={{ height: "300px" }}
              value={markdown}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Spin spinning={loading}>
        <div className={styles.content}>
          <Masonry
            breakpointCols={masonryCol}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {data.map((item) => (
              <div key={item.id}>
                <Algorithmcard params={item} showDetail={showModal} />
              </div>
            ))}
          </Masonry>
        </div>
      </Spin>
      <Modal
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
        }}
        footer={null}
        width={720}
        className="modal-content"
      >
        {detail && (
          <Markdown
            options={{
              overrides: {
                code: {
                  component: Code,
                },
              },
            }}
          >
            {detail.desc}
          </Markdown>
        )}
      </Modal>
    </div>
  );
};

export default Algorithm;
