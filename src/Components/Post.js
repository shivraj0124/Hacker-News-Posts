import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Comment } from "react-loader-spinner";
function Post() {
  const [results, setResults] = useState({});
  const [state, setState] = useState(false);
  let { objectId } = useParams();
  
  const getData = async () => {
    try {
      console.log(objectId, "helldco");
      const response = await axios.get(
        `http://hn.algolia.com/api/v1/items/${objectId}`
      );
      console.log(response.data);
      setResults(response.data);
      setState(true)
    } catch (err) {
      console.log(err);
    }
    
  };
  
   const handleDate = (timeStamp) => {
     const date = parseISO(timeStamp);
     const timeAgo = formatDistanceToNow(date, { addSuffix: true });

     return timeAgo;
   };

  const mapArray = (items) => {
    return items.map((data, index) => (
      <div key={index} className="pl-2 mt-4 overflow-hidden">
        <div className="flex flex-row gap-x-4 text-[#808080] text-sm">
          <h1>{data.author}</h1>|<h1>{handleDate(`${data.created_at}`)}</h1>
        </div>
        <h1 className="text-lg">{data.text}</h1>
        {data.children && data.children.length > 0
          ? mapArray(data.children)
          : null}
      </div>
    ));
  };

  useEffect(() => {
    getData();
  }, [objectId, state]);

  return (
    <div className="w-[100%] bg-blue-50">
      {!state ? (
        <div className="flex w-[100%] h-screen justify-center items-center">
          <Comment
            visible={true}
            height="80"
            width="80"
            ariaLabel="comment-loading"
            wrapperClass="comment-wrapper"
            color="#fff"
            backgroundColor="#3b82f6"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col w-[100%] bg-blue-200 px-10 p-4 sticky top-0">
            <h1 className="font-bold text-2xl">{results.title}</h1>
            <h1 className="text-lg font-semibold">{results.points} points</h1>
          </div>

          <h2 className="text-xl font-semibold md:sticky md:top-20 bg-blue-50 pl-10">
            Comments
          </h2>
          <div className="p-10">
            {results.children && results.children.length > 0
              ? mapArray(results.children)
              : null}
          </div>
        </>
      )}
    </div>
  );
}

export default Post;

