import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import NotificationComponent from "./Notifications.jsx";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import EditIcon from "../assets/pen.svg";
import UserIcon from "../assets/userIcon.svg";
import DeleteIcon from "../assets/trash3.svg";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const Post = () => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isVideo, setIsVideo] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  //Comment states
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  //Like State
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    // Fetch all posts when the component loads
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchLikedPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/likes/user/test01`);
        const data = await res.json();
        setLikedPosts(data);
        console.log("Liked posts:", data);
      } catch (err) {
        console.error("Error fetching liked posts", err);
      }
    };

    fetchPosts();
    fetchLikedPosts();
  }, []);

  const toggleComments = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null); // Collapse
    } else {
      try {
        const res = await fetch(
          `http://localhost:8080/api/comments/post/${postId}`
        );
        const data = await res.json();
        setComments((prev) => ({ ...prev, [postId]: data }));
        setExpandedPostId(postId);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          postId,
          userId: "test02", // Replace with logged-in user ID
          content: commentText,
        }),
      });

      const newComment = await res.json();

      // Instantly show new comment
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));

      setCommentText(""); // clear input
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleUpdateComment = async (commentId, postId) => {
    try {
      await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          content: editedContent,
        }),
      });

      // Update comment in UI
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c.id === commentId ? { ...c, content: editedContent } : c
        ),
      }));

      setEditingCommentId(null);
      setEditedContent("");
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: "DELETE",
      });

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch("http://localhost:8080/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          postId,
          userId: "test01",
        }),
      });
      setLikedPosts((prev) =>
        prev.includes(postId)
          ? prev.filter((id) => id !== postId)
          : [...prev, postId]
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    if (isVideo) {
      if (files.length > 1) {
        alert("You can only upload 1 video");
        return;
      }
      setMediaFiles(files);
    } else {
      if (files.length > 3) {
        alert("You can only upload up to 3 images");
        return;
      }
      setMediaFiles(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("isVideo", isVideo);
      formData.append("userId", "user123");

      mediaFiles.forEach((file) => {
        formData.append("mediaFiles", file);
      });

      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const post = await response.json();
        console.log("Created post:", post);
        setPreviewPost(post); // Set the preview post after creation
        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        alert("Failed to create post: " + errorText);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <NotificationComponent userId="user123" />
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Create a New Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Post Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1">
            Upload media ({isVideo ? "1 video" : "up to 3 images"}):
          </Typography>

          <input
            type="file"
            accept={isVideo ? "video/*" : "image/*"}
            multiple={!isVideo}
            onChange={handleMediaChange}
            style={{ marginBottom: "1rem" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <label>
              <input
                type="checkbox"
                checked={isVideo}
                onChange={(e) => {
                  setIsVideo(e.target.checked);
                  setMediaFiles([]); // Clear previous files
                }}
              />{" "}
              Is this a video post?
            </label>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !mediaFiles.length}
            >
              {isLoading ? <CircularProgress size={24} /> : "Post"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Preview Post */}
      {previewPost && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Preview
          </Typography>

          {previewPost.mediaType === "IMAGE" &&
            Array.isArray(previewPost.imageUrls) && (
              <Grid
                container
                spacing={2}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                }}
              >
                {previewPost.imageUrls.map((url, index) => (
                  <Grid item key={index}>
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

          {previewPost.mediaType === "VIDEO" && previewPost.videoUrl && (
            <Box mt={2}>
              <video width="100%" controls>
                <source src={previewPost.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
        </Box>
      )}

      {/* All Posts */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          All Posts
        </Typography>

        {posts.length === 0 ? (
          <Typography>No posts available.</Typography>
        ) : (
          posts.map((post) => (
            <Paper key={post.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{post.description}</Typography>
              {post.mediaType === "IMAGE" && Array.isArray(post.imageUrls) && (
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  {post.imageUrls.map((url, index) => (
                    <Grid item key={index}>
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
              {post.mediaType === "VIDEO" && post.videoUrl && (
                <Box mt={2}>
                  <video width="100%" controls>
                    <source src={post.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}

              <Box
                mt={2}
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                <Button
                  onClick={() => handleLike(post.id)}
                  startIcon={
                    likedPosts.includes(post.id) ? (
                      <Favorite sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorder sx={{ color: "black" }} />
                    )
                  }
                  sx={{
                    color: likedPosts.includes(post.id) ? "red" : "black",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {likedPosts.includes(post.id) ? "Liked" : "Like"}
                </Button>

                <Button
                  onClick={() => toggleComments(post.id)}
                  startIcon={
                    <ChatBubbleOutlineIcon
                      sx={{
                        color: expandedPostId === post.id ? "#1976d2" : "black",
                      }}
                    />
                  }
                  sx={{
                    color: expandedPostId === post.id ? "#1976d2" : "black",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Comment
                </Button>
              </Box>
              {expandedPostId === post.id && (
                <Box>
                  {/* Existing Comments */}
                  <Box display="flex" flexDirection="column" width="100%">
                    {comments[post.id]?.map((comment) => (
                      <Paper
                        key={comment.id}
                        sx={{
                          mb: 1,
                          backgroundColor: "#f1f1f1",
                          borderRadius: 2,
                        }}
                      >
                        {/* If this comment is being edited */}
                        {editingCommentId === comment.id ? (
                          <Box
                            display="flex"
                            padding={1}
                            alignItems="center"
                            gap={1}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() =>
                                handleUpdateComment(comment.id, post.id)
                              }
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditedContent("");
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <Box display="flex" gap={1} mt={2}>
                              <Box
                                paddingLeft={1}
                                borderRadius={2}
                                display="flex"
                                flexDirection="column"
                                gap={2}
                                width="90%"
                              >
                                <Box
                                  borderRadius={2}
                                  display="flex"
                                  flexDirection="row"
                                  gap={2}
                                >
                                  <img
                                    src={UserIcon}
                                    alt="user"
                                    style={{ width: 30, height: 30 }}
                                  />

                                  <Box
                                    borderRadius={2}
                                    display="flex"
                                    flexDirection="column"
                                    width="100%"
                                  >
                                    <Box
                                      padding={1}
                                      sx={{
                                        backgroundColor:
                                          comment.userId === "test01"
                                            ? "#fcfcfc"
                                            : "",
                                        borderRadius: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        fontSize={15}
                                      >
                                        {comment.userId || "User"}
                                      </Typography>

                                      <Typography
                                        variant="body2"
                                        sx={{ mb: 1 }}
                                      >
                                        {comment.content}
                                      </Typography>
                                    </Box>
                                    {comment.userId === "test01" && (
                                      <Box
                                        mb={1}
                                        borderRadius={2}
                                        display="flex"
                                        flexDirection="row"
                                        gap={2}
                                      >
                                        <Button
                                          size="small"
                                          onClick={() => {
                                            setEditingCommentId(comment.id);
                                            setEditedContent(comment.content);
                                          }}
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: "6px",
                                            textTransform: "none",
                                          }}
                                        >
                                          <img
                                            src={EditIcon}
                                            alt="Edit"
                                            style={{ width: 13, height: 13 }}
                                          />
                                          <span
                                            style={{
                                              color: "black",
                                              fontSize: "12px",
                                            }}
                                          >
                                            Edit
                                          </span>
                                        </Button>
                                        <Button
                                          size="small"
                                          color="error"
                                          onClick={() =>
                                            handleDeleteComment(
                                              comment.id,
                                              post.id
                                            )
                                          }
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: "6px",
                                            textTransform: "none",
                                          }}
                                        >
                                          <img
                                            src={DeleteIcon}
                                            alt="Edit"
                                            style={{ width: 13, height: 13 }}
                                          />

                                          <span
                                            style={{
                                              color: "black",
                                              fontSize: "12px",
                                            }}
                                          >
                                            Delete
                                          </span>
                                        </Button>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </>
                        )}
                      </Paper>
                    ))}

                    {/* Add New Comment */}
                    <Box display="flex" mt={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button
                        onClick={() => handleAddComment(post.id)}
                        variant="contained"
                        sx={{ ml: 1 }}
                      >
                        Post
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Post;
