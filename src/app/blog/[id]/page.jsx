import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getApiBase } from "@/utils/api";

async function getData(id) {
  const res = await fetch(`${getApiBase()}/posts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`api-${res.status}`);
  }

  return res.json();
}

export async function generateMetadata({ params }) {
  try {
    const post = await getData(params.id);
    return {
      title: post.title,
      description: post.desc,
    };
  } catch (error) {
    return {
      title: "Blog Post",
      description: "Blog post",
    };
  }
}

const BlogPost = async ({ params }) => {
  let data;

  try {
    data = await getData(params.id);
  } catch (error) {
    console.error("Error fetching post:", error.message);

    if (error.message === "api-503") {
      return (
        <div className={styles.error}>
          <h1>Database temporarily unavailable</h1>
          <p>
            The blog database is currently offline. Free MongoDB Atlas clusters
            are automatically paused after a period of inactivity. Please resume
            the cluster and try again in a minute.
          </p>
        </div>
      );
    }

    return notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.info}>
          <h1 className={styles.title}>{data.title}</h1>
          <p className={styles.desc}>
            {data.desc}
          </p>
          <div className={styles.author}>
            <Image
              src={data.img}
              alt=""
              width={40}
              height={40}
              className={styles.avatar}
            />
            <span className={styles.username}>{data.username}</span>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={data.img}
            alt=""
            fill={true}
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.text}>
          {data.content}
        </p>
      </div>
    </div>
  );
};

export default BlogPost;