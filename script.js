document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const mainContent = document.getElementById('main-content');
    const bgCanvas = document.getElementById('bg-canvas');
    const video = document.querySelector('.tribute-video');
    const audio = document.getElementById('background-music');
    const audioControl = document.getElementById('audio-control');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    let isPlaying = false;

    // --- Start Experience ---
    startButton.addEventListener('click', () => {
        startScreen.style.opacity = '0';
        startScreen.addEventListener('transitionend', () => {
            startScreen.style.display = 'none';
        });

        mainContent.classList.add('visible');
        audioControl.style.opacity = '1';
        bgCanvas.style.opacity = '0.7';

        video.muted = false;
        video.play();
        audio.play();
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    });
    
    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        window.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .video-frame, #audio-control').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // --- Manual Audio Control Logic ---
    if (audioControl) {
        audioControl.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });
    }
    
    // --- Cinematic Scroll Animations ---
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));

    // --- Staggered Quote Reveal ---
    const quotes = [
        { text: "The purest thing a man can give is <span class='highlight' style='--highlight-color: var(--accent-red);'>love,</span>" },
        { text: "the bravest thing a man can do is <span class='highlight' style='--highlight-color: var(--accent-blue);'>forgive,</span>" },
        { text: "the rarest thing a man can show is <span class='highlight' style='--highlight-color: var(--accent-green);'>kindness,</span>" },
        { text: "and the greatest enemy a man can face is <span class='highlight' style='--highlight-color: var(--accent-gold);'>himself.</span>" }
    ];
    const quoteContainer = document.getElementById('quoteContainer');
    if (quoteContainer) {
        quoteContainer.innerHTML = quotes.map(q => `<span class="quote-line">${q.text}</span>`).join('');
        const quoteObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const lines = quoteContainer.querySelectorAll('.quote-line');
                lines.forEach((line, i) => {
                    setTimeout(() => line.classList.add('visible'), i * 1500);
                });
                quoteObserver.unobserve(quoteContainer);
            }
        }, { threshold: 0.5 });
        quoteObserver.observe(quoteContainer);
    }
    
    // --- Three.js 3D Starfield ---
    let scene, camera, renderer, stars;
    function init3D() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        
        renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const starGeo = new THREE.BufferGeometry();
        const starVertices = [];
        const colors = [];
        const color = new THREE.Color();
        const palette = [0xdcbaff, 0xffb38a, 0x3b82f6, 0xf0f4f8];

        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
            
            color.setHex(palette[Math.floor(Math.random() * palette.length)]);
            colors.push(color.r, color.g, color.b);
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        let starMaterial = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        stars = new THREE.Points(starGeo, starMaterial);
        scene.add(stars);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        stars.rotation.y += 0.00008;
        renderer.render(scene, camera);
    }

    init3D();
});
