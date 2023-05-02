import { ref, child, get } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../services/Firebase";

const useFetch = (path) => {
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const dbRef = ref(db);
    get(child(dbRef, path))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [path]);

  return { data, isFetching };
};

export default useFetch;
