import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./feed.css";
import CommentSection from "../posts/CommentSection";

const BlogFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  if (!localStorage.getItem("token")) {
    navigate("/login");
  }

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/posts/allPosts"
        );
        const fetchedPosts = response.data.posts || [];
        setPosts(fetchedPosts.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/posts/likePost/${postId}`,
        { userId }
      );
      const updatedPost = response.data.post;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: updatedPost.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error.message);
    }
  };

  const handleComment = (postId) => {
    console.log("Go to post comments:", postId);
  };

  if (loading) {
    return (
      <div className="text-center mt-5 text-lg font-medium text-gray-600">
        Loading posts...
      </div>
    );
  }

  return (
    <>
      <div className="bg-red-50 min-h-screen py-10 px-4 ml-80">
        <div className="flex justify-center">
          <div className="max-w-3xl w-full">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-6">
                    <div className="rounded-full bg-green-300 w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
                      {post.userId && post.userId.name
                        ? post.userId.name[0].toUpperCase()
                        : "N/A"}
                    </div>
                    <div className="ml-6">
                      <p className="font-semibold text-gray-800 cursor-pointer hover:underline">
                        <Link
                          to={`/profile/${
                            post.userId ? post.userId._id : "anonymous"
                          }`}
                        >
                          {post.userId && post.userId.name
                            ? post.userId.name
                            : "Anonymous"}
                        </Link>
                      </p>
                      <p className="text-sm text-gray-500">{post.createdAt}</p>
                      <p className="text-blue-700 font-semibold cursor-pointer hover:underline">
                        + Follow
                      </p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {post.title}
                  </h2>
                  <div className="text-gray-700 mb-6 px-4 py-3 bg-gray-50 rounded-lg post-body">
                    {post.body}
                  </div>
                  {post.media && post.mediaType === "image" && (
                    <img
                      src={post.media}
                      alt="Post Media"
                      className="rounded-md mb-6 max-h-72 object-cover w-full"
                    />
                  )}
                  {post.media && post.mediaType === "video" && (
                    <video
                      src={post.media}
                      controls
                      className="rounded-md mb-6 max-h-72 w-full"
                    />
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags &&
                      Array.isArray(post.tags) &&
                      post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs font-medium bg-green-100 text-green-600 rounded-full px-4 py-1 border border-green-300 mr-2 mb-2 inline-block"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className="text-red-600 font-medium hover:bg-gray-300 hover:p-1 flex items-center space-x-1"
                      >
                        <span>👍</span>
                        <span>{post.likes && post.likes.length}</span>
                        <span>
                          {post.likes && post.likes.includes(userId)
                            ? "Unlike"
                            : "Like"}
                        </span>
                      </button>
                      <button
                        onClick={() => handleComment(post._id)}
                        className="text-blue-600 font-medium hover:bg-gray-300 hover:p-1 flex items-center space-x-1"
                      >
                        <span>💬</span>

                        <span>
                          <CommentSection postId={post._id} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogFeed;
