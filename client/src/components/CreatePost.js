import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import Mentions from "rc-mentions";
import debounce from "lodash.debounce";
import { createPost } from "../redux/Posts/Posts.actions";
import { connect } from "react-redux";
import DynamicImg from "./DynamicImg";

const { Option } = Mentions;
function CreatePost({ createPost }) {
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [key, setKey] = useState("text");
  const [file, setFile] = useState();
  const [prefix, setPrefix] = useState("@");
  const submitPost = async () => {
    try {
      const res = await axios.post(`/api/posts`, JSON.stringify({ text }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      createPost(res.data.newpost);
      setText("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadImage = async () => {
    try {
      if (file) {
        let imageFormObj = new FormData();
        imageFormObj.append("imageName", Date.now() + "postimage");
        imageFormObj.append("imageData", file);
        const res = await axios.post(`/api/posts/uploadImage`, imageFormObj);
        createPost(res.data.newpost);
      } else {
        alert("Please select an Photo!");
      }
    } catch (error) {
      console.log(error.message);
      if (error.response) {
        alert(error.response.data);
      }
    }
  };

  const fileChangedHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const onSearch = (search, prefix) => {
    setPrefix(prefix);
    if (prefix === "@") {
      loadUsers(search);
    } else {
      loadHashTags(search);
    }
  };

  const loadUsers = async (key) => {
    try {
      const res = await axios.get(`/api/users/search/${key}`);
      setUsers(res.data);
    } catch (error) {
      setUsers([]);
    }
  };

  const loadHashTags = async (key) => {
    try {
      if (key) {
        const res = await axios.get(`/api/posts/hashtags/${key}`);
        setHashtags(res.data);
      }
    } catch (error) {
      setHashtags([]);
    }
  };

  debounce(loadUsers, 1000);
  debounce(loadHashTags, 1000);

  return (
    <div className="card mt-2 p-2 gedf-card">
      <Tabs
        fill
        activeKey={key}
        onSelect={(k) => setKey(k)}
        id="uncontrolled-tab-example"
      >
        <Tab
          eventKey="text"
          title={
            <span>
              <i className="fa fa-file-text" /> Text
            </span>
          }
        >
          <div className="form-group mt-2">
            <label className="sr-only" htmlFor="message">
              Text
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
              prefix={["@", "#"]}
              onSearch={(text, prefix) => onSearch(text, prefix)}
              autoFocus
              rows={3}
              onChange={(text) => setText(text)}
              style={{ width: "100%" }}
              className="p-2"
              defaultValue={text}
              placeholder="What are you thinking?"
              value={text}
            >
              {prefix === "@" &&
                users &&
                users.map((user) => (
                  <Option key={user._id} value={user.email.split("@")[0]}>
                    <DynamicImg
                      CSSClassName="rounded-circle mr-2"
                      imageName={user.imageName}
                      width="30"
                      height="30"
                      avatar={user.avatar}
                    />
                    {user.name}
                  </Option>
                ))}
              {prefix === "#" &&
                hashtags &&
                hashtags.map((hashtag) => (
                  <Option key={hashtag._id} value={hashtag.name.split("#")[1]}>
                    {hashtag.name}
                  </Option>
                ))}
            </Mentions>
          </div>
        </Tab>
        <Tab eventKey="images" title={
            <span>
              <i className="fa fa-file-image-o" /> Photo
            </span>
          }>
          <div className="form-group mt-2">
            <div className="custom-file">
              <input
                onChange={fileChangedHandler}
                type="file"
                className="custom-file-input"
                id="customFile"
              />
              <label className="custom-file-label" htmlFor="customFile">
                Upload Photo
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

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (payload) => dispatch(createPost(payload)),
  };
};

export default connect(null, mapDispatchToProps)(CreatePost);
