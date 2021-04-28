import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import Linkify from "linkifyjs/react";
import { SRLWrapper } from "simple-react-lightbox";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import Mentions from "rc-mentions";
import axios from "axios";
import debounce from "lodash.debounce";
const { Option } = Mentions;

hashtag(linkify);
mention(linkify);
export default function Post({
  post,
  toggleLike,
  userId,
  submitComment,
  setCommentText,
  deletePost,
  sharePost,
  deleteComment,
  currentUser,
  commentText
}) {
  const [users, setUsers] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const toggleComment = () => setShowComments(!showComments);
  var linkifyOptions = {
    formatHref: function (href, type) {
      if (type === "hashtag") {
        return "/search/" + href.substring(1);
      }

      if (type === "mention") {
        return "/profile" + href;
      }
      return href;
    },
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
  const UrlEnhancer = (props) => {
    const { url } = props;
    return (
      <a href={url} rel="noopener noreferrer" target="_blank">
        {url}
      </a>
    );
  };
  return (
    <div className="card my-2 gedf-card">
      <div className="card-header">
        {post.user._id === userId && (
          <span className="float-right action-icons mr-2">
            <a role="button" onClick={() => deletePost(post)} title="Delete">
              <i className="fa fa-remove"></i>
            </a>
          </span>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-between align-items-center">
            <div className="mr-2">
              <img
                onError={(e) => e.target.src = post.user.avatar}
                className="rounded-circle"
                width="45"
                src={post.user.imageData ? post.user.imageData : post.user.avatar}
                alt=""
              />
            </div>
            <div className="ml-2">
              <div className="h5 m-0">
                <Link to={`/profile/${post.user._id}`}>{post.name}</Link>{" "}
                {post.owner && (
                  <span>
                    Shared{" "}
                    <Link to={`/profile/${post.owner._id}`}>
                      {post.owner.name}
                    </Link>
                    's Post
                  </span>
                )}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="py-2 card-body">
        <div className="text-muted h7 mb-1">
          <i className="fa fa-clock-o"></i> <ReactTimeAgo date={post.date} />
        </div>
        <a className="card-link" href="#">
          <h5 className="card-title">{post.title}</h5>
        </a>

        {post.text && (
          <p className="card-text">
            {/* <ReactHashtag onHashtagClick={val => alert(val)}> */}
            <Linkify options={linkifyOptions} component={UrlEnhancer}>
              {post.text}
            </Linkify>
            {/* </ReactHashtag> */}
            {post.linkData && post.linkData.url && (
              <a
                className="card p-2"
                style={{ textDecoration: "none" }}
                href={post.linkData.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div>
                  {post.linkData.ogImage && (
                    <img className="w-100" src={post.linkData.ogImage} alt="" />
                  )}
                  {post.linkData.title && <h5>{post.linkData.title}</h5>}
                  {post.linkData.description && (
                    <p className="text-muted small">
                      {post.linkData.description}
                    </p>
                  )}
                </div>
              </a>
            )}
          </p>
        )}
        {post.imageName !== "none" && (
          <SRLWrapper>
            <a href={post.imageData}>
              <img
                onError={(e) =>
                  (e.target.src =
                    process.env.PUBLIC_URL + "/img/no-image-available_1.jpg")
                }
                className="w-100"
                src={post.imageData}
                alt=""
              />
            </a>
          </SRLWrapper>
        )}
      </div>
      <div className="card-footer">
        <a className="card-link" onClick={() => toggleLike(post)}>
          <i className="fa fa-gittip"></i>
          {post.likes &&
          post.likes.some((className) => className.user === userId)
            ? " Unlike"
            : " Like"}
          ({post && post.likes && post.likes.length})
        </a>
        <a className="card-link" onClick={toggleComment}>
          <i className="fa fa-comment"></i> Comment (
          {post.comments && post.comments.length})
        </a>
        <a href="#" onClick={() => sharePost(post)} className="card-link">
          <i className="fa fa-mail-forward"></i> Share
        </a>
        {showComments && (
          <div className="comments mt-2 border-top">
            <div className="d-flex flex-row add-comment-section my-2">
              <img
                onError={(e) => e.target.src = currentUser.avatar}
                className="img-fluid img-responsive rounded-circle mr-2"
                src={currentUser.imageData ? currentUser.imageData : currentUser.avatar}
                width="38"
                alt=""
              />
              {/* <input
                type="text"
                onChange={(e) => setCommentText(e.target.value)}
                className="form-control mr-3"
                placeholde
                r="Add comment"
              /> */}
              <Mentions
                onSearch={onSearch}
                autoFocus
                placeholder="Add comment"
                rows={1}
                className="form-control mr-3"
                onChange={(text) => setCommentText(text)}
                value={commentText}
                style={{ width: "100%" }}
              >
                {users &&
                  users.map((user) => (
                    <Option key={user._id} value={user.email.split("@")[0]}>
                      {user.name}
                    </Option>
                  ))}
              </Mentions>
              <button
                onClick={() => submitComment(post)}
                className="btn btn-primary"
                type="button"
              >
                Comment
              </button>
            </div>
            <div className="comment-section">
              {post.comments &&
                post.comments.map((comment, i) => (
                  <div
                    key={i}
                    className="d-flex border-top pt-1 flex-row comment-row"
                  >
                    <div className="p-2">
                      <span className="round">
                        <img
                          onError={(e) => e.target.src = comment.user.avatar}
                          className="img-fluid img-responsive rounded-circle"
                          src={comment.user.imageData ? comment.user.imageData : comment.user.avatar}
                          alt="user"
                          width="50"
                        />
                      </span>
                    </div>
                    <div className="comment-text w-100">
                      {comment.user._id === userId && (
                        <span className="float-right action-icons mr-2">
                          <a
                            role="button"
                            onClick={() => deleteComment({ post, comment })}
                            title="Delete"
                          >
                            <i className="fa fa-remove"></i>
                          </a>
                        </span>
                      )}
                      <h5 className="mb-0">{comment.name}</h5>
                      <div className="comment-footer">
                        <span className="date text-muted">
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={comment.date} />
                        </span>
                      </div>
                      <p className="my-0">
                        {" "}
                        <Linkify
                          options={linkifyOptions}
                          component={UrlEnhancer}
                        >
                          {comment.text}
                        </Linkify>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* <a className="card-link">
          <i className="fa fa-mail-forward"></i> Share
        </a> */}
      </div>
    </div>
  );
}
