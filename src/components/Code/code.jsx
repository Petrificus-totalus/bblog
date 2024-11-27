import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyIcon } from "../icons";
import styles from "./code.module.css";
export default function Code({ children, ...props }) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [copied]);
  useEffect(() => {
    // react
    props["language"] && setLanguage(props["language"]);
    // algorithm
    props["className"] && setLanguage(props["className"].replace("lang-", ""));
  }, []);
  return (
    <div className={styles.container}>
      <CopyToClipboard text={children} onCopy={() => setCopied(true)}>
        <span className={styles.icon}>{copied ? "copied" : <CopyIcon />}</span>
      </CopyToClipboard>
      <SyntaxHighlighter language={language} style={tomorrow}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
