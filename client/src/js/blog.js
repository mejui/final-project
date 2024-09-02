function redirectToLogin() {
  window.location.href = "login.html";
}

function getUserInfo() {
  const userData = localStorage.getItem("current_user");

  if (userData) {
    try {
      const user = JSON.parse(userData);

      if (user.id) {
        return user;
      } else {
        redirectToLogin();
      }
    } catch (error) {
      console.error("Error parsing userData:", error);
      redirectToLogin();
    }
  } else {
    redirectToLogin();
  }

  return null;
}

document.addEventListener("DOMContentLoaded", function () {
  const blogPostsContainer = document.getElementById("blog-posts");
  const userInfo = getUserInfo();

  function createBlogPostElement(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("blog-post");

    const userElement = document.createElement("div");
    userElement.classList.add("user-info");

    const userImage = document.createElement("img");
    userImage.src = post.user_image_url;
    userImage.alt = `${post.user_name}'s profile picture`;
    userImage.classList.add("user-image");

    const userName = document.createElement("p");
    userName.textContent = post.user_name;
    userName.classList.add("user-name");

    userElement.appendChild(userImage);
    userElement.appendChild(userName);

    const postDate = document.createElement("p");
    postDate.textContent = new Date(post.created_at).toLocaleString();
    postDate.classList.add("post-date");
    userElement.appendChild(postDate);

    const postDescription = document.createElement("p");
    postDescription.textContent = post.description;
    postDescription.classList.add("post-description");

    const postImage = document.createElement("img");
    postImage.src = post.image_url;
    postImage.alt = "Blog post image";
    postImage.classList.add("post-image");

    const commentsContainer = document.createElement("div");
    commentsContainer.classList.add("comments-container");

    fetch(`http://localhost:3001/comments/post/${post.id}`)
      .then((response) => response.json())
      .then((comments) => {
        comments.forEach((comment) => {
          const commentElement = document.createElement("div");
          commentElement.classList.add("comment");

          const commentUser = document.createElement("div");
          commentUser.classList.add("comment-user");

          const commentUserImage = document.createElement("img");
          commentUserImage.src = comment.user_image_url;
          commentUserImage.alt = `${comment.user_name}'s profile picture`;
          commentUserImage.classList.add("comment-user-image");

          const commentUserName = document.createElement("p");
          commentUserName.textContent = comment.user_name;
          commentUserName.classList.add("comment-user-name");

          commentUser.appendChild(commentUserImage);
          commentUser.appendChild(commentUserName);

          const commentText = document.createElement("p");
          commentText.textContent = comment.text;
          commentText.classList.add("comment-text");

          commentElement.appendChild(commentUser);
          commentElement.appendChild(commentText);

          if (userInfo && comment.user_id === userInfo.id) {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("comment-delete");

            deleteButton.addEventListener("click", function () {
              fetch(`http://localhost:3001/comments/${comment.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => {
                  if (response.ok) {
                    commentElement.remove();
                  } else {
                    console.error(
                      "Error deleting comment:",
                      response.statusText
                    );
                  }
                })
                .catch((error) =>
                  console.error("Error deleting comment:", error)
                );
            });

            commentElement.appendChild(deleteButton);
          }

          commentsContainer.appendChild(commentElement);
        });
      })
      .catch((error) => console.error("Error fetching comments:", error));

    const addCommentForm = document.createElement("div");
    addCommentForm.classList.add("add-comment");

    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Add a comment...";
    commentInput.classList.add("comment-input");

    const submitButton = document.createElement("button");
    submitButton.textContent = "Post";
    submitButton.classList.add("comment-submit");

    submitButton.addEventListener("click", function () {
      const commentText = commentInput.value;
      if (commentText.trim() && userInfo) {
        fetch(`http://localhost:3001/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: post.id,
            user_id: userInfo.id,
            user_name: userInfo.name,
            user_image_url: userInfo.image_url,
            text: commentText,
          }),
        })
          .then((response) => response.json())
          .then((newComment) => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");

            const commentUser = document.createElement("div");
            commentUser.classList.add("comment-user");

            const commentUserImage = document.createElement("img");
            commentUserImage.src = newComment.user_image_url;
            commentUserImage.alt = `${newComment.user_name}'s profile picture`;
            commentUserImage.classList.add("comment-user-image");

            const commentUserName = document.createElement("p");
            commentUserName.textContent = newComment.user_name;
            commentUserName.classList.add("comment-user-name");

            commentUser.appendChild(commentUserImage);
            commentUser.appendChild(commentUserName);

            const commentTextElement = document.createElement("p");
            commentTextElement.textContent = newComment.text;
            commentTextElement.classList.add("comment-text");

            commentElement.appendChild(commentUser);
            commentElement.appendChild(commentTextElement);

            if (userInfo && newComment.user_id === userInfo.id) {
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.classList.add("comment-delete");

              deleteButton.addEventListener("click", function () {
                fetch(`http://localhost:3001/comments/${newComment.id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((response) => {
                    if (response.ok) {
                      commentElement.remove();
                    } else {
                      console.error(
                        "Error deleting comment:",
                        response.statusText
                      );
                    }
                  })
                  .catch((error) =>
                    console.error("Error deleting comment:", error)
                  );
              });

              commentElement.appendChild(deleteButton);
            }

            commentsContainer.appendChild(commentElement);

            commentInput.value = "";
          })
          .catch((error) => console.error("Error posting comment:", error));
      }
    });

    addCommentForm.appendChild(commentInput);
    addCommentForm.appendChild(submitButton);

    postElement.appendChild(userElement);
    postElement.appendChild(postDescription);
    postElement.appendChild(postImage);
    postElement.appendChild(commentsContainer);
    postElement.appendChild(addCommentForm);

    blogPostsContainer.appendChild(postElement);
  }

  fetch("http://localhost:3001/posts")
    .then((response) => response.json())
    .then((posts) => {
      posts.forEach((post) => {
        createBlogPostElement(post);
      });
    })
    .catch((error) => console.error("Error fetching blog posts:", error));
});
