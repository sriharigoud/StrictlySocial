import React from "react";
import { Link } from "react-router-dom";
// import ReactTimeAgo from "react-time-ago";

export default function Post({
  post,
  toggleLike,
  userId,
  submitComment,
  setCommentText,
  deletePost,
  deleteComment
}) {
  const [showComments, setShowComments] = React.useState(false);
  const toggleComment = () => setShowComments(!showComments);
  return (
    <div className="card gedf-card">
      <div className="card-header">
        {post.user === userId && (
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
                className="rounded-circle"
                width="45"
                src={post.avatar}
                alt=""
              />
            </div>
            <div className="ml-2">
              <div className="h5 m-0">
                <Link to={`/profile/${post.user}`}>{post.name}</Link>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="card-body">
        <div className="text-muted h7 mb-2">
          {/* <i className="fa fa-clock-o"></i> <ReactTimeAgo date={post.date} /> */}
        </div>
        <a className="card-link" href="#">
          <h5 className="card-title">{post.title}</h5>
        </a>

        {post.text && <p className="card-text">{post.text}</p>}
        {post.imageName !== "none" && <img className="w-100" src={`${post.imageData}`}  alt="" />}
      </div>
      <div className="card-footer">
        <a className="card-link" onClick={() => toggleLike(post)}>
          <i className="fa fa-gittip"></i>
          {post.likes && post.likes.some((className) => className.user === userId)
            ? " Unlike"
            : " Like"}
          ({post && post.likes && post.likes.length})
        </a>
        <a className="card-link" onClick={toggleComment}>
          <i className="fa fa-comment"></i> Comment ({post.comments && post.comments.length})
        </a>
        {showComments && (
          <div className="comments mt-2 border-top">
            <div className="d-flex flex-row add-comment-section my-2">
              <img
                className="img-fluid img-responsive rounded-circle mr-2"
                src={post.avatar}
                width="38"
                alt=""
              />
              <input
                type="text"
                onChange={(e) => setCommentText(e.target.value)}
                className="form-control mr-3"
                placeholder="Add comment"
              />
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
                post.comments.map((comment,i) => (
                  <div key={i} className="d-flex border-top pt-1 flex-row comment-row">
                    <div className="p-2">
                      <span className="round">
                        <img
                          className="img-fluid img-responsive rounded-circle"
                          src={comment.avatar}
                          alt="user"
                          width="50"
                        />
                      </span>
                    </div>
                    <div className="comment-text w-100">
                      {comment.user === userId && (
                        <span className="float-right action-icons mr-2">
                          <a role="button" onClick={() => deleteComment({post, comment})} title="Delete">
                            <i className="fa fa-remove"></i>
                          </a>
                        </span>
                      )}
                      <h5 className="mb-0">{comment.name}</h5>
                      <div className="comment-footer">
                        <span className="date">
                          {/* <ReactTimeAgo date={comment.date} /> */}
                        </span>
                      </div>
                      <p className="my-0">{comment.text}</p>
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