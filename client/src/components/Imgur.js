import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardColumns, Card } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { SRLWrapper } from "simple-react-lightbox";

function Imgur() {
  let [imgurs, setImgurs] = useState([]);
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    setPage(page + 1);
    getImgur();
  };
  async function getImgur() {
    try {
      const res = await axios.get("/api/posts/imgur/"+page);
      setImgurs(imgurs.concat(res.data));
      if (!res.data.length) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    setPage(page + 1);
    getImgur();
  }, []);
  return (
    <CardColumns>
      <InfiniteScroll
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        dataLength={imgurs.length}
        next={fetchMoreData}
        hasMore={true}
        loader={
          <h4 style={{ textAlign: "center" }}>
            <i
              className="fa fa-circle-o-notch fa-spin"
              style={{ fontSize: "24px" }}
            ></i>
            Loading...
          </h4>
        }
      >
        {imgurs &&
          imgurs.map(
            (imgur, i) =>
              //   <Card>
              imgur && (imgur.type === "image/gif" || imgur.type === "image/jpeg") && (
              <Card>
                <SRLWrapper>
                  <a href={imgur && imgur.link}>
                    <Card.Img
                      className="border p-1"
                      variant="top"
                      src={imgur && imgur.link}
                    />
                  </a>
                </SRLWrapper>
                </Card>
              )
            //   imgur && imgur.type === "video/mp4" && (
            //     <Card key={i}>
            //       <video style={{ maxWidth: "100%", height: "auto" }} controls>
            //         <source src={imgur && imgur.link} type="video/mp4" />
            //         Your browser does not support the video tag.
            //       </video>
            //     </Card>
            //   )
              //   </Card>
          )}
      </InfiniteScroll>
    </CardColumns>
  );
}

export default Imgur;
