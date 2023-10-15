const API_URL = "https://api.noroff.dev/api/v1";
const profileContainer = document.getElementById("profile-container");
const postsContainer = document.getElementById("posts-container");

import { editPost, deletePost, createEditDeleteButtons } from "./postFunctions.js";

/** This function fetches the user profile from the API and displays it on the page
 it uses the userName variable to determine which user profile to fetch
 it uses the accessToken variable to send the access token to the API.
 it also uses the displayUserProfile function to display the user profile on the page */ 

function fetchUserProfile(name) {
    const userProfileEndpoint = `${API_URL}/social/profiles/${name}`;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
    }
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    fetch(userProfileEndpoint, {
        headers,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch user profile");
            }
        })
        .then((profileData) => {
            document.title = `${profileData.name} | Social Connections`;
            displayUserProfile(profileData);
        })
        .catch((error) => {
            console.error("An error occurred:", error);
        });
}

/** This function fetches the user's posts from the API and displays them on the page
 it uses the userName variable to determine which user's posts to fetch
 it uses the accessToken variable to send the access token to the API.
 it also uses the createUserPostElement function to create the HTML for each post
 it also uses the createEditDeleteButtons function to create the edit and
 delete buttons for each post */ 

function displayUserPosts(posts) {
    posts.forEach((post) => {
        const postElement = createUserPostElement(post);

        // Append edit and delete buttons to the user's posts
        postElement.appendChild(createEditDeleteButtons(post));

        postsContainer.appendChild(postElement);
    });
}

/** This function takes a profile object and displays it on the page
 it also uses a default profile picture if the user has not set a profile picture
 this probably could've been reused, but I didn't want to mess with the original code
 as it creates different html elements than the one in feedprofile.js */ 

function displayUserProfile(profileData) {
    const profileDiv = document.createElement("div");
    profileDiv.className = "profile flex column gap1";
    profileDiv.innerHTML = `
<img width="300" src="${profileData.avatar}" alt="${profileData.name}'s profile picture" />
<h2>${profileData.name}</h2>
<div class="flex gap1 just-between mob-col">
<p>${profileData.email}</p>
<div class="flex gap1">
<p>Followers: ${profileData._count.followers}</p>
<p>Following: ${profileData._count.following}</p>
<p>Posts: ${profileData._count.posts}</p>
</div>
</div>
  `;
    profileContainer.appendChild(profileDiv);
}



function fetchUserPosts(name) {
    const userPostsEndpoint = `${API_URL}/social/profiles/${name}/posts`;
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        console.error("Access token not found in localStorage");
        return;
    }
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    fetch(userPostsEndpoint, {
        headers,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch user posts");
            }
        })
        .then((postsData) => {
            displayUserPosts(postsData);
        })
        .catch((error) => {
            console.error("An error occurred:", error);
        });
}

/** this function creates the HTML for a post that we show on the user profile page
 it takes a post object as a parameter and returns the HTML for the post
 it also uses the createEditDeleteButtons function to create the edit and
 delete buttons for each post
 This function is almost identical to the one in postFunctions.js, but I didn't want to mess with the original code
 as it creates different html elements. */ 

function createUserPostElement(post) {
    const postDiv = document.createElement("div");
    const titleAndBodyDiv = document.createElement("div");
    titleAndBodyDiv.className = "title-and-body flex just-between pad1 mob-col";
    postDiv.appendChild(titleAndBodyDiv);
    postDiv.className = "user-post flex column gap1 post";
    const postLeftDiv = document.createElement("div");
    postLeftDiv.className = "post-left flex column gap1";
    const postRightDiv = document.createElement("div");
    postRightDiv.className = "post-right";
    titleAndBodyDiv.appendChild(postLeftDiv);
    titleAndBodyDiv.appendChild(postRightDiv);



    postLeftDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
    `;

    if (post.media) {
        const image = document.createElement("img");
        image.src = post.media;
        image.alt = "Post image";
        image.classList.add("post-image");
        postRightDiv.appendChild(image);
    }


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
        post.tags.forEach((tag, index) => {
            const tagElement = document.createElement("p");
            tagElement.textContent = tag;
            tagElement.className = "tag";
            tagsDiv.appendChild(tagElement);
        });
        postDiv.appendChild(tagsDiv);
    }

    return postDiv;
}

/** this function checks if we have a user name in the query string (i.e we came from the feed or is on someone elses profile page)
 if we do, we fetch the user profile and posts for that user
 if not, we check if we have a user name in localStorage (i.e we came from the login page)
 if we do, we fetch the user profile and posts for that user
 if not, we log an error to the console
 this is because of reusability. */

const urlParams = new URLSearchParams(window.location.search);
const userNameFromQuery = urlParams.get("user");
if (userNameFromQuery) {
    fetchUserProfile(userNameFromQuery);
    fetchUserPosts(userNameFromQuery);
} else {
    let storedUserName = localStorage.getItem("user");
    storedUserName = storedUserName.replace(/['"]+/g, '');
    if (storedUserName) {
        fetchUserProfile(storedUserName);
        fetchUserPosts(storedUserName);
    } else {
        console.error("User name not found in query or localStorage");
    }
}