import { useState, useEffect } from "react";
import axios from "axios";

const usePosts = (id, userPosts, tagged) => {
  const [response, setResponse] = useState(null);
  const fetchData = () => {
    axios
      .post("https://stuforum.herokuapp.com/api/post/getposts", {
        user_id: id,
        user_posts: userPosts,
        tagged: tagged,
      })
      .then((res) => {
        setResponse(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response };
};

export default usePosts;
