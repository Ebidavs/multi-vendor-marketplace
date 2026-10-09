import { useCallback, useEffect, useState } from "react";

import { getCategories } from "../services/api";

// The categories endpoint returns either a bare array or an
// envelope with `data` — accept both shapes defensively.
const extractList = (body) => {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.categories)) {
    return body.data.categories;
  }
  if (Array.isArray(body?.categories)) return body.categories;
  return null;
};

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    const loadCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const body = await getCategories();
        const list = extractList(body);

        if (!list) {
          throw new Error(
            "The category service returned an invalid response."
          );
        }

        if (isCurrent) {
          setCategories(list);
        }
      } catch (err) {
        if (isCurrent) {
          setCategories([]);
          setError(
            err.message || "Unable to load categories."
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isCurrent = false;
    };
  }, [retryToken]);

  const retry = useCallback(
    () => setRetryToken((token) => token + 1),
    []
  );

  return {
    categories,
    loading,
    error,
    retry,
  };
}

export default useCategories;
