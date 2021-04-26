import React, { useState, useEffect, useRef } from "react";
import { Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import Mentions from "rc-mentions";
import debounce from 'lodash.debounce';

const { Option } = Mentions;
export default function CreatePost({ setPosts }) {
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
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
      if(file){
        let imageFormObj = new FormData();
        imageFormObj.append("imageName", Date.now() + "postimage");
        imageFormObj.append("imageData", file);
        const res = await axios.post(`/api/posts/uploadImage`, imageFormObj);
        setPosts((prevPosts) => {
          return [res.data.newpost, ...prevPosts];
        });
      } else {
        alert("Please select an image!")
      }
    } catch (error) {
      console.log(error.message);
      if(error.response){
        alert(error.response.data)
        }
    }
  };
  const fileChangedHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const onSearch = (search) => {
    loadGithubUsers(search);
  };
  const loadGithubUsers = async (key) => {
    try {
      const res = await axios.get(`/api/users/search/${key}`);
      setUsers(res.data);
    } catch (error) {
      setUsers([]);
    }
  };
  debounce(loadGithubUsers, 1000);

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
            {/* <textarea
              value={text}
              className="form-control"
              id="message"
              onChange={(e) => setText(e.target.value)}
              rows="3"
              placeholder="What are you thinking?"
            ></textarea> */}
            <Mentions
              onSearch={onSearch}
              autoFocus
              rows={3}
              onSelect={(OptionProps) => console.log(OptionProps)}
              onChange={(text) => setText(text)}
              style={{ width: "100%" }}
              defaultValue={text}
              value={text}
            >
              {users && users.map((user) => (<Option key={user._id} value={user.email.split("@")[0]}>{user.name}</Option>))}
            </Mentions>
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
            onClick={() => (key === "text" ? submitPost() : uploadImage())}
            className="btn btn-primary"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
