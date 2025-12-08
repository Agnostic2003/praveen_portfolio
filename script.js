// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 0. PRELOADER FALLBACK (in case GSAP or animations fail)
window.addEventListener('load', () => {
    setTimeout(() => {
        // Only act if still in loading state
        if (document.body.classList.contains('loading')) {
            document.body.classList.remove('loading');
            const preloader = document.querySelector('.preloader');
            if (preloader) preloader.style.display = 'none';
        }
    }, 5000);
});

// 1. CUSTOM CURSOR LOGIC (Only runs if elements exist & pointer is fine)
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

// Only enable custom cursor logic on non-touch / fine pointer devices
if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {

    // Add class so CSS hides default cursor
    document.body.classList.add("custom-cursor");

    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate(
            {
                left: `${posX}px`,
                top: `${posY}px`
            },
            { duration: 500, fill: "forwards" }
        );
    });
}

// 2. PRELOADER ANIMATION (main GSAP timeline)
const tl = gsap.timeline();

tl.to(".bar-fill", {
    width: "100%",
    duration: 1.5,
    ease: "power2.inOut"
})
.to(".loader-text, .loader-bar", {
    opacity: 0,
    duration: 0.5
})
.to(".preloader", {
    height: 0,
    duration: 1,
    ease: "power4.inOut"
})
.to("body", {
    overflowY: "scroll",
    onComplete: () => {
        document.body.classList.remove('loading');
    }
}, "-=0.5")
.from(".glitch-header .line", {
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out"
}, "-=0.5");

// 3. RESPONSIVE ANIMATIONS SETUP
ScrollTrigger.matchMedia({

    // DESKTOP ONLY: Horizontal Scroll & Parallax
    "(min-width: 901px)": function () {
        // Parallax Image
        gsap.to(".about-img-wrapper .parallax-img", {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".about-img-wrapper",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Horizontal Project Scroll
        const sections = gsap.utils.toArray(".project-panel");
        const container = document.querySelector(".horizontal-container");

        if (sections.length && container) {
            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".work",
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + container.offsetWidth
                }
            });
        }
    },

    // MOBILE ONLY: Standard Fade Ins
    "(max-width: 900px)": function () {
        // Simple fade up for projects instead of horizontal scroll
        gsap.utils.toArray(".project-panel").forEach(panel => {
            gsap.from(panel, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                scrollTrigger: {
                    trigger: panel,
                    start: "top 85%"
                }
            });
        });
    },

    // ALL SCREENS: Number Counters
    "all": function () {
        const stats = document.querySelectorAll('.num');
        stats.forEach(stat => {
            const target = stat.getAttribute('data-val');
            if (!target) return;

            ScrollTrigger.create({
                trigger: stat,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(stat, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power1.out"
                    });
                }
            });
        });
    }
});
