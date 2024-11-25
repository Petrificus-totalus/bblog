import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";

export default function AddTag() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("tag", values.tag);
      const response = await fetch("/api/tags", {
        method: "POST",
        body: formData,
      });
      const res = await response.json();
      if (res.repeated.length > 0) {
        message.error(`Repeated tag: ${res.repeated.join(",")}`);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };
  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Tag
      </Button>
      <Modal
        title="Add Tag"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="tag" label="Tag" rules={[{ required: true }]}>
            <Input placeholder="',' to separate" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
