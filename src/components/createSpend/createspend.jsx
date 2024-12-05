import React, { useState } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../axiosInstance";

const { Option } = Select;

const UploadSpend = ({ finish }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [fileList, setFileList] = useState([]);

  const showModal = async () => {
    setIsModalOpen(true);
    const response = await axiosInstance.get("/tags");
    const { data } = response;
    setTags(data);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!values.Description) values.Description = "";
      values.CreateTime = values.CreateTime.format("YYYY-MM-DD");
      console.log("values", values);

      // Upload images to S3
      const uploadedImages = await Promise.all(
        fileList.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file.originFileObj);
          const res = await axiosInstance.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure proper headers
            },
          }); // Replace with your S3 API endpoint

          return res.data.url; // Assuming your API returns the S3 URL
        })
      );

      const payload = {
        ...values,
        PictureLinks: uploadedImages, // Attach uploaded images' URLs
      };

      await axiosInstance.post("/spend", payload);

      form.resetFields();
      setFileList([]);
      setIsModalOpen(false);
      finish();
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const modalFooter = [
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={handleOk}>
      Add Transaction
    </Button>,
  ];

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Transaction
      </Button>
      <Modal open={isModalOpen} footer={modalFooter} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="CreateTime" label="Purchase Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="Title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="Location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="Price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="Tags" label="Tags">
            <Select mode="multiple" placeholder="Select tags">
              {tags.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.tagName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="Description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Upload Pictures">
            <Upload
              multiple
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent automatic upload
            >
              {fileList.length >= 5 ? null : <PlusOutlined />}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UploadSpend;
