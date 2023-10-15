const API_URL = "https://api.noroff.dev/api/v1";
const loginForm = document.getElementById("login");
const errorBox = document.getElementById("error-box");
const emailInput = document.getElementById("email");
let url = window.location.href;
url = url.substring(0, url.lastIndexOf("/"));

/** listen to the submit event on the form itself and prevent the default behaviour
 of the form when the submit event is fired (i.e. prevent the form from submitting)
 thereafter we can grab the values from the form fields and create a new post object
 to send to the API to log in. JSON.stringify() is used to convert the JavaScript object
 into JSON. We then set the access token and the username in localStorage and redirect the user to the feed page. */

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get("email");

  if (!isValidEmail(email)) {
    errorBox.innerHTML = "<p>Email must be of domain '@noroff.no' or '@stud.noroff.no'</p>";
    errorBox.classList.remove("hidden");
    return;
  }

  const loginEndpoint = `${API_URL}/social/auth/login`;

  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  fetch(loginEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        errorBox.innerHTML = "<p>Wrong username or password</p>";
        errorBox.classList.remove("hidden");
        throw new Error("Login failed");
      }
    })
    .then((data) => {
      localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.name));
      window.location.replace(`${url}/feed.html`);
      
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
});

/** this function checks if the email is of the correct domain
 in this case the domain is noroff.no or stud.noroff.no */

function isValidEmail(email) {
  const allowedDomains = ["@noroff.no", "@stud.noroff.no"];
  return allowedDomains.some((domain) => email.endsWith(domain));
}
