import gsap from 'gsap';
import './StaggeredMenu.css';

/**
 * StaggeredMenu — Vanilla JS port of the React Bits StaggeredMenu component.
 * Inserts its own DOM and self-manages all GSAP animations.
 */
export class StaggeredMenu {
    constructor({
        position = 'right',
        colors = ['#1a0005', '#FF0022'],
        items = [],
        socialItems = [],
        displaySocials = true,
        displayItemNumbering = true,
        menuButtonColor = '#ffffff',
        openMenuButtonColor = '#ffffff',
        accentColor = '#FF0022',
        changeMenuColorOnOpen = true,
        closeOnClickAway = true,
        onMenuOpen = null,
        onMenuClose = null,
    } = {}) {
        this.cfg = {
            position, colors, items, socialItems, displaySocials,
            displayItemNumbering, menuButtonColor, openMenuButtonColor,
            accentColor, changeMenuColorOnOpen, closeOnClickAway,
            onMenuOpen, onMenuClose,
        };

        this.open = false;
        this.busy = false;

        this._render();
        this._initGSAP();
        this._bindEvents();
    }

    /* ── DOM Construction ─────────────────────── */
    _render() {
        const { colors, items, socialItems, displaySocials, displayItemNumbering, accentColor } = this.cfg;

        // Wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'staggered-menu-wrapper';
        if (accentColor) this.wrapper.style.setProperty('--sm-accent', accentColor);

        // Pre-layers (staggered swipe underlays)
        this.preLayersEl = document.createElement('div');
        this.preLayersEl.className = 'sm-prelayers';
        this.preLayerEls = [];

        const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
        let arr = [...raw];
        if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
        arr.forEach(c => {
            const el = document.createElement('div');
            el.className = 'sm-prelayer';
            el.style.background = c;
            this.preLayersEl.appendChild(el);
            this.preLayerEls.push(el);
        });

        // Toggle Button
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'sm-toggle';
        this.toggleBtn.setAttribute('aria-label', 'Open menu');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.toggleBtn.type = 'button';

        this.textLines = ['Menu', 'Close'];
        this.textWrap = document.createElement('span');
        this.textWrap.className = 'sm-toggle-textWrap';
        this.textInner = document.createElement('span');
        this.textInner.className = 'sm-toggle-textInner';
        this._renderTextLines();
        this.textWrap.appendChild(this.textInner);

        this.iconEl = document.createElement('span');
        this.iconEl.className = 'sm-icon';
        this.plusH = document.createElement('span');
        this.plusH.className = 'sm-icon-line';
        this.plusV = document.createElement('span');
        this.plusV.className = 'sm-icon-line';
        this.iconEl.appendChild(this.plusH);
        this.iconEl.appendChild(this.plusV);

        this.toggleBtn.appendChild(this.textWrap);
        this.toggleBtn.appendChild(this.iconEl);

        // Panel
        this.panelEl = document.createElement('aside');
        this.panelEl.className = 'staggered-menu-panel';
        this.panelEl.id = 'staggered-menu-panel';
        this.panelEl.setAttribute('aria-hidden', 'true');

        const inner = document.createElement('div');
        inner.className = 'sm-panel-inner';

        // Nav list
        const ul = document.createElement('ul');
        ul.className = 'sm-panel-list';
        if (displayItemNumbering) ul.dataset.numbering = '';

        items.forEach((it, idx) => {
            const li = document.createElement('li');
            li.className = 'sm-panel-itemWrap';
            const a = document.createElement('a');
            a.className = 'sm-panel-item';
            a.href = it.link || '#';
            if (it.ariaLabel) a.setAttribute('aria-label', it.ariaLabel);
            a.dataset.index = idx + 1;
            const label = document.createElement('span');
            label.className = 'sm-panel-itemLabel';
            label.textContent = it.label;
            a.appendChild(label);
            li.appendChild(a);
            ul.appendChild(li);
        });
        inner.appendChild(ul);

        // Socials
        if (displaySocials && socialItems && socialItems.length) {
            const socDiv = document.createElement('div');
            socDiv.className = 'sm-socials';
            const h3 = document.createElement('h3');
            h3.className = 'sm-socials-title';
            h3.textContent = 'Socials';
            const socList = document.createElement('ul');
            socList.className = 'sm-socials-list';
            socialItems.forEach(s => {
                const li = document.createElement('li');
                li.className = 'sm-socials-item';
                const a = document.createElement('a');
                a.className = 'sm-socials-link';
                a.href = s.link || '#';
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = s.label;
                li.appendChild(a);
                socList.appendChild(li);
            });
            socDiv.appendChild(h3);
            socDiv.appendChild(socList);
            inner.appendChild(socDiv);

            this.socialTitleEl = h3;
            this.socialLinkEls = Array.from(socList.querySelectorAll('.sm-socials-link'));
        }

        // Footer label
        const footer = document.createElement('div');
        footer.className = 'sm-panel-footer';
        footer.textContent = 'GURNOOR_TAMBER // PORTFOLIO_OS_V4';
        inner.appendChild(footer);

        this.panelEl.appendChild(inner);

        // Assemble
        this.wrapper.appendChild(this.preLayersEl);
        this.wrapper.appendChild(this.panelEl);
        document.body.appendChild(this.wrapper);
        document.body.appendChild(this.toggleBtn);
    }

    _renderTextLines() {
        this.textInner.innerHTML = '';
        this.textLines.forEach(t => {
            const span = document.createElement('span');
            span.className = 'sm-toggle-line';
            span.textContent = t;
            this.textInner.appendChild(span);
        });
    }

    /* ── GSAP Initial Setup ───────────────────── */
    _initGSAP() {
        const offX = 100; // always slides from right
        // Set panel and pre-layers off-screen but VISIBLE (opacity:1 overrides CSS opacity:0)
        gsap.set([this.panelEl, ...this.preLayerEls], { xPercent: offX, opacity: 1 });
        gsap.set(this.preLayersEl, { xPercent: 0, opacity: 1 });
        gsap.set(this.plusH, { transformOrigin: '50% 50%', rotate: 0 });
        gsap.set(this.plusV, { transformOrigin: '50% 50%', rotate: 90 });
        gsap.set(this.iconEl, { rotate: 0, transformOrigin: '50% 50%' });
        gsap.set(this.textInner, { yPercent: 0 });
        gsap.set(this.toggleBtn, { color: this.cfg.menuButtonColor });
    }

    /* ── Event Binding ────────────────────────── */
    _bindEvents() {
        this.toggleBtn.addEventListener('click', () => this._toggle());

        if (this.cfg.closeOnClickAway) {
            document.addEventListener('mousedown', (e) => {
                if (this.open &&
                    !this.panelEl.contains(e.target) &&
                    !this.toggleBtn.contains(e.target)) {
                    this._close();
                }
            });
        }
    }

    /* ── Toggle ───────────────────────────────── */
    _toggle() {
        if (this.open) this._close();
        else this._openMenu();
    }

    /* ── Open ─────────────────────────────────── */
    _openMenu() {
        if (this.busy) return;
        this.busy = true;
        this.open = true;

        this.toggleBtn.setAttribute('aria-expanded', 'true');
        this.panelEl.setAttribute('aria-hidden', 'false');
        this.cfg.onMenuOpen?.();

        this._animateIcon(true);
        this._animateColor(true);
        this._animateText(true);

        const itemEls = Array.from(this.panelEl.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(this.panelEl.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));

        gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        gsap.set(numberEls, { '--sm-num-opacity': 0 });
        if (this.socialTitleEl) gsap.set(this.socialTitleEl, { opacity: 0 });
        if (this.socialLinkEls) gsap.set(this.socialLinkEls, { y: 25, opacity: 0 });

        const tl = gsap.timeline({
            onComplete: () => { this.busy = false; }
        });

        // Staggered pre-layers swipe in
        this.preLayerEls.forEach((el, i) => {
            tl.fromTo(el, { xPercent: 100 }, { xPercent: 0, duration: 0.48, ease: 'power4.out' }, i * 0.07);
        });

        const panelStart = (this.preLayerEls.length - 1) * 0.07 + 0.08;

        // Panel swipes in
        tl.fromTo(this.panelEl, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, panelStart);

        // Item labels animate in
        if (itemEls.length) {
            tl.to(itemEls, {
                yPercent: 0, rotate: 0, duration: 1,
                ease: 'power4.out',
                stagger: { each: 0.1, from: 'start' }
            }, panelStart + 0.1);
        }

        if (numberEls.length) {
            tl.to(numberEls, {
                '--sm-num-opacity': 1, duration: 0.6, ease: 'power2.out',
                stagger: { each: 0.08 }
            }, panelStart + 0.2);
        }

        if (this.socialTitleEl) {
            tl.to(this.socialTitleEl, { opacity: 1, duration: 0.5, ease: 'power2.out' }, panelStart + 0.35);
        }
        if (this.socialLinkEls && this.socialLinkEls.length) {
            tl.to(this.socialLinkEls, {
                y: 0, opacity: 1, duration: 0.55,
                ease: 'power3.out', stagger: { each: 0.08 }
            }, panelStart + 0.4);
        }

        this._openTl = tl;
    }

    /* ── Close ────────────────────────────────── */
    _close() {
        this._openTl?.kill();
        this.open = false;

        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.panelEl.setAttribute('aria-hidden', 'true');
        this.cfg.onMenuClose?.();

        this._animateIcon(false);
        this._animateColor(false);
        this._animateText(false);

        const all = [...this.preLayerEls, this.panelEl];
        gsap.to(all, {
            xPercent: 100, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
            onComplete: () => {
                const itemEls = Array.from(this.panelEl.querySelectorAll('.sm-panel-itemLabel'));
                gsap.set(itemEls, { yPercent: 140, rotate: 10 });
                this.busy = false;
            }
        });
    }

    /* ── Icon spin ────────────────────────────── */
    _animateIcon(opening) {
        this._spinTween?.kill();
        this._spinTween = gsap.to(this.iconEl, {
            rotate: opening ? 225 : 0,
            duration: opening ? 0.8 : 0.35,
            ease: opening ? 'power4.out' : 'power3.inOut',
            overwrite: 'auto'
        });
    }

    /* ── Button colour ────────────────────────── */
    _animateColor(opening) {
        this._colorTween?.kill();
        if (this.cfg.changeMenuColorOnOpen) {
            this._colorTween = gsap.to(this.toggleBtn, {
                color: opening ? this.cfg.openMenuButtonColor : this.cfg.menuButtonColor,
                delay: 0.18, duration: 0.3, ease: 'power2.out'
            });
        }
    }

    /* ── Text cycle ───────────────────────────── */
    _animateText(opening) {
        this._textTween?.kill();
        const from = opening ? 'Menu' : 'Close';
        const to   = opening ? 'Close' : 'Menu';
        const cycles = 3;
        const seq = [from];
        let last = from;
        for (let i = 0; i < cycles; i++) {
            last = last === 'Menu' ? 'Close' : 'Menu';
            seq.push(last);
        }
        if (last !== to) seq.push(to);
        seq.push(to);
        this.textLines = seq;
        this._renderTextLines();

        gsap.set(this.textInner, { yPercent: 0 });
        const finalShift = ((seq.length - 1) / seq.length) * 100;
        this._textTween = gsap.to(this.textInner, {
            yPercent: -finalShift,
            duration: 0.5 + seq.length * 0.07,
            ease: 'power4.out'
        });
    }
}

export default StaggeredMenu;
