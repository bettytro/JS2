const profile = document.getElementById("profile");
let profileName = localStorage.getItem("user");
const API_URL = "https://api.noroff.dev/api/v1";

/** This function fetches the user profile from the API and displays it on the page
 it uses the profileName variable to determine which user profile to fetch
 it uses the accessToken variable to send the access token to the API. */

function fetchAndDisplayUserProfile() {
  if (!profileName) {
    console.error("User name not found in localStorage");
    return;
  }
  profileName = profileName.replace(/['"]+/g, '');

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("Access token not found in localStorage");
    return;
  }
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const userProfileEndpoint = `${API_URL}/social/profiles/${profileName}`;

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
      displayUserProfile(profileData);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}

/** This function takes a profile object and displays it on the page
it also uses a default profile picture if the user has not set a profile picture */

function displayUserProfile(profileData) {
  profile.innerHTML = `
    <img width="100" src="${profileData.avatar}" alt="${profileData.name}'s profile picture" />
    <a href="profile.html?user=${profileData.name}"><h2>${profileData.name}'s Profile</h2></a>
    <p>${profileData.email}</p>
  `;
    if (!profileData.avatar) {
        profile.innerHTML = `
        <img width="100" src="icon.webp" alt="${profileData.name}'s profile picture" />
        <a href="profile.html?user=${profileData.name}"><h2>${profileData.name}'s Profile</h2></a>
        <p>${profileData.email}</p>
    `;
    }
}

fetchAndDisplayUserProfile();
