const API_URL = "https://api.noroff.dev/api/v1";
const postsContainer = document.getElementById("posts-container");
const loadMoreButton = document.getElementById("load-more");
const filterForm = document.getElementById("filter-form");
const activeForm = document.getElementById("active-form");
import { editPost, deletePost, createEditDeleteButtons } from "./postFunctions.js";


let postOffset = 0;
const limit = 20;
let currentFilters = {};

filterForm.addEventListener("submit", function (e) {
  e.preventDefault();
  applyTagFilter();
}); 

activeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  applyActiveFilter();
});

loadMoreButton.addEventListener("click", function () {
  postOffset += limit;
  fetchAndDisplayPosts();
});


/** This function is called when the user clicks the "Search" button
 it grabs the value from the tag input field and sets the currentFilters
 object to the tag value. It then resets the postOffset to 0 and calls
 fetchAndDisplayPosts() to fetch and display the posts with the new filter */

function applyTagFilter() {
  const tag = document.getElementById("_tag").value;
  currentFilters = { _tag: tag };
  postOffset = 0;
  fetchAndDisplayPosts();
}

/* This function is called when the user clicks the "Filter" button
 it grabs the value from the active input field and sets the currentFilters
 object to the active value. It then resets the postOffset to 0 and calls
 fetchAndDisplayPosts() to fetch and display the posts with the new filter */

function applyActiveFilter() {
  const active = document.getElementById("active").checked;
  currentFilters = { _active: active };
  postOffset = 0;
  fetchAndDisplayPosts();
}

/* This function fetches the posts from the API and displays them on the page
 it uses the currentFilters object to add query parameters to the URL
 it also uses the postOffset variable to determine which page of posts to fetch
 it also uses the limit variable to determine how many posts to fetch per page */

function fetchAndDisplayPosts() {
  const postsEndpoint = `${API_URL}/social/posts`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("Access token not found in localStorage");
    return;
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const filterParams = new URLSearchParams(currentFilters);
  filterParams.append("limit", limit);
  filterParams.append("offset", postOffset);

  fetch(`${postsEndpoint}?${filterParams.toString()}`, {
    headers,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error("Failed to fetch posts");
      }
    })
    .then((data) => {
      displayPosts(data);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}
let userPosts = [];

/* This function fetches the user's posts from the API and stores the post IDs
 in the userPosts array. It then calls fetchAndDisplayPosts() to fetch and
 display the posts on the page. If there is an error it logs the error to the
 console. It also uses the localStorage to get the username of the logged in user
 and uses that to fetch the posts for that user. We use the user's posts to
 determine if the user should be able to edit or delete a post. */

function fetchUserPosts() {
    let userName = localStorage.getItem("user");
    userName = userName.replace(/['"]+/g, '');
    if (!userName) {
        console.error("User name not found in localStorage");
        return;
    }

    const postsEndpoint = `${API_URL}/social/profiles/${userName}/posts`;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    fetch(postsEndpoint, {
        headers,
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw Error("Failed to fetch user's posts");
        }
    })
    .then((data) => {
        userPosts = data.map((post) => post.id); // Extract user post IDs
        fetchAndDisplayPosts();
    })
    .catch((error) => {
        console.error("An error occurred:", error);
    });
};

/* This function takes an array of posts and displays them on the page
 it uses the createPostElement() function to create the HTML for each post
 it also uses the createEditDeleteButtons() function to create the edit and
 delete buttons for each post. If the user is the author of the post then
 the edit and delete buttons are displayed. If the user is not the author
 then the edit and delete buttons are not displayed. */

function displayPosts(posts) {
    if (postOffset === 0) {
        postsContainer.innerHTML = "";
    }

    posts.forEach((post) => {
        const postElement = createPostElement(post);

        if (userPosts.includes(post.id)) {
            postElement.appendChild(createEditDeleteButtons(post));
        }
        postsContainer.appendChild(postElement);
    });
}


/* This function takes a post object and creates the HTML for the post
 it uses the post object to populate the HTML elements with the post data
 it also adds an event listener to the tag elements so that when the user
 clicks on a tag it will filter the posts by that tag
 it also adds an event listener to the id element so that when the user
 clicks on the id it will take them to the post page for that post */

function createPostElement(post) {
    const postDiv = document.createElement("div");
    postDiv.className = "post flex column gap1";
  
    const titleAndBodyDiv = document.createElement("div");
    titleAndBodyDiv.className = "title-and-body";
  
    titleAndBodyDiv.innerHTML = `
      <h3>${post.title}</h3>
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
          document.getElementById("_tag").value = tag;
          applyTagFilter();
        });
  
        tagsDiv.appendChild(tagElement);
      });
  
      postDiv.appendChild(tagsDiv);
    }
    if(post.id) {
        const id = document.createElement("a");
        id.href = `post.html?id=${post.id}`;
        id.className = "id";
        id.textContent = `${post.id}`;
        postDiv.appendChild(id);
    }
  
    return postDiv;
  };

fetchAndDisplayPosts();
fetchUserPosts();

export { createEditDeleteButtons };
