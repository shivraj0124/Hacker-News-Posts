import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import axios from "axios";
import SyncLoader from "react-spinners/ClipLoader";
function Home() {
  const [search, setSearch] = useState("");
  const [start, setStart] = useState(0);
  const [results, setResults] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (search) => {
    setStart(1);
    setLoader(true);
    try {
      const response = await axios.get(
        `http://hn.algolia.com/api/v1/search?query=${search}`
      );
      console.log(response.data.hits[0].objectID);
      setResults(response.data.hits);
      setSearch("");
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (id) => {
    navigate(`/post/${id}`);
  };

  const changeSearch = (e) => {
    setSearch(e.target.value);
    handleSearch(search);
  };

  const handleDate = (timeStamp) => {
    const date = parseISO(timeStamp);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    return timeAgo;
  };

  return (
    <div className="w-[100%] flex flex-col ">
      <div className="w-[100%] p-4 md:px-28 h-max flex max-md:flex-col flex-row justify-between  md:gap-x-48 bg-blue-200 sticky top-0">
        <div className="font-bold text-2xl">Hacker News</div>
        <div className="flex flex-row gap-x-4 max-md:mt-2">
          <input
            type="text"
            placeholder="Search by Title, Author"
            className="w-[100%] md:w-[560px] h-[34px] px-4 focus:outline-none"
            onChange={changeSearch}
          />
          <button
            className="px-4 bg-blue-700 text-white rounded-md hover:bg-blue-900"
            onClick={() => handleSearch(search)}
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loader ? (
        <div className="flex justify-center items-center h-screen">
          <SyncLoader color="#3b82f6" size={60} />
        </div>
      ) : (
        <div className="w-[100%] px-4 md:px-32 pt-5 h-max pb-4">
          {!start ? (
            <h2 className="font-bold text-center text-3xl mt-24 ">
              Search Hacker News Posts
            </h2>
          ) : results.length === 0 ? (
            <h2 className="font-semibold pb-5 text-center">
              {results.length} Results are found
            </h2>
          ) : (
            <h2 className="font-semibold pb-5">
              Total {results.length} Results are found
            </h2>
          )}
          {results?.map((data, index) => {
            return (
              <div
                key={index}
                className="mt-2 flex max-md:flex-col flex-col  gap-x-28 px-2 rounded-md hover:shadow-xl shadow-md py-4 overflow-hidden"
              >
                <div className="flex flex-row gap-x-2 items-center text-left w-max">
                  <h1
                    className="semi-bold text-2xl cursor-pointer"
                    onClick={() => {
                      handleClick(data.objectID);
                    }}
                  >
                    {data.title}
                  </h1>

                  <a
                    href={data.url}
                    className="font-semibold text-blue-400 mt-1 cursor-pointer"
                    target="_blank"
                  >
                    {data.url}
                  </a>
                </div>

                <div
                  className="flex flex-row gap-x-2  mt-1 text-sm text-left text-[#808080]  w-max"
                  onClick={() => {
                    handleClick(data.objectID);
                  }}
                >
                  <h5 className="cursor-pointer">{data.points} points </h5>|
                  <h5 className="cursor-pointer">{data.author} </h5>|
                  <h5 className="cursor-pointer">
                    {handleDate(`${data.updated_at}`)}
                  </h5>
                  |
                  <h5 className="cursor-pointer">
                    {data.num_comments} comments
                  </h5>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
