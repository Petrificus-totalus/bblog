import React from "react";
import styles from "./review.module.css";
import axiosInstance from "../../axiosInstance";

export default function Review({ params, showDetail }) {
  const handleClick = async () => {
    const res = await axiosInstance.get(`swallow/${params.id}`);
    const { data } = res;
    showDetail(data);
    // console.log(data);
  };
  return (
    <div className={styles.reviewCard} onClick={() => handleClick()}>
      <img
        src={`https://myblogprobiotics.s3.ap-southeast-2.amazonaws.com/${params.coverImage}`}
        className={styles.coverImage}
        alt="CoverImage"
      />
      <div className={styles.info}>
        <div className={styles.restaurant}>{params.restaurant}</div>
        <div className={styles.ratingContainer}>
          <div className={styles.ratingNumber}>{params.rating}</div>
          <div className={styles.ratingCircle}></div>
        </div>
        <div className={styles.summary}>{params.summary}</div>
      </div>
    </div>
  );
}
