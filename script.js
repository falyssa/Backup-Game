// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");

    // Add an event listener to navigate to the Level One page
    startButton.addEventListener("click", () => {
        window.location.href = "game.html"; // Redirect to Level One
    });
});
