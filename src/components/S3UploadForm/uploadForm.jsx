import { uploadFile } from "./action";

import React, { useState, useEffect } from "react";
import SubmitButton from "./submitButton";

const UploadForm = ({ setFiles, setUploading }) => {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setUploading(pending);
  }, [pending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    try {
      const formData = new FormData(event.target);
      formData.append("folder", "transactions");
      const result = await uploadFile(formData);
      console.log(result);
      setFiles(
        Array.isArray(result.data) ? result.data : JSON.parse(result.data)
      );
      setPending(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="file"
        style={{
          display: "inline-block",
          padding: "4px 6px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "12px",
          textAlign: "center",
          marginBottom: "10px",
          marginRight: "30px",
        }}
      >
        Select Files
      </label>
      <input
        type="file"
        id="file"
        name="file"
        accept="images/*"
        multiple
        style={{ display: "none" }}
      />
      <SubmitButton pending={pending} />
    </form>
  );
};

export default UploadForm;
