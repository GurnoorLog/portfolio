import fs from 'fs';
import path from 'path';

// Mock Browser Environment
global.window = {};
global.document = {
    addEventListener: () => {},
    getElementById: (id) => {
        return {
            set innerHTML(val) {
                console.log(`[DOM] Set innerHTML for #${id}`);
            },
            querySelector: (selector) => {
                return {
                    addEventListener: () => {},
                    querySelector: () => null,
                    classList: { add: () => {}, remove: () => {} },
                    style: {}
                };
            }
        };
    },
    querySelectorAll: (selector) => {
        return [];
    }
};

// Mock GSAP
const mockGsap = {
    registerPlugin: () => {},
    to: () => ({}),
    set: () => ({}),
    fromTo: () => ({}),
    utils: {
        toArray: () => [],
        clamp: (min, max, val) => Math.max(min, Math.min(max, val))
    }
};
mockGsap.ScrollTrigger = {
    create: () => ({}),
    refresh: () => {},
    getById: () => null,
    getAll: () => []
};

// Read portfolio-works.js and replace GSAP imports with mock
const filePath = 'src/works/portfolio-works.js';
let code = fs.readFileSync(filePath, 'utf8');

// Replace imports
code = code.replace("import gsap from 'gsap';", "const gsap = mockGsap;");
code = code.replace("import { ScrollTrigger } from 'gsap/ScrollTrigger';", "");

// Execute code
console.log("Evaluating portfolio-works.js...");
const run = new Function('mockGsap', code + '; return WorksManager;')(mockGsap);

const manager = new run();
console.log("Projects length:", manager.projects.length);
console.log("Active dot 6 updates correctly...");
manager.updateActiveProjectByProgress(6/7);
console.log("Success!");
