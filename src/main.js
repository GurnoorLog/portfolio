import { WorksManager } from './works/portfolio-works.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { StaggeredMenu } from './staggered-menu/StaggeredMenu.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Staggered Menu ---
    new StaggeredMenu({
        position: 'right',
        colors: ['#1a0005', '#3d0008', '#FF0022'],
        menuButtonColor: '#ffffff',
        openMenuButtonColor: '#FF0022',
        changeMenuColorOnOpen: true,
        displayItemNumbering: true,
        displaySocials: true,
        accentColor: '#FF0022',
        items: [
            { label: 'About',    ariaLabel: 'About me',        link: '#about' },
            { label: 'Specs',    ariaLabel: 'My skills',       link: '#expertise' },
            { label: 'Vault',    ariaLabel: 'Projects vault',  link: '#projects' },
            { label: 'Reach',    ariaLabel: 'Contact me',      link: 'mailto:gurnoor.tamber.x.01@gmail.com' },
        ],
        socialItems: [
            { label: 'GitHub',   link: 'https://github.com/GurnoorLog' },
            { label: 'LinkedIn', link: 'https://linkedin.com/in/gurnoortamber' },
        ],
    });

    // --- Brush Paint Boot Screen ---
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) {
        const revealMain = () => {
            bootScreen.classList.add('is-done');
            const hero = document.getElementById('hero-content-wrapper');
            if (hero) {
                gsap.fromTo(hero,
                    { opacity: 0.15, y: 52, filter: 'blur(10px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' });
            }
        };
        window.setTimeout(revealMain, 2450);
        window.setTimeout(() => bootScreen.remove(), 4200);
    }

    window.lenis = new Lenis({
        duration: 2,
        easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic Out for smoother tail
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Force scroll to top on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Reset scroll positions immediately
    window.scrollTo(0, 0);
    window.lenis.scrollTo(0, { immediate: true });

    // Aggressive reset after a short delay to catch any late triggers
    setTimeout(() => {
        window.scrollTo(0, 0);
        window.lenis.scrollTo(0, { immediate: true });
        ScrollTrigger.refresh();
    }, 100);

    function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- Scroll Progress & HUD Tracking ---
    const navProgress = document.getElementById('nav-progress');
    const hudSectionName = document.getElementById('hud-section-name');
    const bladeFill = document.getElementById('blade-progress-fill');

    window.lenis.on('scroll', (e) => {
        ScrollTrigger.update();

        // Update Scroll Progress
        const progress = e.progress;
        if (navProgress) navProgress.style.width = `${progress * 100}%`;
        if (bladeFill) bladeFill.style.height = `${progress * 100}%`;

        // Surface HUD Tracking (Simplified detection)
        const sections = ['about', 'expertise', 'projects'];
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    if (hudSectionName) hudSectionName.innerText = id.toUpperCase();
                    break;
                }
            }
        }
    });

    // --- Tactical Cursor Logic (Premium Refinement) ---
    const cursor = document.getElementById('tactical-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .works-dot, .tactical-btn, .works-dot div');

    if (cursor) {
        let isMagnetic = false;

        window.addEventListener('mousemove', (e) => {
            if (!isMagnetic) {
                gsap.to(cursor, {
                    x: e.clientX - 16,
                    y: e.clientY - 16,
                    opacity: 1,
                    duration: 0.1,
                    ease: 'none'
                });
            }
        });

        window.addEventListener('mousedown', () => {
            gsap.to(cursor, { scale: 0.8, duration: 0.1 });
        });

        window.addEventListener('mouseup', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
            // Click pulse effect
            const pulse = document.createElement('div');
            pulse.className = 'fixed pointer-events-none z-[998] border border-sharingan-red rounded-full opacity-50';
            pulse.style.left = `${cursor.offsetLeft}px`;
            pulse.style.top = `${cursor.offsetTop}px`;
            pulse.style.width = '32px';
            pulse.style.height = '32px';
            document.body.appendChild(pulse);
            gsap.to(pulse, {
                scale: 4,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => pulse.remove()
            });
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                isMagnetic = true;
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                gsap.to(cursor, {
                    x: centerX - 16,
                    y: centerY - 16,
                    scale: 2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                isMagnetic = false;
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Spotlight Follow Cards ---
    document.querySelectorAll('.spotlight-card').forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });

    // Ensure all triggers are calculated from the top
    ScrollTrigger.refresh();

    // --- Sequence 1 Configuration ---
    const canvas1 = document.getElementById('sequence-canvas');
    const context1 = canvas1.getContext('2d');
    const heroText = document.getElementById('glitch-hero-text');
    canvas1.width = 1920;
    canvas1.height = 1080;

    const frameCount1 = 31;
    const currentFrame1 = index => (
        `/public_bak/ezgif-11e26cb9dcc80eab-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images1 = [];
    const sequence1 = { frame: 0 };

    for (let i = 0; i < frameCount1; i++) {
        const img = new Image();
        img.src = currentFrame1(i);
        images1.push(img);
    }


    // --- Sequence 2 Configuration ---
    const canvas2 = document.getElementById('sequence-canvas-2');
    const context2 = canvas2?.getContext('2d');
    const projectsTitle = document.getElementById('projects-title');
    if (canvas2) {
        canvas2.width = 1920;
        canvas2.height = 1080;
    }

    const frameCount2 = 31;
    const currentFrame2 = index => (
        `/ezgif-24a188552f34d63a-jpg/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

    const images2 = [];
    const sequence2 = { frame: 0 };

    for (let i = 0; i < frameCount2; i++) {
        const img = new Image();
        img.src = currentFrame2(i);
        images2.push(img);
    }

    // --- Utility Functions ---
    const triggerGlitch = (targetCanvas, targetText) => {
        if (targetText) targetText.classList.add('is-glitching');
        if (targetCanvas) targetCanvas.classList.add('canvas-glitch');
        setTimeout(() => {
            if (targetText) targetText.classList.remove('is-glitching');
            if (targetCanvas) targetCanvas.classList.remove('canvas-glitch');
        }, 150);
    };

    const glitchPoints = [0.25, 0.5, 0.75];

    // --- Transition Effects ---
    const triggerDataStream = () => {
        const stream = document.getElementById('data-stream-transition');
        if (!stream) return;

        gsap.timeline()
            .to(stream, { opacity: 1, duration: 0.1, ease: 'power2.in' })
            .to(stream, { opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 });
    };

    function render(ctx, canvas, images, frameObj, frameCount, lastGlitchProgressRef, textElement) {
        if (!ctx || !canvas) return;
        const img = images[frameObj.frame];
        if (!img || !img.complete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        const progress = frameObj.frame / (frameCount - 1);
        const opacity = 1 - (progress * 0.4);

        ctx.globalAlpha = opacity;
        ctx.filter = `contrast(${100 + progress * 20}%)`;
        ctx.drawImage(img, x, y, width, height);

        // Glitch trigger logic
        glitchPoints.forEach(point => {
            if (Math.abs(progress - point) < 0.02 && Math.abs(progress - lastGlitchProgressRef.val) > 0.1) {
                triggerGlitch(canvas, textElement);
                lastGlitchProgressRef.val = progress;
            }
        });
    }

    // Wrapping refs for glitch tracking
    const glitchRef1 = { val: 0 };
    const glitchRef2 = { val: 0 };

    // --- Initialization and Event Wiring ---

    // Initial renders
    if (images1[0]) images1[0].onload = () => render(context1, canvas1, images1, sequence1, frameCount1, glitchRef1, heroText);
    if (images2[0]) images2[0].onload = () => render(context2, canvas2, images2, sequence2, frameCount2, glitchRef2, projectsTitle);

    // Timeline 1 (Hero to About)
    const tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scrollytelling',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
        }
    });

    tl1.to(sequence1, {
        frame: frameCount1 - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => render(context1, canvas1, images1, sequence1, frameCount1, glitchRef1, heroText)
    }, 0);

    tl1.to('#hero-content-wrapper', {
        opacity: 0,
        y: -100,
        ease: 'power2.inOut'
    }, 0.1);

    // THE KATANA SLASH
    tl1.to('#katana-line', {
        opacity: 1,
        left: '100%',
        duration: 0.2,
        ease: 'power4.inOut',
        onStart: () => triggerDataStream()
    }, 0.5);

    // THE REVEAL
    tl1.to('#about', {
        opacity: 1,
        x: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.6,
        ease: 'expo.out'
    }, 0.6);

    // Timeline 2 (About to Projects Intro)
    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scrollytelling-2',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
        }
    });

    tl2.fromTo('#sequence-2-content', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1);

    tl2.to(sequence2, {
        frame: frameCount2 - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => render(context2, canvas2, images2, sequence2, frameCount2, glitchRef2, projectsTitle)
    }, 0);

    tl2.to('#sequence-2-content', {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => triggerDataStream()
    }, 0.8);

    // --- WebGL Section Interaction (removed) ---

    // --- Section Tracking ---
    ScrollTrigger.create({
        trigger: '#projects',
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => {
            if (self.isActive) document.body.setAttribute('data-current-section', 'works');
        }
    });

    // --- Works Section Initialization ---
    new WorksManager();
});
