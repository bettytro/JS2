const API_URL = "https://api.noroff.dev/api/v1";
const registerForm = document.getElementById("register");
const errorBox = document.getElementById("error-box");
const successBox = document.getElementById("success-box");
const emailInput = document.getElementById("email");
let url = window.location.href;
url = url.substring(0, url.lastIndexOf("/"));

/** listen to the submit event on the form itself and prevent the default behaviour
 of the form when the submit event is fired (i.e. prevent the form from submitting)
 thereafter we can grab the values from the form fields and create a new post object
 to send to the API to register. JSON.stringify() is used to convert the JavaScript object
 into JSON. We then redirect to the login page so the user can log in. */ 

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const email = formData.get("email");

  if (!isValidEmail(email)) {
    errorBox.innerHTML = "<p>Email must be of domain '@noroff.no' or '@stud.noroff.no'</p>";
    errorBox.classList.remove("hidden");
    return;
  }

  const registerEndpoint = `${API_URL}/social/auth/register`;

  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  fetch(registerEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (response.ok) {
        successBox.innerHTML = "<p>Registration successful</p>";
        successBox.classList.remove("hidden");
        window.location.replace(`${url}/index.html`);
    } else {
        errorBox.innerHTML = "<p>Registration failed</p>";
        errorBox.classList.remove("hidden");
      }
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
