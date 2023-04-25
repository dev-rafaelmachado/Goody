import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

function useFirebaseValue(path) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const dbRef = ref(getDatabase(), path);
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
