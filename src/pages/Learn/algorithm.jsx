import { Button, Modal, Form, Input, Select, Row, Col, Spin, Tag } from "antd";
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
  const [totalPages, setTotalPages] = useState(0);
  const [tags, setTags] = useState([]);
  const [selectedSearchTags, setSelectedSearchTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const { markdown, setMarkdown, mdParser, handleEditorChange } =
    useMarkdownEditor();
  const [form] = Form.useForm();

  const fetchTags = async () => {
    try {
      const res = await axiosInstance.get("/algolabel");
      setTags(res.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/algorithm?PageNumber=${page}&PageSize=24`
      );
      const { data: newData, totalPages } = res.data;
      setData((prevData) => (page === 1 ? newData : [...prevData, ...newData]));
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      formData.append("markdown", markdown);

      await axiosInstance.post("/algorithm", formData);
      setIsModalOpen(false);
      form.resetFields();
      setMarkdown("");
      fetchData(1); // Refresh the list
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const loadMoreData = useCallback(() => {
    if (!loading && currentPage < totalPages) {
      fetchData(currentPage + 1);
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

  const fetchDetail = async (id) => {
    try {
      const res = await axiosInstance.get(`/algorithm/${id}`);
      setDetail(res.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching detail:", error);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchData(1);
  }, []);

  return (
    <div className={styles.container} ref={contentRef}>
      <div className={styles.header}>
        <Button onClick={() => setIsModalOpen(true)}>Add Solution</Button>
        <Select
          className={styles.selector}
          mode="multiple"
          allowClear
          placeholder="Please select"
          options={tags.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          onChange={setSelectedSearchTags}
        />
        <Button type="primary" onClick={() => console.log(selectedSearchTags)}>
          Search
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form}>
          <Form.Item name="tags">
            <Select
              placeholder="Select Tags"
              mode="multiple"
              options={tags.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[{ required: true, message: "Please input Intro" }]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                rules={[
                  { required: true, message: "Please choose Difficulty" },
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
              <Algorithmcard
                key={item.id}
                params={item}
                showDetail={() => fetchDetail(item.id)}
              />
            ))}
          </Masonry>
        </div>
      </Spin>

      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={720}
        className="modal-content"
      >
        {detail && (
          <div>
            <p>{detail.desc}</p>
            <div>
              {detail.algoLabels.map((item) => (
                <Tag key={item.id}>{item.name}</Tag>
              ))}
            </div>
            <Markdown
              options={{
                overrides: {
                  code: { component: Code },
                },
              }}
            >
              {detail.content}
            </Markdown>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Algorithm;
