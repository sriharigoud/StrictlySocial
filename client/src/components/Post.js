import React, { useState } from "react";
import ReactTimeAgo from "react-time-ago";
import Linkify from "linkifyjs/react";
import { SRLWrapper } from "simple-react-lightbox";
import * as linkify from "linkifyjs";
import urlParser from "js-video-url-parser";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import Mentions from "rc-mentions";
import axios from "axios";
import debounce from "lodash.debounce";
import ProfileLink from "./ProfileLink";
import DynamicImg from "./DynamicImg";
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
  commentText,
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
  function validateYouTubeUrl(url) {
    let res = urlParser.parse(url);
    if (res) {
      if (res.provider === "youtube") {
        return "https://www.youtube.com/embed/" + res.id;
      } else if (res.provider === "vimeo") {
        return "https://player.vimeo.com/video/" + res.id;
      } else if (res.provider === "ted") {
        return "https://embed.ted.com/talks/" + res.id;
      } else if (res.provider === "dailymotion") {
        return "https://www.dailymotion.com/embed/video/" + res.id;
      }
    }
  }
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
  const UrlEnhancer = (url) => {
    const src = validateYouTubeUrl(url);
    if (src) {
      return <p><iframe height="300" className="w-100 border-0" title={src} src={src} /></p>;
    }

    return ("");
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
              <DynamicImg
                imageName={post.user.imageName}
                CSSClassName="rounded-circle mr-2"
                width="45"
                height="45"
                avatar={post.user.avatar}
              />
            </div>
            <div className="ml-2">
              <div className="h5 m-0">
                <ProfileLink
                  id={post.user && post.user.email.split("@")[0]}
                  name={post.name}
                />{" "}
                {post.owner && (
                  <span>
                    Shared{" "}
                    <ProfileLink
                      id={post.owner && post.owner.email.split("@")[0]}
                      name={post.owner.name}
                    />
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
        <div title={post.date} className="text-muted h7 mb-1">
          <i className="fa fa-clock-o"></i>{" "}
          <ReactTimeAgo date={new Date(post.date)} />
        </div>

        {post.text && (
          <div className="card-text">
            {/* <ReactHashtag onHashtagClick={val => alert(val)}> */}
            <Linkify options={linkifyOptions} component={UrlEnhancer}>
              {post.text}
            </Linkify>
            {/* </ReactHashtag> */}
            {post.linkData && post.linkData.url && !validateYouTubeUrl(post.linkData.url) && (
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
            {post.linkData && validateYouTubeUrl(post.linkData.url) && UrlEnhancer(post.linkData && post.linkData.url)}
          </div>
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
        <a role="button" className="card-link" onClick={() => toggleLike(post)}>
          <i className="fa fa-gittip"></i>
          {post.likes &&
          post.likes.some((className) => className.user === userId)
            ? " Unlike"
            : " Like"}
          ({post && post.likes && post.likes.length})
        </a>
        <a role="button" className="card-link" onClick={toggleComment}>
          <i className="fa fa-comment"></i> Comment (
          {post.comments && post.comments.length})
        </a>
        <a
          role="button"
          href="#"
          onClick={() => sharePost(post)}
          className="card-link"
        >
          <i className="fa fa-mail-forward"></i> Share
        </a>
        {showComments && (
          <div className="comments mt-2 border-top">
            <div className="d-flex flex-row add-comment-section my-2">
              <DynamicImg
                imageName={currentUser.imageName}
                CSSClassName="rounded-circle mr-2"
                width="40"
                height="40"
                avatar={currentUser.avatar}
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
                    <div className="pt-2 ">
                      <span className="round">
                        <DynamicImg
                          imageName={comment.user.imageName}
                          CSSClassName="rounded-circle mr-2"
                          width="50"
                          height="50"
                          avatar={comment.user.avatar}
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
                        <span
                          title={comment.date}
                          className="date border-bottom text-muted"
                        >
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={new Date(comment.date)} />
                        </span>
                      </div>
                      <p className="my-1">
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
