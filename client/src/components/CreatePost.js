import React from "react";
import { Tabs, Tab } from "react-bootstrap";
export default function CreatePost({ submitPost, setText }) {
  return (
    <div class="card p-2 gedf-card">
      <Tabs defaultActiveKey="text" id="uncontrolled-tab-example">
        <Tab eventKey="text" title="Text">
          <div className="form-group mt-2">
            <label className="sr-only" for="message">
              post
            </label>
            <textarea
              className="form-control"
              id="message"
              onChange={(e) => setText(e.target.value)}
              rows="3"
              placeholder="What are you thinking?"
            ></textarea>
          </div>
        </Tab>
        <Tab eventKey="images" title="Images">
          <div className="form-group mt-2">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
              />
              <label className="custom-file-label" for="customFile">
                Upload image
              </label>
            </div>
          </div>
          <div className="py-4"></div>
        </Tab>
      </Tabs>
      <div class="btn-toolbar justify-content-between">
        <div class="btn-group">
          <button
            type="submit"
            onClick={() => submitPost()}
            class="btn btn-primary"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
