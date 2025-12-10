/* --- 1. NEURAL NETWORK CANVAS BACKGROUND --- */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00f3ff';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
        if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 18000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * innerWidth);
        let y = (Math.random() * innerHeight);
        let directionX = (Math.random() * 0.5) - 0.25;
        let directionY = (Math.random() * 0.5) - 0.25;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(0, 243, 255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

init();
animate();

/* --- 2. MAGNETIC LINKS & BUTTONS --- */
// Logic to pull buttons towards the mouse
const magneticElements = document.querySelectorAll('[data-magnetic]');

if (window.matchMedia("(pointer: fine)").matches) {
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const pos = el.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width / 2;
            const y = e.clientY - pos.top - pos.height / 2;

            gsap.to(el, {
                x: x * 0.3, // Pull strength
                y: y * 0.3,
                duration: 0.2,
                ease: "power1.out"
            });

            // Expand cursor
            document.body.classList.add('hovering');
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            document.body.classList.remove('hovering');
        });
    });

    /* --- 3. RETICLE CURSOR LOGIC --- */
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');

    document.addEventListener('mousemove', (e) => {
        cursorInner.style.top = e.clientY + 'px';
        cursorInner.style.left = e.clientX + 'px';
        
        // Slight lag for outer ring
        gsap.to(cursorOuter, {
            top: e.clientY,
            left: e.clientX,
            duration: 0.15,
            ease: "power1.out"
        });
    });
}

/* --- 4. 3D TILT INIT --- */
VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
});
