import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { getApiBase } from "@/utils/api";

async function getData() {
  const res = await fetch(`${getApiBase()}/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`api-${res.status}`);
  }

  return res.json();
}

const Blog = async () => {
  try {
    const data = await getData();

    return (
      <div className={styles.mainContainer}>
        {data.map((item) => (
          <Link href={`/blog/${item._id}`} className={styles.container} key={item._id}>
            <div className={styles.imageContainer}>
              <Image
                src={item.img}
                alt=""
                width={400}
                height={250}
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <h1 className={styles.title}>{item.title}</h1>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error.message);

    if (error.message === "api-503") {
      return (
        <div className={styles.error}>
          <h2>Database temporarily unavailable</h2>
          <p>
            The blog database is currently offline. Free MongoDB Atlas clusters
            are automatically paused after a period of inactivity. Please resume
            the cluster and try again in a minute.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.error}>
        <h2>Something went wrong</h2>
        <p>Unable to load the blog posts. Please try again later.</p>
      </div>
    );
  }
};

export default Blog;