import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/Firebase";
function useFirebaseValue(path) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const dbRef = ref(db, path);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      setValue(snapshot.val());
    });
    return () => {
      unsubscribe();
    };
  }, [path]);
  return value;
}

export default useFirebaseValue;
