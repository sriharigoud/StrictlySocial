import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import axios from "axios";
export default function CreatePost({ setPosts }) {
  const [text, setText] = useState("");
  const [key, setKey] = useState("text");
  const [file, setFile] = useState();

  const submitPost = async () => {
    try {
      const res = await axios.post(`/api/posts`, JSON.stringify({ text }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPosts((prevPosts) => {
        return [res.data.newpost, ...prevPosts];
      });
      setText("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadImage = async () => {
    try {
      let imageFormObj = new FormData();
      imageFormObj.append('imageName', Date.now()+"postimage");
      imageFormObj.append('imageData', file);
      const res = await axios.post(`/api/posts/uploadImage`, imageFormObj);
      setPosts((prevPosts) => {
        return [res.data.newpost, ...prevPosts];
      });
      setText("");
    } catch (error) {
      console.log(error.message);
    }
  };
  const fileChangedHandler = (event) => {
    setFile(event.target.files[0])
  }
  
  return (
    <div className="card p-2 gedf-card">
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="text" title="Text">
          <div className="form-group mt-2">
            <label className="sr-only" htmlFor="message">
              post
            </label>
            <textarea
              value={text}
              className="form-control"
              id="message"
              onChange={(e) => setText(e.target.value)}
              rows="3"
              placeholder="What are you thinking?"
            ></textarea>
          </div>
        </Tab>
        <Tab eventKey="images" title="Image">
          <div className="form-group mt-2">
            <div className="custom-file">
              <input
                onChange={fileChangedHandler}
                type="file"
                className="custom-file-input"
                id="customFile"
              />
              <label className="custom-file-label" htmlFor="customFile">
                Upload image
              </label>
            </div>
          </div>
          <div className="py-4"></div>
        </Tab>
      </Tabs>
      <div className="btn-toolbar justify-content-between">
        <div className="btn-group">
          <button
            type="submit"
            onClick={() => key === "text" ? submitPost() : uploadImage()}
            className="btn btn-primary"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
