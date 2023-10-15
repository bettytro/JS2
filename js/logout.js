/** here we listen for the logout button click event and remove the user and accessToken from local storage
 and redirect the user to the login page */ 
const logoutButton = document.getElementById("logout"); 

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    
    window.location.href = "index.html";
});