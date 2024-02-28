import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelTokenSourceRef = useRef(null);

  const options = {
    method: "GET",
    url: `https://jsearch.p.rapidapi.com/${endpoint}`,
    headers: {
      "X-RapidAPI-Key": "1608be1040mshade075e2c5dcd1ep1a33c4jsn08c01b3b1f2e",
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
    params: { ...query },
    cancelToken: cancelTokenSourceRef.current,
  };

  const fetchData = async () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Operation canceled by the user.");
    }

    // Create a new cancel token for the current request
    cancelTokenSourceRef.current = axios.CancelToken.source();

    setIsLoading(true);

    try {
      const res = await axios.request(options);
      setData(res.data.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      if (axios.isCancel(e)) {
        console.log("Request canceled:");
      } else {
        setError(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Operation canceled by cleanup.");
      }
    };
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};
