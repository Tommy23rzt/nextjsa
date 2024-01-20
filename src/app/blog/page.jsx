import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

async function getData() {
  const res = await fetch("https://nextjsa-three.vercel.app/api/posts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data API");
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
    // Puoi gestire l'errore in modo appropriato, ad esempio, mostrando un messaggio di errore nell'interfaccia utente.
    return <div>Error fetching data. Please try again later.</div>;
  }
};

export default Blog;
