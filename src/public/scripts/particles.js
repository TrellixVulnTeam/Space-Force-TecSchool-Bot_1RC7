var canvas = document.getElementById("particles");
var ctx = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;
var circleArray = [];

window.addEventListener("resize", function (event) {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

function particles(config) {
    let xy;

    canvas.width = width;
    canvas.height = height;
    for (let index = 0; index < config.amount; index++) {
        xy = spawn(config, true);
        circleArray.push(
            new circle(
                xy[0],
                xy[1],
                config.velocity,
                Math.floor(Math.random() * (config.maxSize - config.minSize)) +
                    config.minSize,
                config.colors[Math.floor(Math.random() * config.colors.length)],
                config
            )
        );
    }
    animate();
}

function circle(x, y, v, r, color, config) {
    let xy;
    this.color = color;
    this.x = x;
    this.y = y;
    this.v = v;
    this.r = r;
    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    this.update = () => {
        this.x += this.v[0] + this.r / 5;
        this.y += this.v[1] + this.r / 5;
        if (this.x - this.r >= width || this.y - this.r >= height) {
            xy = spawn(config, false);
            this.x = xy[0];
            this.y = xy[1];
        }
        this.draw();
    };
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    for (let index = 0; index < circleArray.length; index++) {
        circleArray[index].update();
    }
}

function spawn(config, first) {
    let xy = [];
    if (first) {
        if (Math.floor(Math.random() * 2) == 0) {
            xy[1] = Math.floor(Math.random() * config.density) - config.maxSize;
            xy[0] =
                Math.floor(Math.random() * (width - -config.density)) +
                -config.density;
        } else {
            xy[0] = Math.floor(Math.random() * config.density) - config.maxSize;
            xy[1] =
                Math.floor(Math.random() * (height - -config.density)) +
                -config.density;
        }
    } else {
        if (Math.floor(Math.random() * 2) == 0) {
            xy[1] =
                -Math.floor(Math.random() * config.density) - config.maxSize;
            xy[0] =
                Math.floor(Math.random() * (width - -config.density)) +
                -config.density;
        } else {
            xy[0] =
                -Math.floor(Math.random() * config.density) - config.maxSize;
            xy[1] =
                Math.floor(Math.random() * (height - -config.density)) +
                -config.density;
        }
    }
    return xy;
}
