"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, DatePicker, Select } from "antd";
import moment from "moment";
import S3UploadForm from "../S3UploadForm/uploadForm";

const { Option } = Select;

const UploadSpend = ({ finish }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const showModal = async () => {
    setIsModalOpen(true);
    const response = await fetch("/api/tags");
    const { data } = await response.json();
    setTags(data);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!values.description) values.description = "";
      values.date = moment(values.date.toDate()).format("YYYY-MM-DD");
      const formData = new FormData();
      for (var key in values) {
        formData.append(key, values[key]);
      }
      formData.append("files", files);
      await fetch("/api/spend", {
        method: "POST",
        body: formData,
      });

      setIsModalOpen(false);
      await finish();
      form.resetFields();
      setFiles([]);
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const modalFooter = [
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={handleOk} disabled={uploading}>
      Add Transaction
    </Button>,
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Transaction
      </Button>
      <Modal
        title="Add Transaction"
        open={isModalOpen}
        footer={modalFooter}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Purchase Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="title" label="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="multiple" placeholder="Select tags">
              {tags.map((item) => (
                <Option value={item.tagID} key={item.tagID}>
                  {item.tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
        <S3UploadForm setFiles={setFiles} setUploading={setUploading} />
        {files.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </Modal>
    </>
  );
};

export default UploadSpend;
