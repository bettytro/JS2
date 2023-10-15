import { fetchSinglePost } from "./postFunctions.js";

/** This function fetches a single post from the API and displays it on the page
// it uses the postId variable to determine which post to fetch
// we use the fetchSinglePost function from postFunctions.js to fetch the post and
// then we display it on the page */

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (postId) {
        fetchSinglePost(postId);
    } else {
        console.error("Post ID not found in query parameter.");
    }
});