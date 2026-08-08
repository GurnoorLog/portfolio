import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * VanillaTextType: A high-fidelity vanilla JS port of the TextType React component.
 * Enhanced with anime-style scrambling and tactical block cursor.
 */
class VanillaTextType {
    constructor(element, options = {}) {
        this.el = element;
        this.textArray = Array.isArray(options.text) ? options.text : [options.text];
        this.typingSpeed = options.typingSpeed || 50;
        this.pauseDuration = options.pauseDuration || 2000;
        this.deletingSpeed = options.deletingSpeed || 30;
        this.loop = options.loop !== false;
        this.showCursor = options.showCursor !== false;
        this.cursorCharacter = options.cursorCharacter || '_';
        this.onSentenceComplete = options.onSentenceComplete;
        this.onInitialTypeComplete = options.onInitialTypeComplete;

        this.displayedText = '';
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.currentTextIndex = 0;
        this.timeout = null;
        this.hasFinishedInitialType = false;

        this.init();
    }

    init() {
        this.el.innerHTML = `
            <span class="text-type__content"></span>
            ${this.showCursor ? `<span class="text-type__cursor">${this.cursorCharacter}</span>` : ''}
        `;
        this.contentEl = this.el.querySelector('.text-type__content');
        this.cursorEl = this.el.querySelector('.text-type__cursor');

        if (this.cursorEl) {
            gsap.to(this.cursorEl, {
                opacity: 0,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        }

        this.execute();
    }

    execute() {
        const currentText = this.textArray[this.currentTextIndex];

        if (this.isDeleting) {
            if (this.displayedText === '') {
                this.isDeleting = false;
                if (this.currentTextIndex === this.textArray.length - 1 && !this.loop) return;

                if (this.onSentenceComplete) this.onSentenceComplete(currentText, this.currentTextIndex);
                this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
                this.currentCharIndex = 0;
                this.timeout = setTimeout(() => this.execute(), 500);
            } else {
                this.timeout = setTimeout(() => {
                    this.displayedText = this.displayedText.slice(0, -1);
                    this.contentEl.innerText = this.displayedText;
                    this.execute();
                }, this.deletingSpeed);
            }
        } else {
            if (this.currentCharIndex < currentText.length) {
                // Tactical Scramble: Before showing the real char, show a random one for a split second
                const chars = '!@#$%^&*()_+';
                const realChar = currentText[this.currentCharIndex];

                this.timeout = setTimeout(() => {
                    this.displayedText += realChar;
                    this.contentEl.innerText = this.displayedText;
                    this.currentCharIndex++;
                    this.execute();
                }, this.typingSpeed);
            } else {
                if (!this.hasFinishedInitialType) {
                    this.hasFinishedInitialType = true;
                    if (this.onInitialTypeComplete) this.onInitialTypeComplete();
                }

                if (!this.loop && this.currentTextIndex === this.textArray.length - 1) return;
                this.timeout = setTimeout(() => {
                    this.isDeleting = true;
                    this.execute();
                }, this.pauseDuration);
            }
        }
    }

    destroy() {
        clearTimeout(this.timeout);
        this.el.innerHTML = '';
    }
}

/**
 * WorksManager: Orchestrates the Alche Studio style works section and WebGPU background.
 * Ported 'as-is' from test-webgpu/src/test2/
 */
export class WorksManager {
    constructor() {
        this.projects = [
            {
                id: 'project1',
                title: 'SEQTUTOR: NEURAL PEDAGOGY',
                record: 'ARCHIVE_RECORD_01',
                description: 'SEQTUTOR is a state-of-the-art Retrieval-Augmented Generation (RAG) system. It processes high-density data streams—PDFs, YouTube lectures, and web URLs—to create an interactive knowledge graph. Built with a custom vector embedding pipeline, it enables querying complex scientific concepts with sub-second latency.',
                tags: ['#LLM', '#RAG'],
                image: '/phtots_projects/SEQTUTOR.JPG.jpeg',
                codeLink: 'https://github.com/GurnoorLog/SEQTUTOR'
            },
            {
                id: 'project2',
                title: 'RAPTOROSINT: CYBER_PREDATOR',
                record: 'INTEL_LOG_04',
                description: 'RAPTOROSINT is an advanced reconnaissance engine engineered for high-stakes cybersecurity operations. It utilizes autonomous agents to map attack surfaces, perform deep OSINT queries across leaked databases, and automate vulnerability scanning. Developed to secure local nodes and dominate competitive CTF arenas.',
                tags: ['#RECON', '#SECURITY', '#AI-WARFARE'],
                image: '/phtots_projects/raptorOSINT.jpeg',
                codeLink: 'https://github.com/GurnoorLog/RaptorOSINT'
            },
            {
                id: 'project3',
                title: 'ROSALIND-FRANKLIN-REVIVAL',
                record: 'BIO_SYS_RECAP',
                description: "This project explores the intersection of bioinformatics and historical linguistics. By training a specialized LoRA on the correspondence and scientific logs of Rosalind Franklin, we've created a 'digital ghost' capable of explaining DNA diffraction patterns with her original tone and precision. Running on Groq LPUs for near-instant inference.",
                tags: ['#LLAMA-3', '#GROQ', '#BIO_NLP'],
                image: '/phtots_projects/rosalind-revival.jpg',
                codeLink: 'https://github.com/GurnoorLog/rosalind_franklin_revival',
                liveLink: 'https://rosalind-franklin-revival-1015943995500.us-west1.run.app/'
            },
            {
                id: 'project4',
                title: 'VOXELORD: EMPEROR\'S ASCENSION',
                record: 'VOXEL_CORE_V3',
                description: 'VOXELORD is a fully destructive 3D environment built on a custom ray-casted voxel engine. It features complex fluid dynamics and real-time multiplayer synchronization. Players must architect fortresses and manage resource nodes to survive in a high-octane strategic landscape where every pixel can be manipulated or destroyed.',
                tags: ['#VOXELS', '#MULTIPLAYER', '#PHYSICS'],
                image: '/phtots_projects/Voxlord.jpeg',
                codeLink: 'https://github.com/GurnoorLog/Voxelord'
            },
            {
                id: 'project5',
                title: 'ZAN: BROWSER AGENT',
                record: 'AI_AGENT_CORE_V1',
                description: 'Zan is an AI browser agent that controls Google Chrome via CDP. It runs inside a chat UI — you type a task, the agent opens a new browser tab and executes it step by step. Powered by NVIDIA NIM, it has ~20 tools for browser control including navigation, search, click, type, DOM analysis, and image generation.',
                tags: ['#AI', '#BROWSER', '#AGENT'],
                image: '',
                codeLink: 'https://github.com/GurnoorLog/Zan'
            },
            {
                id: 'project6',
                title: 'STARDUST-ARM: RL ROBOTICS',
                record: 'ML_CORE_V2',
                description: 'StardustArm is a reinforcement learning system for a space robotic arm using MuJoCo + Stable-Baselines3 (SAC + HER). A 6-DOF robotic arm mounted on a spaceship learns to reach and grab floating target spheres in zero-gravity through trial and error — no hand-coded IK, just pure RL.',
                tags: ['#RL', '#MUJOCO', '#ROBOTICS'],
                image: '',
                codeLink: 'https://github.com/GurnoorLog/StardustArm'
            },
            {
                id: 'project7',
                title: 'TAMBERBOX: AI LAPTOP',
                record: 'HARDWARE_CORE_V1',
                description: 'Tamberbox is a custom AI laptop built on Orange Pi 5 Ultra. Armbian Noble, Hyprland compiled from source, local Ollama AI, Whisper.cpp offline STT, RKNN NPU acceleration, custom Plymouth boot splash, SDDM samurai theme with animated video background - every single piece was hand-installed, compiled and configured from scratch.',
                tags: ['#ARM64', '#AI', '#HARDWARE'],
                image: '',
                codeLink: 'https://github.com/GurnoorLog/Tamberbox'
            }
        ];

        this.currentIndex = 0;
        this.typingInstance = null;
        this.isLocked = false;
        this.init();
    }

    init() {
        this.renderStructure();
        this.initGSAP();
        this.initCanvasParticles();
    }

    renderStructure() {
        const container = document.getElementById('projects');
        if (!container) return;

        container.innerHTML = `
            <div class="Works__container" data-works-container="">
                <!-- Cinematic Glitch Overlay -->
                <div class="project-glitch-overlay"></div>

                <!-- Background Layer -->
                <div class="Works__backgrounds absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                    ${this.projects.map((p, i) => `
                        <div class="Works__bg_item absolute inset-0 w-full h-full pointer-events-none" 
                             data-bg-id="${p.id}" 
                             style="z-index: ${i + 5}; clip-path: inset(0 0 0 100%); background: #0a0a0f;">
                            <img src="${p.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'}" class="w-full h-full object-cover" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'">
                            <div class="absolute inset-0 bg-charcoal/80 backdrop-blur-[6px]"></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Content Layer (Pinned Section) -->
                <div class="Works__content relative z-50 w-full h-full overflow-hidden" data-works-scroll="">
                    <div class="Works__list flex items-center h-full" style="width: ${this.projects.length * 100}vw;">
                        ${this.projects.map((p, i) => `
                            <div class="Works__item spotlight-card" data-works-id="${p.id}">
                                <!-- Tactical Corner Marks -->
                                <div class="absolute top-20 left-20 w-8 h-8 border-t border-l border-sharingan-red/30"></div>
                                <div class="absolute bottom-20 right-20 w-8 h-8 border-b border-r border-sharingan-red/30"></div>

                                 <div class="Works__item_info flex flex-col items-center gap-4 mb-20">
                                     <div class="flex items-center gap-6">
                                         <span class="tactical-label">TYPE // 開発_ARCHIVE</span>
                                     </div>
                                    <span class="font-header text-[12px] tracking-[0.8em] text-sharingan-red uppercase glow-red-extreme">${p.record}</span>
                                </div>

                                 <div class="content__text-wrap relative">
                                    <div class="text-type flex items-center justify-center min-h-[100px]" id="typing-target-${i}"></div>
                                </div>

                                <!-- Center Bottom Trigger: ACCESS_DETAILS -->
                                <div class="absolute bottom-32 left-1/2 -translate-x-1/2 z-30">
                                    <button class="details-trigger group/btn relative px-8 py-2 overflow-hidden transition-all duration-300" data-project-index="${i}">
                                        <div class="absolute inset-0 bg-white/5 border border-white/10 skew-x-[-20deg] group-hover/btn:bg-sharingan-red group-hover/btn:border-sharingan-red transition-all duration-500"></div>
                                        <div class="relative flex items-center space-x-3 text-white/40 group-hover/btn:text-white transition-colors duration-300">
                                            <span class="font-header text-[9px] tracking-[0.4em]">ACCESS_DETAILED_INFO</span>
                                            <div class="w-2 h-2 border-r border-b border-current rotate-45 group-hover/btn:translate-x-1 transition-transform"></div>
                                        </div>
                                    </button>
                                </div>

                                <div class="mt-8 flex flex-col items-center space-y-4">
                                    <!-- Japanese Deco -->
                                    <span class="font-header text-[7px] text-sharingan-red/40 tracking-[2em] uppercase">高度なインターフェース設計</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- BEGIN: Tactical Detailed Info Tab -->
                <div id="project-details-overlay" class="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center">
                    <div id="overlay-bg" class="absolute inset-0 backdrop-blur-sm bg-sharingan-red/5 opacity-0 transition-opacity duration-700 pointer-events-none">
                        <!-- Scanning Line -->
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-sharingan-red/10 to-transparent h-1 w-full animate-scan pointer-events-none"></div>
                    </div>

                    <div id="details-tab" class="w-full max-w-4xl bg-deep-black/95 backdrop-blur-2xl border-t border-sharingan-red/30 p-12 transition-all duration-700 translate-y-full pointer-events-auto relative" style="clip-path: polygon(2% 0, 98% 0, 100% 20%, 100% 100%, 0 100%, 0 20%);">
                        <!-- Close Button -->
                        <button id="close-details" class="absolute top-6 right-10 group/close">
                            <span class="font-header text-[8px] text-white/20 group-hover/close:text-sharingan-red tracking-[0.5em] transition-colors uppercase">EXIT_MODULE // 閉じる</span>
                        </button>

                        <div id="details-content" class="grid grid-cols-1 md:grid-cols-2 gap-12 opacity-0">
                            <div>
                                <h4 class="font-header text-[10px] text-sharingan-red tracking-[0.5em] mb-4 uppercase">PRJ_SYNOPSIS_01</h4>
                                <p id="details-desc" class="font-header text-sm text-white/80 leading-relaxed tracking-wide"></p>
                            </div>
                            <div class="space-y-8">
                                <div>
                                    <h4 class="font-header text-[10px] text-sharingan-red tracking-[0.5em] mb-4 uppercase">CORE_TECH_STACK</h4>
                                    <div id="details-tags" class="flex flex-wrap gap-3"></div>
                                </div>
                                <div class="flex gap-6">
                                    <a id="details-code" href="#" target="_blank" class="tactical-btn">
                                        <span class="btn-glitch-text">VIEW_SOURCE</span>
                                        <div class="btn-decor-line"></div>
                                    </a>
                                    <a id="details-live" href="#" target="_blank" class="tactical-btn secondary">
                                        <span class="btn-glitch-text">LIVE_LINK</span>
                                        <div class="btn-decor-line"></div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Technical Accents -->
                        <div class="absolute top-0 left-10 w-px h-20 bg-gradient-to-b from-sharingan-red/50 to-transparent"></div>
                        <div class="absolute top-4 left-12 font-mono text-[6px] text-white/10 tracking-[1em] vertical-text">MODULE_ACCESS_V7</div>
                    </div>
                </div>
                <!-- END: Tactical Detailed Info Tab -->

                <!-- Premium Tactical HUD Navigation -->
                <div class="Works__nav absolute bottom-12 left-0 w-full px-12 z-20 flex items-end justify-between">
                    <div class="flex flex-col space-y-2">
                         <div class="flex items-center space-x-3 mb-1">
                            <div class="w-1 h-1 bg-sharingan-red"></div>
                            <span class="tactical-label">STATUS // 同期済み_SYNCED</span>
                         </div>
                         <span class="font-header text-[14px] text-white tracking-widest uppercase" id="nav-record-id">${this.projects[0].record}</span>
                         <div class="w-32 h-[2px] bg-gradient-to-r from-sharingan-red to-transparent"></div>
                    </div>

                    <div class="flex flex-col items-center space-y-6">
                        <div class="flex space-x-6 items-center">
                            ${this.projects.map((_, i) => `
                                <div class="works-dot relative group cursor-pointer" data-index="${i}">
                                    <div class="w-2 h-2 border border-white/20 transition-all duration-300 group-hover:border-sharingan-red"></div>
                                    <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[6px] text-white/0 group-hover:text-white/40 transition-all">0${i + 1}</span>
                                </div>
                            `).join('')}
                        </div>
                        <span class="font-header text-[7px] text-white/20 tracking-[1.5em] uppercase">Sequence_Node_Archive</span>
                    </div>

                    <div class="flex flex-col items-end space-y-2">
                         <span class="tactical-label">OS // G_TAMBER.SYS_V4.0</span>
                         <div class="bg-sharingan-red/10 px-4 py-1 border border-sharingan-red/20">
                            <span class="font-header text-[10px] text-sharingan-red tracking-widest uppercase animate-pulse">Live</span>
                         </div>
                    </div>
                </div>
            </div>
        `;
    }

    initGSAP() {
        const sections = gsap.utils.toArray('.Works__item');
        const container = document.querySelector('.Works__list');
        const dots = document.querySelectorAll('.works-dot');
        const glitchOverlay = document.querySelector('.project-glitch-overlay');

        if (!container) return;

        // Horizonal Pinning ScrollTrigger
        this.scrollTrigger = ScrollTrigger.create({
            trigger: "#projects",
            pin: true,
            start: "top top",
            scrub: 0.5,
            // Proportional end based on number of items - this controls how "long" the horizontal scroll is
            end: () => `+=${this.projects.length * 100}%`,
            snap: {
                snapTo: 1 / (this.projects.length - 1),
                duration: { min: 0.1, max: 0.4 },
                delay: 0,
                ease: "power3.out"
            },
            onUpdate: (self) => {
                const progress = self.progress;
                const velocity = self.getVelocity();
                const skew = gsap.utils.clamp(-5, 5, velocity / 300);

                // Move and Skew the list horizontally
                gsap.set(container, {
                    xPercent: -progress * (100 - (100 / this.projects.length)),
                    skewX: skew
                });

                // Focus Scaling, Parallax & Continuous Background Reveal
                const bgs = document.querySelectorAll('.Works__bg_item');
                sections.forEach((section, i) => {
                    const sectionProgress = (progress * (this.projects.length - 1)) - i;
                    const distance = Math.abs(sectionProgress);
                    const scale = gsap.utils.clamp(0.85, 1, 1 - (distance * 0.15));
                    const bg = bgs[i];
                    const bgImg = bg ? bg.querySelector('img') : null;

                    // Scale and Fade foreground item
                    gsap.set(section, { 
                        scale: scale, 
                        opacity: gsap.utils.clamp(0, 1, 1 - (distance * 1.5)) 
                    });

                    // Continuous Tactical Reveal (Clip-Path synchronization)
                    if (bg) {
                        // Background i reveals as we move from i-1 to i
                        // It should be 100% clipped when progress is i-1, and 0% clipped when progress is i
                        const revealProgress = gsap.utils.clamp(0, 1, (progress * (this.projects.length - 1)) - (i - 1));
                        const clipValue = 100 - (revealProgress * 100);

                        gsap.set(bg, {
                            clipPath: `inset(0 0 0 ${clipValue}%)`,
                            opacity: 1, // Keep all active
                            zIndex: i + 2 // Keep backgrounds below z-50 content layer
                        });

                        // Parallax & Aperture depth on the image itself
                        if (bgImg) {
                            const blur = gsap.utils.clamp(0, 15, distance * 20);
                            const brightness = gsap.utils.clamp(0.3, 1, 1 - (distance * 0.5));
                            gsap.set(bgImg, {
                                xPercent: sectionProgress * 15,
                                filter: `blur(${blur}px) brightness(${brightness})`
                            });
                        }
                    }
                });

                // Update UI elements based on progress
                this.updateActiveProjectByProgress(progress);
            }
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                const st = ScrollTrigger.getById('projects-pin') || ScrollTrigger.getAll().find(s => s.trigger.id === 'projects');
                if (st) {
                    const scrollTarget = st.start + (index / (this.projects.length - 1)) * (st.end - st.start);
                    window.scrollTo({
                        top: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // --- Tactical Details Tab Interaction ---
        const overlay = document.getElementById('project-details-overlay');
        const tab = document.getElementById('details-tab');
        const overlayBg = document.getElementById('overlay-bg');
        const closeBtn = document.getElementById('close-details');
        const triggers = document.querySelectorAll('.details-trigger');

        const openDetails = (index) => {
            const project = this.projects[index];
            if (!project) return;

            // Fill Data
            document.getElementById('details-desc').innerText = project.description;
            const tagsContainer = document.getElementById('details-tags');
            tagsContainer.innerHTML = project.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
            document.getElementById('details-code').href = project.codeLink;
            const liveBtn = document.getElementById('details-live');
            if (project.liveLink) {
                liveBtn.href = project.liveLink;
                liveBtn.style.display = 'flex';
            } else {
                liveBtn.style.display = 'none';
            }

            // Animate
            overlay.style.pointerEvents = 'auto';
            gsap.to(overlayBg, { opacity: 1, duration: 0.5 });
            gsap.to(tab, { y: 0, duration: 0.8, ease: 'expo.out' });
            gsap.to('#details-content', { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
        };

        const closeDetails = () => {
            gsap.to('#details-content', { opacity: 0, y: 20, duration: 0.4 });
            gsap.to(tab, { y: '100%', duration: 0.6, ease: 'expo.in' });
            gsap.to(overlayBg, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => overlay.style.pointerEvents = 'none'
            });
        };

        triggers.forEach(btn => {
            btn.addEventListener('click', () => openDetails(btn.dataset.projectIndex));
        });

        closeBtn?.addEventListener('click', closeDetails);
        overlayBg?.addEventListener('click', closeDetails);

        this.updateActiveProjectByProgress(0);
    }

    updateActiveProjectByProgress(progress) {
        const index = Math.round(progress * (this.projects.length - 1));
        if (index === this.currentIndex && this.typingInstance) return;

        const oldIndex = this.currentIndex;
        this.currentIndex = index;

        const items = document.querySelectorAll('.Works__item');
        const bgs = document.querySelectorAll('.Works__bg_item');
        const dots = document.querySelectorAll('.works-dot');
        const recordId = document.getElementById('nav-record-id');
        const glitchOverlay = document.querySelector('.project-glitch-overlay');

        // Glitch Burst on Index Change
        if (glitchOverlay) {
            gsap.fromTo(glitchOverlay,
                { opacity: 0.3 },
                { opacity: 0, duration: 0.4, ease: "power2.out" }
            );
        }

        if (this.typingInstance) {
            this.typingInstance.destroy();
        }

        // Free-scroll enabled: no locking logic

        items.forEach((item, i) => {
            if (i === index) {
                // Initialize Typing Effect
                const target = document.getElementById(`typing-target-${i}`);
                if (target) {
                    this.typingInstance = new VanillaTextType(target, {
                        text: [this.projects[i].title],
                        typingSpeed: 70,
                        pauseDuration: 1500,
                        loop: true,
                        cursorCharacter: '_',
                        onInitialTypeComplete: () => {
                            // Previously revealed description here, now handled by tab
                        }
                    });
                }

                // Stagger metadata entry
                const info = item.querySelector('.Works__item_info');
                const deco = item.querySelector('.mt-8');
                const trigger = item.querySelector('.details-trigger');
                if (info) gsap.set(info, { opacity: 1, y: 0 });
                if (deco) gsap.set(deco, { opacity: 1, y: 0 });
                if (trigger) gsap.set(trigger, { opacity: 1, scale: 1 });
            }
        });

        dots.forEach((dot, i) => {
            const inner = dot.querySelector('div');
            if (i === index) {
                gsap.to(inner, {
                    width: '32px',
                    height: '2px',
                    borderColor: '#FF0022',
                    backgroundColor: '#FF0022',
                    duration: 0.4
                });
            } else {
                gsap.to(inner, {
                    width: '8px',
                    height: '8px',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'transparent',
                    duration: 0.4
                });
            }
        });

        if (recordId) {
            this.scrambleText(recordId, this.projects[index].record);
        }
    }

    scrambleText(element, targetText) {
        if (element.scrambleIntervalId) {
            clearInterval(element.scrambleIntervalId);
        }
        const chars = '!@#$%^&*()_+{}:"<>?|[];\',./';
        element.dataset.scrambling = "true";
        let iterations = 0;

        element.scrambleIntervalId = setInterval(() => {
            element.innerText = targetText.split('')
                .map((char, index) => {
                    if (index < iterations) return targetText[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= targetText.length) {
                clearInterval(element.scrambleIntervalId);
                delete element.dataset.scrambling;
            }
            iterations += 1 / 3;
        }, 30);
    }

    initCanvasParticles() {
        const canvas = document.getElementById('webgpu-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio, 2);

        let w, h;
        const resize = () => {
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
        };
        resize();
        window.addEventListener('resize', resize);

        const COUNT = 120;
        const particles = Array.from({ length: COUNT }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: Math.random() * 2 + 0.5,
            hue: Math.random() * 60 + 340,
        }));

        let mx = w / 2, my = h / 2;

        const setPos = (x, y) => { mx = x; my = y; };
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            setPos(e.clientX - rect.left, e.clientY - rect.top);
        });
        canvas.addEventListener('touchmove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const t = e.touches[0];
            setPos(t.clientX - rect.left, t.clientY - rect.top);
        }, { passive: true });
        canvas.addEventListener('mouseleave', () => setPos(w / 2, h / 2));
        canvas.addEventListener('touchend', () => setPos(w / 2, h / 2));

        const active = () => document.body.getAttribute('data-current-section') === 'testwebgl';

        const animate = () => {
            requestAnimationFrame(animate);
            if (!active()) return;

            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, w, h);

            for (const p of particles) {
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.hypot(dx, dy);
                const force = Math.min(1, 120 / (dist + 1));

                p.vx += (dx / (dist + 1)) * force * 0.002;
                p.vy += (dy / (dist + 1)) * force * 0.002;
                p.vx *= 0.99;
                p.vy *= 0.99;
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.6)`;
                ctx.fill();
            }

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `hsla(0, 100%, 50%, ${(1 - dist / 80) * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            ctx.restore();
        };

        requestAnimationFrame(animate);
    }
}
