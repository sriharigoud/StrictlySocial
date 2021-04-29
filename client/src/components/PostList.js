import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import Post from "./Post";
import { useLocation } from "react-router-dom";
import { getUser } from "../utils/utils";
import { connect } from "react-redux";
import { toggleLike, sharePost, deletePost, deleteComment, submitComment } from "../redux/Posts/Posts.actions";
function PostList({posts, atoggleLike, asharePost, adeletePost, adeleteComment, asubmitComment}) {
  let [currentUser] = useState(getUser());
  const { key } = useLocation();
  const [commentText, setCommentText] = useState("");
  const toggleLike = async (post) => {
    try {
      const res = await axios.put(`/api/posts/likes/${post._id}`);
    //   setPosts((prevPosts) => {
    //     return prevPosts.map((a) =>
    //       a.id === post.id ? { ...a, likes: res.data } : { ...a }
    //     );
    //   });
        atoggleLike({post, likes: res.data});
    } catch (error) {
      console.log(error.message);
    }
  };
  const submitComment = async (post) => {
    try {
      const res = await axios.post(
        `/api/posts/comments/${post._id}`,
        JSON.stringify({ text: commentText }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    //   setPosts((prevPosts) => {
    //     return prevPosts.map((a) =>
    //       a._id === post._id ? { ...a, comments: res.data } : { ...a }
    //     );
    //   });
      asubmitComment({post, comments: res.data});
      setCommentText("")
    } catch (error) {
      console.log(error.message);
    }
  };
  const deletePost = async (post) => {
    try {
      const confirmV = window.confirm("Delete Post?");
      if (confirmV) {
        const res = await axios.delete(`/api/posts/${post._id}`);
        // setPosts((prevPosts) => {
        //   return prevPosts.filter((a) => a._id !== post._id);
        // });
        adeletePost({post})
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const sharePost = async (post) => {
    try {
        const res = await axios.get(`/api/posts/share/${post._id}`);
        // setPosts((prevPosts) => {
        //   return [res.data.newpost, ...prevPosts];
        // });
        asharePost({post: res.data.newpost})
    } catch (error) {
      console.log(error.message);
    }
  };
  const deleteComment = async ({ post, comment }) => {
    try {
      const confirmV = window.confirm("Delete Comment?");
      if (confirmV) {
        const res = await axios.delete(
          `/api/posts/comments/${post._id}/${comment._id}`
        );
        // setPosts((prevPosts) => {
        //   return prevPosts.map((a) =>
        //     a._id === post._id ? { ...a, comments: res.data } : { ...a }
        //   );
        // });
        adeleteComment({post, comments: res.data})
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
  }, [key, getUser]);
  return (
    <React.Fragment>{
        posts &&
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            userId={currentUser._id}
            setCommentText={setCommentText}
            submitComment={submitComment}
            toggleLike={toggleLike}
            deletePost={deletePost}
            deleteComment={deleteComment}
            sharePost={sharePost}
            currentUser={currentUser}
            commentText={commentText}
          />
        ))}
      {posts && posts.length === 0 && <h6 className="m-2">No Posts found</h6>}
      </React.Fragment>
  );
}

const mapStateToProps = state => {
    return {
      posts: state.posts.posts,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        atoggleLike: (payload) => dispatch(toggleLike(payload)),
        asharePost: (payload) => dispatch(sharePost(payload)),
        adeleteComment: (payload) => dispatch(deleteComment(payload)),
        asubmitComment: (payload) => dispatch(submitComment(payload)),
        adeletePost: (payload) => dispatch(deletePost(payload)),
    }
  }
  

export default connect(mapStateToProps, mapDispatchToProps)(PostList);