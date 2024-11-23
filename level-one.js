// Phaser configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#222",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let reflections;
let mirrors;

function preload() {
    // Load assets
    this.load.image("player", "path/to/player.png");
    this.load.image("reflection", "path/to/reflection.png");
    this.load.image("mirror", "path/to/mirror.png");
    this.load.image("background", "path/to/background.png");
}

function create() {
    // Add background
    this.add.image(400, 300, "background");

    // Add mirrors
    mirrors = this.physics.add.staticGroup();
    mirrors.create(200, 200, "mirror");
    mirrors.create(600, 200, "mirror");
    mirrors.create(400, 400, "mirror");

    // Add player
    player = this.physics.add.sprite(400, 500, "player").setScale(1.5);
    player.setCollideWorldBounds(true);

    // Add reflections
    reflections = this.physics.add.group();

    mirrors.children.iterate((mirror) => {
        const reflection = reflections.create(mirror.x, mirror.y, "reflection").setScale(1.5);
        reflection.mimicDelay = Phaser.Math.Between(5, 10); // Add slight delay to mimic movements
        reflection.lastX = player.x; // Track player's position
        reflection.lastY = player.y;
    });

    // Enable keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

    // Add interaction for breaking mirrors
this.input.keyboard.on("keydown-SPACE", () => {
    mirrors.children.iterate((mirror) => {
        const distance = Phaser.Math.Distance.Between(player.x, player.y, mirror.x, mirror.y);
        if (distance < 50) { // Break the mirror if close enough
            mirror.destroy();

            // Also destroy the associated reflection
            reflections.children.iterate((reflection) => {
                if (Phaser.Math.Distance.Between(mirror.x, mirror.y, reflection.x, reflection.y) < 10) {
                    reflection.destroy();
                }
            });
        }
    });
});

}

function update() {
    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
    }

    // Reflection movement (mimics player)
    reflections.children.iterate((reflection) => {
        const deltaX = player.x - reflection.lastX;
        const deltaY = player.y - reflection.lastY;

        // Add a delay effect for mimicking
        reflection.lastX += deltaX / reflection.mimicDelay;
        reflection.lastY += deltaY / reflection.mimicDelay;

        reflection.setPosition(reflection.lastX, reflection.lastY);
    });
}

function update() {
    // Previous update code...

    // Check if all reflections are destroyed
    if (reflections.countActive(true) === 0) {
        this.scene.start("NextLevel"); // Load the next level
    }
}

