const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');
const buttons = document.querySelectorAll('.choice');

canvas.width = 1000;
canvas.height = 600;

let health = 100; // Player starts with full health
let turns = 0; // Track the number of turns

const images = {
  cheese: new Image(),
  yogurt: new Image(),
  skincare: new Image(),
  drink: new Image(),
};

// Set image sources
images.cheese.src = 'cheese.webp'; // Replace with your cheese image path
images.yogurt.src = 'yogurt.jpg'; // Replace with your yogurt image path
images.skincare.src = 'skincare.jpeg'; // Replace with your skincare image path
images.drink.src = 'shaq.jpeg'; // Replace with your drink image path

let currentImage = null;

const sfx = {
  cheese: new Audio('amongus.mp3'), // Path to cheese SFX
  yogurt: new Audio('rizz-sounds.mp3'), // Path to yogurt SFX
  skincare: new Audio('nooo.swf.mp3'), // Path to skincare SFX
  drink: new Audio('oh-my-god-meme.mp3'), // Path to drink SFX
};


// Spoiled milk object
const milk = {
  x: 0,
  y: 0,
  width: 150,
  height: 200, // Taller to resemble a milk carton
  draw() {
      ctx.save(); // Save the current canvas state

      const triangleHeight = this.height * 0.3; // Height of the triangular top

      // Draw the top triangle
      ctx.fillStyle = '#ddd'; // Light gray for the top triangle
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y); // Top-center
      ctx.lineTo(this.x, this.y + triangleHeight); // Bottom-left of triangle
      ctx.lineTo(this.x + this.width, this.y + triangleHeight); // Bottom-right of triangle
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw the body of the carton
      ctx.fillStyle = 'white'; // White body
      ctx.fillRect(this.x, this.y + triangleHeight, this.width, this.height - triangleHeight);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.x, this.y + triangleHeight, this.width, this.height - triangleHeight);

      // Draw the label on the carton
      const labelHeight = (this.height - triangleHeight) * 0.4; // Height of the label
      ctx.fillStyle = '#87CEEB'; // Light blue label
      ctx.fillRect(this.x, this.y + triangleHeight + labelHeight, this.width, labelHeight);

      // Add text on the label
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Spoiled Milk', this.x + this.width / 2, this.y + triangleHeight + labelHeight + 20);

      ctx.restore(); // Restore the canvas state
  },
  center() {
      this.x = (canvas.width - this.width) / 2;
      this.y = (canvas.height - this.height) / 2;
  }
};

// Draw the health bar
function drawHealthBar() {
  const barWidth = 200; // Total width of the health bar
  const barHeight = 20; // Height of the health bar
  const x = 10; // Position 10 pixels from the left edge
  const y = 10; // Position 10 pixels from the top edge

  // Draw the background of the health bar
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(x, y, barWidth, barHeight);

  // Determine health bar color
  if (health > 60) ctx.fillStyle = 'green';
  else if (health > 30) ctx.fillStyle = 'yellow';
  else ctx.fillStyle = 'red';

  // Draw the current health bar
  const currentWidth = (health / 100) * barWidth; // Scale width by health percentage
  ctx.fillRect(x, y, currentWidth, barHeight);

  // Draw the health value next to the bar
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText(`${health}`, x + barWidth + 10, y + barHeight - 5); // Position to the side
}

// Draw the game content
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the health bar in the top-left corner
  drawHealthBar();

  // Display the current image if it exists
  if (currentImage) {
      const imageWidth = 300; // New width for the image
      const imageHeight = 300; // New height for the image
      ctx.drawImage(
          currentImage,
          (canvas.width - imageWidth) / 2, // Center horizontally
          (canvas.height - imageHeight) / 2, // Center vertically
          imageWidth, // New width
          imageHeight // New height
      );
  }
}



// Handle button clicks
buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
      const action = e.target.id;
      if (outcomes[action]) {
          const outcome = outcomes[action];
          message.textContent = outcome.message;

          // Play the corresponding SFX
          if (sfx[action]) {
              sfx[action].currentTime = 0; // Reset the audio to the beginning
              sfx[action].play().catch((err) => console.log('Audio playback failed:', err));
          }

          // Update the current image based on the action
          currentImage = images[action];

          // Modify health based on the action
          if (action === 'drink') {
              health -= 20; // Reduce health by 20 points
          } else {
              health += 10; // Add health for other actions
              if (health > 100) health = 100; // Cap health at 100
          }

          turns++; // Increment the turn counter
          checkGameStatus();
      }
  });
});



const deathImage = new Image(); // Create an image object
deathImage.src = 'toilet.webp'; // Path to the death animation image

function drawDeathAnimation() {
    // Play the death sound
    const deathSound = document.getElementById('deathSound');
    deathSound.play().catch((err) => console.log('Audio playback failed:', err));

    // Clear the canvas and display the death image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(deathImage, (canvas.width - 200) / 2, (canvas.height - 200) / 2, 200, 200);

    // Display "Game Over" text
    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 + 150);
}

function checkGameStatus() {
  if (health <= 0) {
      // Stop gameplay actions
      buttons.forEach((button) => (button.disabled = true));
      setTimeout(drawDeathAnimation, 500); // Delay slightly for effect
  } else if (turns >= 10) { // Update to 10 turns
      if (health > 0) {
          message.textContent = "You Win! You survived the spoiled milk!";
          buttons.forEach((button) => (button.disabled = true));

          // Play victory sound
          const victorySound = document.getElementById('victorySound');
          victorySound.play().catch((err) => console.log('Audio playback failed:', err));

          // Start the confetti animation
          createConfetti();
          drawConfetti();

          // Show the winning GIF
          // Show the winning GIF
          const winGif = document.getElementById('winGif');
          winGif.style.display = 'block'; // Make the GIF visible
          winGif.style.position = 'absolute';
          winGif.style.top = `${canvas.offsetTop + (canvas.height - 200) / 2}px`; // Center vertically
          winGif.style.left = `${canvas.offsetLeft + (canvas.width - 200) / 2}px`; // Center horizontally
          winGif.style.width = '200px'; // Set the GIF width
          winGif.style.height = '200px'; // Set the GIF height
          winGif.style.zIndex = 10; // Ensure it overlays other elements

          
      }
  }
  drawGame(); // Redraw the game to update the health bar
}

setTimeout(() => {
  const winGif = document.getElementById('winGif');
  winGif.style.display = 'none'; // Hide the GIF after 5 seconds
}, 5000);



// Start the game
function startGame() {
    health = 100; // Reset health
    turns = 0; // Reset turns
    message.textContent = "What do you want to do with the spoiled milk?";
    buttons.forEach((button) => (button.disabled = false));
    drawGame(); // Draw the initial game state
}

const outcomes = {
    drink: {
        message: "Oh no! You drank spoiled milk and lost health! (-20 health)",
    },
    cheese: {
        message: "Nice! You made some stinky cheese and gained health! (+10 health)",
    },
    yogurt: {
        message: "Great! You made delicious yogurt and gained health! (+10 health)",
    },
    skincare: {
        message: "Wow! You made an amazing skincare product and gained health! (+10 health)",
    },
};

const confettiParticles = []; // Array to store confetti pieces

function createConfetti() {
    for (let i = 0; i < 100; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height, // Start above the canvas
            size: Math.random() * 5 + 2, // Random size
            color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
            speed: Math.random() * 2 + 1, // Random speed
            angle: Math.random() * Math.PI * 2, // Random angle
        });
    }
}

function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw each confetti piece
    confettiParticles.forEach((particle) => {
        ctx.save();
        ctx.fillStyle = particle.color;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle); // Rotate the confetti piece
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();

        // Update the particle's position
        particle.y += particle.speed; // Move downward
        particle.angle += 0.1; // Slight rotation

        // Reset position if it falls below the canvas
        if (particle.y > canvas.height) {
            particle.y = -particle.size;
            particle.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(drawConfetti); // Continue animation
}


startGame();
