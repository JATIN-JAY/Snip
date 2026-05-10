import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RedirectHandler = () => {
  const { shortId } = useParams();

  useEffect(() => {
    window.location.replace(
      `${import.meta.env.VITE_BACKEND_URL}/${shortId}`
    );
  }, [shortId]);

  return null;
};

export default RedirectHandler;