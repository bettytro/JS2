const createPostForm = document.getElementById("create-post-form");
const errorBox = document.getElementById("error-box");

/** listen to the submit event on the form itself and prevent the default behaviour
 of the form when the submit event is fired (i.e. prevent the form from submitting)
 thereafter we can grab the values from the form fields and create a new post object
 to send to the API to create a new post. We then reset the form. If there is an error
 we display the error message in the error box. */

createPostForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = createPostForm.elements.title.value;
  const body = createPostForm.elements.body.value;
  const tags = createPostForm.elements.tags.value.split(',').map(tag => tag.trim());
  const media = createPostForm.elements.media.value;

  const post = {
    title,
    body,
    tags,
    media,
  };

  fetch(`${API_URL}/social/posts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  })
    .then((response) => {
      if (response.ok) {
        createPostForm.reset();
        window.location.reload();
      } else {
        errorBox.innerHTML = "<p>Failed to create the post</p>";
        errorBox.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

function hideError() {
  errorBox.classList.add("hidden");
}

const formFields = createPostForm.querySelectorAll("input, textarea");
formFields.forEach((field) => {
  field.addEventListener("input", hideError);
});
