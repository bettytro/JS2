
const API_URL = "https://api.noroff.dev/api/v1";

/** This function lets you edit a post with HTTP PUT
 it takes the post ID and the updated data as parameters
 it uses the access token from localStorage to authenticate the request
 it also uses the updated data to update the post
 if the request is successful it reloads the page
 if the request fails it logs the error to the console */ 

function editPost(postId, updatedData) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Access token not found in localStorage");
    return;
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  fetch(`${API_URL}/social/posts/${postId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
    } else {
        throw new Error("Failed to edit the post");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}

/** This function lets you delete a post with HTTP DELETE
it takes the post ID as a parameter
it uses the access token from localStorage to authenticate the request
if the request is successful it reloads the page
if the request fails it logs the error to the console */

function deletePost(postId) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Access token not found in localStorage");
    return;
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  fetch(`${API_URL}/social/posts/${postId}`, {
    method: "DELETE",
    headers,
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error("Failed to delete the post");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}

/** This function creates the edit and delete buttons for a post
 it takes the post object as a parameter
 it returns a div element with the edit and delete buttons
 it also adds event listeners to the edit and delete buttons
 the edit button displays a form to edit the post
 the delete button deletes the post */ 

function createEditDeleteButtons(post) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("button-edit");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("button-edit");


    const editDiv = document.createElement("div");
    editDiv.style.display = "none";
    editDiv.innerHTML = `
        <label for="editTitle">Title</label>
        <input type="text" id="editTitle" placeholder="New Title">
        <label for="editBody">Body</label>
        <textarea id="editBody" placeholder="Updated content"></textarea>
        <button class="editConfirm button-edit">Confirm</button>
        <button class="editCancel button-edit">Cancel</button>
    `;

    editButton.addEventListener("click", () => {
        editDiv.style.display = "block";
        document.getElementById("editTitle").value = post.title;
        document.getElementById("editBody").value = post.body;
        editButton.style.display = "none";
        deleteButton.style.display = "none";
        const editCancelButton = editDiv.querySelector(".editCancel");
        editCancelButton.addEventListener("click", () => {
            editDiv.style.display = "none";
            editButton.style.display = "block";
            deleteButton.style.display = "block";
        });
    });

    deleteButton.addEventListener("click", () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            deletePost(post.id);
        }
    });

    const editConfirmButton = editDiv.querySelector(".editConfirm");
    editConfirmButton.addEventListener("click", () => {
        const updatedData = {
            title: document.getElementById("editTitle").value,
            body: document.getElementById("editBody").value,
        };
        editPost(post.id, updatedData);
        editDiv.style.display = "none";
    });

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "flex gap1";
    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);
    buttonsDiv.appendChild(editDiv);

    return buttonsDiv;
}

/** This function fetches a single post from the API
 it takes the post ID as a parameter
 it uses the access token from localStorage to authenticate the request
 if the request is successful it displays the post on the page
 if the request fails it logs the error to the console */ 

function fetchSinglePost(postId) {
    const postContainer = document.getElementById("post-container");

    const postEndpoint = `${API_URL}/social/posts/${postId}`;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    fetch(postEndpoint, {
        headers,
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to fetch the single post");
        }
    })
    .then((post) => {
        displaySinglePost(post, postContainer);
    })
    .catch((error) => {
        console.error("An error occurred:", error);
    });
}
/**  This function displays a single post on the page
 it takes the post object and the container element as parameters
 it displays the post title, body, media, updated timestamp, tags and ID
 it also adds event listeners to the tags and ID
 the tags are not clickable as we don't filter posts by tags on the single post page */ 

function displaySinglePost(post, container) {
    const postDiv = document.createElement("div");
    postDiv.className = "post flex column gap1";

    const titleAndBodyDiv = document.createElement("div");
    titleAndBodyDiv.className = "title-and-body";

    titleAndBodyDiv.innerHTML = `
      <h1>${post.title}</h1>
      <p>${post.body}</p>
    `;

    if (post.media) {
        const image = document.createElement("img");
        image.src = post.media;
        image.alt = "Post image";
        image.classList.add("post-image");
        titleAndBodyDiv.appendChild(image);
    }

    postDiv.appendChild(titleAndBodyDiv);

    if (post.updated) {
        const updatedTimestamp = new Date(post.updated);
        const formattedDate = updatedTimestamp.toLocaleString("no-NO");
        const timestamp = document.createElement("p");
        timestamp.className = "timestamp";
        timestamp.textContent = `${formattedDate}`;
        postDiv.appendChild(timestamp);
    }

    if (post.tags && post.tags.length > 0) {
        const tagsDiv = document.createElement("div");
        tagsDiv.className = "flex gap1";

        post.tags.forEach((tag) => {
            const tagElement = document.createElement("a");
            tagElement.textContent = tag;
            tagElement.className = "tag";

            tagElement.addEventListener("click", (e) => {
                e.preventDefault();
            });

            tagsDiv.appendChild(tagElement);
        });

        postDiv.appendChild(tagsDiv);
    }

    if (post.id) {
        const id = document.createElement("a");
        id.href = `post.html?id=${post.id}`;
        id.className = "id";
        id.textContent = `${post.id}`;
        postDiv.appendChild(id);
    }

    container.appendChild(postDiv);
}

export { editPost, deletePost, createEditDeleteButtons, fetchSinglePost };