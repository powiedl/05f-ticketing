import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = {}) => {
    setErrors([]);
    try {
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log('doRequest err', err);
      setErrors(err?.response?.data?.errors || [err]);
    }
  };
  return { doRequest, errors };
};

export default useRequest;
