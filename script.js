// QUANTUM GUARDIAN - DYNAMIC SYSTEM CONTROLLER

document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. SYSTEM BOOT AND DIAGNOSTIC SEQUENCE (LOADER)
    // ==================================================
    const loader = document.getElementById('loader');
    const loadProgress = document.getElementById('load-progress');
    const loaderConsole = document.getElementById('loader-console');

    const bootMessages = [
        "[SYSTEM] Booting Quantum Guardian core modules...",
        "[SYSTEM] Running self-test diagnostics...",
        "[HARDWARE] Ouster OS1 LiDAR connection: OK",
        "[HARDWARE] FLIR Thermal sensor array: OK",
        "[HARDWARE] Geiger radiation scintillator calibration: OK",
        "[SOFTWARE] ROS2 Humble middleware layer bound.",
        "[SOFTWARE] Cartographer SLAM map node initialized.",
        "[QUANTUM] Hilbert pathfinder matrix created.",
        "[QUANTUM] Superposition route planner loading...",
        "[CONNECT] Secure satellite telemetry link: ONLINE",
        "[SYSTEM] Ready for autonomous deployment."
    ];

    let progress = 0;
    let bootMsgIndex = 0;

    function runBootloader() {
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 3;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                // Complete boot
                setTimeout(() => {
                    loader.style.opacity = 0;
                    loader.style.visibility = 'hidden';
                    // Initiate animations & canvas runs
                    startDynamicWidgets();
                }, 600);
            }
            
            loadProgress.style.width = progress + '%';
            
            // Add console text sequentially
            if (progress > (bootMsgIndex * (100 / bootMessages.length)) && bootMsgIndex < bootMessages.length) {
                const log = document.createElement('div');
                log.innerText = bootMessages[bootMsgIndex];
                loaderConsole.appendChild(log);
                loaderConsole.scrollTop = loaderConsole.scrollHeight;
                bootMsgIndex++;
                playSynthSound('hover', 600); // sound feedback on log publish
            }
        }, 120);
    }
    
    runBootloader();

    // ==================================================
    // 2. WEB AUDIO API SYNTHESIZER
    // ==================================================
    let audioCtx = null;
    let audioEnabled = false;
    const audioToggle = document.getElementById('audio-toggle');
    const audioLabel = audioToggle.querySelector('.audio-status-label');
    const audioIconPath = audioToggle.querySelector('path');

    // Toggle Audio Context
    audioToggle.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        audioEnabled = !audioEnabled;
        
        if (audioEnabled) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            audioLabel.textContent = "AUDIO ON";
            audioToggle.classList.add('active');
            // Speaker icon
            audioIconPath.setAttribute('d', 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.07,19.86 21,16.28 21,12C21,7.72 18.07,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z');
            playSynthSound('click');
        } else {
            audioLabel.textContent = "AUDIO OFF";
            audioToggle.classList.remove('active');
            // Muted Speaker icon
            audioIconPath.setAttribute('d', 'M3.27,1.44L2,2.72L5.28,6H3V18H7L12,23V12.72L17.28,18C16.5,18.4 15.6,18.7 14.65,18.9L15,20.87C16.46,20.6 17.84,20 19,19.22L21.28,21.5L22.56,20.22L3.27,1.44M10,17.28L7.83,15H5V9H7.83L10,6.83V17.28M12,4L9.91,6.09L12,8.18V4M16.5,12A4.5,4.5 0 0,0 14,8V10.18L16.4,12.58C16.46,12.4 16.5,12.2 16.5,12M19,12C19,12.9 18.82,13.75 18.47,14.54L19.93,16C20.6,14.8 21,13.4 21,12A9,9 0 0,0 14,3.5V5.5C16.89,6.3 19,9 19,12Z');
        }
    });

    // Synth trigger
    function playSynthSound(type, customFreq = null) {
        if (!audioEnabled || !audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } 
        else if (type === 'hover') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(customFreq || 800, now);
            gainNode.gain.setValueAtTime(0.03, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
        }
        else if (type === 'radar-sweep') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
        else if (type === 'collapse') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.4);
            gainNode.gain.setValueAtTime(0.06, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            osc.start(now);
            osc.stop(now + 0.45);
        }
    }

    // Attach hover sound to nav links and buttons
    const hoverElements = document.querySelectorAll('a, button, .pipeline-node, input[type=range], .interaction-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => playSynthSound('hover'));
    });

    // ==================================================
    // 3. AMBIENT RADIATION PARTICLES BACKGROUND
    // ==================================================
    const bgCanvas = document.getElementById('bg-particles');
    const bgCtx = bgCanvas.getContext('2d');
    let particles = [];
    const particleColors = ['rgba(0, 245, 255, 0.4)', 'rgba(57, 255, 20, 0.4)', 'rgba(255, 170, 0, 0.25)'];

    function resizeBgCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resizeBgCanvas();
    window.addEventListener('resize', resizeBgCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * bgCanvas.width;
            this.y = Math.random() * bgCanvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.glow = Math.random() * 10 + 5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce check
            if (this.x < 0 || this.x > bgCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > bgCanvas.height) this.speedY *= -1;
        }

        draw() {
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            bgCtx.fillStyle = this.color;
            bgCtx.shadowBlur = this.glow;
            bgCtx.shadowColor = this.color;
            bgCtx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor(window.innerWidth / 15), 100);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function animateParticles() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        // Reset shadows for background grid overlay
        bgCtx.shadowBlur = 0;

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==================================================
    // 4. HERO SECTION COUNTERS & TELEMETRY
    // ==================================================
    function startDynamicWidgets() {
        // Counter Animation
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const decimals = parseInt(counter.getAttribute('data-decimals')) || 2;
            let current = 0;
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.innerText = current.toFixed(decimals) + suffix;
            }, stepTime);
        });

        // Time Readout
        setInterval(() => {
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            const ms = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
            document.getElementById('hud-timer').innerText = `${timeStr}:${ms}`;
        }, 87);

        // Core Temp Simulation
        let baseTemp = 1584;
        setInterval(() => {
            const dev = (Math.random() - 0.5) * 8;
            const currentTemp = (baseTemp + dev).toFixed(1);
            const coreTempEl = document.getElementById('core-temp');
            if (coreTempEl) coreTempEl.innerText = `${currentTemp}°C`;
        }, 1200);

        // Map telemetry coordinates fluctuation
        setInterval(() => {
            const lat = 48.8584 + (Math.random() - 0.5) * 0.0009;
            const lon = 2.2945 + (Math.random() - 0.5) * 0.0009;
            const alt = 12.4 + (Math.random() - 0.5) * 0.3;
            const rad = Math.floor(480 + (Math.random() - 0.5) * 40);

            document.getElementById('hud-lat').innerText = lat.toFixed(5) + '° N';
            document.getElementById('hud-lon').innerText = lon.toFixed(5) + '° E';
            document.getElementById('hud-alt').innerText = alt.toFixed(1) + ' m';
            document.getElementById('hud-rad').innerText = rad + ' mSv/h';
        }, 900);
    }

    // Interactive mouse hover parallax on Drone Vector HUD
    const droneContainer = document.querySelector('.hologram-drone-container');
    const hudPanel = document.querySelector('.hero-visual-hud');

    if (hudPanel && droneContainer) {
        hudPanel.addEventListener('mousemove', (e) => {
            const rect = hudPanel.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Move container slightly
            const moveX = (x / rect.width) * 20;
            const moveY = (y / rect.height) * 20;
            droneContainer.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
        });

        hudPanel.addEventListener('mouseleave', () => {
            droneContainer.style.transform = `translate(0px, 0px) rotateX(0deg) rotateY(0deg)`;
            droneContainer.style.transition = 'transform 0.5s ease';
        });

        hudPanel.addEventListener('mouseenter', () => {
            droneContainer.style.transition = 'none';
        });
    }

    // ==================================================
    // 5. DIAGNOSTIC SYSTEM LOGS
    // ==================================================
    const logsContainer = document.getElementById('terminal-logs');
    const logPool = [
        { msg: "[INFO] Laser SLAM initialized. Mapping complete.", type: 'log-info' },
        { msg: "[WARN] Structural crack detected on Zone 4 beam.", type: 'log-warn' },
        { msg: "[INFO] Evacuation path superposition matrix constructed.", type: 'log-info' },
        { msg: "[DANGER] High radiation spike. Shielding active.", type: 'log-danger' },
        { msg: "[INFO] Drone unit linked to Command node 1.", type: 'log-info' },
        { msg: "[WARN] Ambient temperature exceeding threshold: 72°C", type: 'log-warn' },
        { msg: "[INFO] Quantum solver collapsed route vector safely.", type: 'log-info' },
        { msg: "[INFO] LIDAR scans 400 points/sec in structural corridor.", type: 'log-info' },
        { msg: "[DANGER] Gas leakage levels at critical density.", type: 'log-danger' }
    ];

    function addLogToTerminal() {
        if (!logsContainer) return;
        const entry = logPool[Math.floor(Math.random() * logPool.length)];
        const logNode = document.createElement('div');
        logNode.className = entry.type;
        
        const timestamp = new Date().toTimeString().split(' ')[0];
        logNode.innerHTML = `<span class="log-time" style="color:var(--text-muted); margin-right:8px;">[${timestamp}]</span>${entry.msg}`;
        
        logsContainer.appendChild(logNode);
        logsContainer.scrollTop = logsContainer.scrollHeight;

        // Cap logs at 30 items
        if (logsContainer.children.length > 30) {
            logsContainer.removeChild(logsContainer.firstChild);
        }
    }
    // Periodic logs
    setInterval(addLogToTerminal, 3500);
    // Initial logs fill
    for (let i = 0; i < 4; i++) {
        addLogToTerminal();
    }

    // ==================================================
    // 6. QUANTUM SUPERPOSITION SIMULATOR CANVAS
    // ==================================================
    const simCanvas = document.getElementById('superposition-canvas');
    const simCtx = simCanvas.getContext('2d');
    const triggerCollapseBtn = document.getElementById('trigger-collapse');
    const collapseOverlay = document.getElementById('collapse-overlay');
    const simStatusText = document.getElementById('sim-status');

    let simWidth = 0;
    let simHeight = 0;
    let pathsCollapsed = false;
    let phase = 0;

    function resizeSimCanvas() {
        if (!simCanvas) return;
        const container = simCanvas.parentElement;
        simWidth = container.clientWidth;
        simHeight = container.clientHeight;
        simCanvas.width = simWidth;
        simCanvas.height = simHeight;
    }
    resizeSimCanvas();
    window.addEventListener('resize', resizeSimCanvas);

    // Obstacles
    const obstacles = [
        { x: 0.35, y: 0.3, r: 35, temp: 400, color: 'rgba(255, 42, 42, 0.4)' },
        { x: 0.65, y: 0.7, r: 45, temp: 600, color: 'rgba(255, 42, 42, 0.45)' },
        { x: 0.5, y: 0.5, r: 30, temp: 200, color: 'rgba(255, 170, 0, 0.3)' }
    ];

    function drawSimulator() {
        if (!simCanvas) return;
        simCtx.clearRect(0, 0, simWidth, simHeight);
        simCtx.shadowBlur = 0;

        // Draw Start and Exit Nodes
        const startX = 40;
        const startY = simHeight / 2;
        const exitX = simWidth - 40;
        const exitY = simHeight / 2;

        // Draw obstacles
        obstacles.forEach(obs => {
            const cx = obs.x * simWidth;
            const cy = obs.y * simHeight;
            
            // Draw warning rings
            simCtx.beginPath();
            simCtx.arc(cx, cy, obs.r + (Math.sin(phase * 4) * 4), 0, Math.PI * 2);
            simCtx.strokeStyle = obs.color;
            simCtx.lineWidth = 1;
            simCtx.stroke();

            // Inner fill core
            simCtx.beginPath();
            simCtx.arc(cx, cy, obs.r - 5, 0, Math.PI * 2);
            simCtx.fillStyle = 'rgba(2, 2, 4, 0.7)';
            simCtx.fill();
            simCtx.strokeStyle = 'rgba(255, 42, 42, 0.8)';
            simCtx.stroke();
            
            // Icon danger inside obstacles
            simCtx.font = "12px sans-serif";
            simCtx.fillStyle = 'rgba(255, 42, 42, 0.9)';
            simCtx.textAlign = 'center';
            simCtx.textBaseline = 'middle';
            simCtx.fillText("☢", cx, cy);
        });

        if (!pathsCollapsed) {
            // Draw 5 fluctuating wave paths (superposition)
            for (let pathIdx = 0; pathIdx < 5; pathIdx++) {
                simCtx.beginPath();
                simCtx.moveTo(startX, startY);

                const amp = 35 + pathIdx * 12;
                const freq = 0.006 + pathIdx * 0.002;
                const speedOffset = phase * (1 + pathIdx * 0.2);

                for (let x = startX; x <= exitX; x += 10) {
                    // compute sine wave deviation around obstacles
                    let y = startY;
                    
                    // Wave calculation with obstacle repulsion
                    let repellent = 0;
                    obstacles.forEach(obs => {
                        const ox = obs.x * simWidth;
                        const oy = obs.y * simHeight;
                        const dist = Math.abs(x - ox);
                        if (dist < 120) {
                            const strength = (120 - dist) / 120;
                            repellent += strength * amp * Math.sign(oy - startY);
                        }
                    });

                    y += repellent + Math.sin(x * freq + speedOffset) * (20 + Math.cos(phase) * 5);
                    simCtx.lineTo(x, y);
                }

                simCtx.strokeStyle = `rgba(0, 245, 255, ${0.15 + (pathIdx * 0.05)})`;
                simCtx.lineWidth = 1.5;
                simCtx.shadowBlur = 4;
                simCtx.shadowColor = "rgba(0, 245, 255, 0.4)";
                simCtx.stroke();
            }
        } else {
            // Draw collapsed optimal path
            simCtx.beginPath();
            simCtx.moveTo(startX, startY);

            // Straight corridor path mapping around core zones
            const controlPoints = [
                { x: startX, y: startY },
                { x: simWidth * 0.3, y: simHeight * 0.75 },
                { x: simWidth * 0.5, y: simHeight * 0.2 },
                { x: simWidth * 0.7, y: simHeight * 0.35 },
                { x: exitX, y: exitY }
            ];

            // Render smooth bezier curve
            simCtx.beginPath();
            simCtx.moveTo(controlPoints[0].x, controlPoints[0].y);
            for (let i = 1; i < controlPoints.length - 1; i++) {
                const xc = (controlPoints[i].x + controlPoints[i+1].x) / 2;
                const yc = (controlPoints[i].y + controlPoints[i+1].y) / 2;
                simCtx.quadraticCurveTo(controlPoints[i].x, controlPoints[i].y, xc, yc);
            }
            simCtx.lineTo(exitX, exitY);

            simCtx.strokeStyle = 'rgba(57, 255, 20, 0.85)';
            simCtx.lineWidth = 4;
            simCtx.shadowBlur = 15;
            simCtx.shadowColor = 'rgba(57, 255, 20, 0.8)';
            simCtx.stroke();
        }

        // Draw start / end circles
        simCtx.shadowBlur = 0;
        simCtx.beginPath();
        simCtx.arc(startX, startY, 6, 0, Math.PI * 2);
        simCtx.fillStyle = 'var(--accent-cyan)';
        simCtx.fill();

        simCtx.beginPath();
        simCtx.arc(exitX, exitY, 6, 0, Math.PI * 2);
        simCtx.fillStyle = 'var(--accent-green)';
        simCtx.fill();

        // Labels
        simCtx.font = "9px 'Orbitron'";
        simCtx.fillStyle = 'var(--text-muted)';
        simCtx.textAlign = 'center';
        simCtx.fillText("DRONE", startX, startY - 12);
        simCtx.fillText("EXIT", exitX, exitY - 12);

        phase += 0.02;
        requestAnimationFrame(drawSimulator);
    }
    
    // Begin rendering simulator
    setTimeout(drawSimulator, 1000);

    // Dynamic cost equation sliders calculations
    const slideAlpha = document.getElementById('slide-alpha');
    const slideBeta = document.getElementById('slide-beta');
    const slideGamma = document.getElementById('slide-gamma');
    const slideDelta = document.getElementById('slide-delta');
    const slideEpsilon = document.getElementById('slide-epsilon');

    const labelAlpha = document.getElementById('val-alpha');
    const labelBeta = document.getElementById('val-beta');
    const labelGamma = document.getElementById('val-gamma');
    const labelDelta = document.getElementById('val-delta');
    const labelEpsilon = document.getElementById('val-epsilon');
    const labelTotalCost = document.getElementById('total-cost');

    // Values of environment indicators
    const R_radRisk = 4.2;
    const T_time = 3.6;
    const H_heat = 5.1;
    const C_collision = 1.4;
    const E_energy = 2.8;

    function calculateFormulaCost() {
        const a = parseFloat(slideAlpha.value);
        const b = parseFloat(slideBeta.value);
        const g = parseFloat(slideGamma.value);
        const d = parseFloat(slideDelta.value);
        const e = parseFloat(slideEpsilon.value);

        // Labels display
        labelAlpha.innerText = a.toFixed(1);
        labelBeta.innerText = b.toFixed(1);
        labelGamma.innerText = g.toFixed(1);
        labelDelta.innerText = d.toFixed(1);
        labelEpsilon.innerText = e.toFixed(1);

        // Equation Cost
        const cost = (a * R_radRisk) + (b * T_time) + (g * H_heat) + (d * C_collision) + (e * E_energy);
        labelTotalCost.innerText = cost.toFixed(2);
    }

    [slideAlpha, slideBeta, slideGamma, slideDelta, slideEpsilon].forEach(slider => {
        slider.addEventListener('input', calculateFormulaCost);
    });
    calculateFormulaCost(); // Run once initially

    // Trigger Route Collapse Click
    triggerCollapseBtn.addEventListener('click', () => {
        if (pathsCollapsed) {
            // Reset
            pathsCollapsed = false;
            triggerCollapseBtn.innerText = "TRIGGER ROUTE COLLAPSE";
            simStatusText.innerText = "STANDBY";
            simStatusText.style.color = "var(--accent-green)";
            playSynthSound('click');
        } else {
            // Trigger
            collapseOverlay.classList.add('active');
            simStatusText.innerText = "COMPUTING...";
            playSynthSound('collapse');
            
            setTimeout(() => {
                collapseOverlay.classList.remove('active');
                pathsCollapsed = true;
                triggerCollapseBtn.innerText = "RESET MATRIX SCAN";
                simStatusText.innerText = "ROUTE OPTIMIZED";
                simStatusText.style.color = "var(--accent-green)";
                playSynthSound('click');
            }, 1200);
        }
    });

    // ==================================================
    // 7. QUANTUM RADAR SCAN CANVAS
    // ==================================================
    const radarCanvas = document.getElementById('radar-canvas');
    const radarCtx = radarCanvas.getContext('2d');
    let radarWidth = 0;
    let radarHeight = 0;
    let radarSweepAngle = 0;

    function resizeRadarCanvas() {
        if (!radarCanvas) return;
        const container = radarCanvas.parentElement;
        radarWidth = container.clientWidth;
        radarHeight = container.clientHeight;
        radarCanvas.width = radarWidth;
        radarCanvas.height = radarHeight;
    }
    resizeRadarCanvas();
    window.addEventListener('resize', resizeRadarCanvas);

    // Blips
    const blips = [
        { r: 75, angle: 0.8, strength: 0.9, type: 'RAD', size: 5, label: "HOTSPOT 1" },
        { r: 120, angle: 2.3, strength: 0.7, type: 'THERMAL', size: 4, label: "LIFE SIGN" },
        { r: 50, angle: 4.1, strength: 0.5, type: 'MAG', size: 4, label: "BEAM BEND" }
    ];

    function drawRadar() {
        if (!radarCanvas) return;
        radarCtx.clearRect(0, 0, radarWidth, radarHeight);
        radarCtx.shadowBlur = 0;

        const cx = radarWidth / 2;
        const cy = radarHeight / 2;
        const maxRadius = Math.min(radarWidth, radarHeight) / 2 - 15;

        // Concentric Circles
        radarCtx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
        radarCtx.lineWidth = 1;
        for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
            radarCtx.beginPath();
            radarCtx.arc(cx, cy, r, 0, Math.PI * 2);
            radarCtx.stroke();
            // concentric coordinate metrics
            radarCtx.font = "8px 'Rajdhani'";
            radarCtx.fillStyle = "rgba(0, 245, 255, 0.35)";
            radarCtx.fillText(`${Math.round(r)}m`, cx + r + 3, cy - 3);
        }

        // Crosshairs
        radarCtx.beginPath();
        radarCtx.moveTo(cx - maxRadius, cy);
        radarCtx.lineTo(cx + maxRadius, cy);
        radarCtx.moveTo(cx, cy - maxRadius);
        radarCtx.lineTo(cx, cy + maxRadius);
        radarCtx.stroke();

        // Sweeping Sector Arc Glow
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.arc(cx, cy, maxRadius, radarSweepAngle - 0.25, radarSweepAngle);
        radarCtx.closePath();
        const radGrad = radarCtx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
        radGrad.addColorStop(0, 'rgba(0, 245, 255, 0.1)');
        radGrad.addColorStop(1, 'rgba(0, 245, 255, 0.25)');
        radarCtx.fillStyle = radGrad;
        radarCtx.fill();

        // Draw rotating scanner line
        radarCtx.beginPath();
        radarCtx.moveTo(cx, cy);
        radarCtx.lineTo(cx + Math.cos(radarSweepAngle) * maxRadius, cy + Math.sin(radarSweepAngle) * maxRadius);
        radarCtx.strokeStyle = 'var(--accent-cyan)';
        radarCtx.lineWidth = 1.5;
        radarCtx.stroke();

        // Render Blips
        blips.forEach(blip => {
            const bx = cx + Math.cos(blip.angle) * blip.r;
            const by = cy + Math.sin(blip.angle) * blip.r;

            // Calculate angle difference to check sweep collision
            let diff = radarSweepAngle - blip.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            if (Math.abs(diff) < 0.1 && diff > 0) {
                blip.intensity = 1.0;
                playSynthSound('radar-sweep');
            } else {
                blip.intensity = blip.intensity ? blip.intensity - 0.007 : 0.2;
                if (blip.intensity < 0.2) blip.intensity = 0.2;
            }

            // Draw glowing dot
            if (blip.intensity > 0.2) {
                radarCtx.beginPath();
                radarCtx.arc(bx, by, blip.size + (blip.intensity * 3), 0, Math.PI * 2);
                radarCtx.fillStyle = blip.type === 'RAD' ? `rgba(255, 42, 42, ${blip.intensity})` : `rgba(57, 255, 20, ${blip.intensity})`;
                radarCtx.shadowBlur = 10;
                radarCtx.shadowColor = blip.type === 'RAD' ? 'var(--accent-danger)' : 'var(--accent-green)';
                radarCtx.fill();

                // Draw label metadata
                radarCtx.shadowBlur = 0;
                radarCtx.font = "8px 'Orbitron'";
                radarCtx.fillStyle = "rgba(255, 255, 255, " + blip.intensity + ")";
                radarCtx.fillText(blip.label, bx + 10, by - 5);
                radarCtx.fillText(`${blip.type}: ${Math.round(blip.r * 1.8)}%`, bx + 10, by + 5);
            }
        });

        radarSweepAngle += 0.025;
        if (radarSweepAngle > Math.PI * 2) radarSweepAngle = 0;

        requestAnimationFrame(drawRadar);
    }
    setTimeout(drawRadar, 1000);

    // ==================================================
    // 8. INTERACTIVE PIPELINE STEPS
    // ==================================================
    const pipelineNodes = document.querySelectorAll('.pipeline-node');
    const pipelineInfoCard = document.getElementById('pipeline-info-card');
    const pipelineTitle = document.getElementById('pipeline-title');
    const pipelineLatency = document.getElementById('pipeline-latency');
    const pipelineProtocol = document.getElementById('pipeline-protocol');
    const pipelineDesc = document.getElementById('pipeline-desc');

    const pipelineData = [
        {
            title: "Disaster Detection",
            latency: "0.05 ms",
            protocol: "ROS2_ALERT_DAEMON",
            desc: "Quantum Guardian drones constantly monitor alert systems. Instantly upon receiving alert signals, units deploy from secure charging lockers and enter the nuclear core facility."
        },
        {
            title: "Environment Mapping",
            latency: "0.22 ms",
            protocol: "OUSTER_LIDAR_SLAM",
            desc: "Onboard solid-state LiDAR sensors emit millions of laser pulses per second. Real-time visual SLAM overlays current structure grids with reactor design schematics."
        },
        {
            title: "Hazard Analysis",
            latency: "0.15 ms",
            protocol: "SCINTILLATOR_MATRIX",
            desc: "Miniature Geiger matrices sample isotope counts while thermal arrays capture temperature anomalies. Hazardous zone barriers are generated virtually inside the spatial map."
        },
        {
            title: "Superposition Path Generation",
            latency: "0.45 ms",
            protocol: "HILBERT_SOLVER",
            desc: "The drone generates millions of hypothetical escape paths within a mathematical Hilbert space. These routes are simulated simultaneously to optimize parameter outputs."
        },
        {
            title: "Quantum-Inspired Optimization",
            latency: "0.12 ms",
            protocol: "Q_ANNEAL_CORES",
            desc: "Variables R (Radiation), T (Time), H (Heat), C (Collision) are weighted against the current battery levels. Probability amplitudes collapse to isolate the lowest cost vector."
        },
        {
            title: "Optimal Escape Route Selection",
            latency: "0.08 ms",
            protocol: "TRAJECTORY_LOCK",
            desc: "The optimal route coordinate array is finalized. The flight system locks navigation vectors onto the escape map, steering clear of hazardous rubble zones."
        },
        {
            title: "Human Evacuation Guidance",
            latency: "1.10 ms",
            protocol: "HOLO_PROJ_AUDIO",
            desc: "Using green lasers, dynamic holographic arrows, and synthetic voice systems, the drone guides trapped survivors along the computed optimal path to safety."
        }
    ];

    pipelineNodes.forEach(node => {
        node.addEventListener('click', () => {
            // Remove active from all nodes
            pipelineNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            // Find data index
            const stepIdx = parseInt(node.getAttribute('data-step'));
            const data = pipelineData[stepIdx];

            // Trigger ripple slide card animation
            pipelineInfoCard.style.transform = 'translateY(10px)';
            pipelineInfoCard.style.opacity = '0';
            playSynthSound('click');

            setTimeout(() => {
                pipelineTitle.innerText = data.title;
                pipelineLatency.innerText = data.latency;
                pipelineProtocol.innerText = data.protocol;
                pipelineDesc.innerText = data.desc;
                
                pipelineInfoCard.style.transform = 'translateY(0)';
                pipelineInfoCard.style.opacity = '1';
            }, 200);
        });
    });

    // ==================================================
    // 9. DYNAMIC RESEARCH SPEC DOWNLOAD
    // ==================================================
    const btnDownload = document.getElementById('btn-download-research');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            playSynthSound('click');
            const documentContent = `========================================================
QUANTUM GUARDIAN: AUTONOMOUS NUCLEAR DRONE TECH ARCHITECTURE
========================================================
Classification: RESEARCH PROJECT / PROTOTYPE YEAR 2045
Department: Nuclear Emergency Response Division

1. SYSTEM COMPONENT SPECS
--------------------------------------------------------
- Core Compute: NVIDIA Jetson Orin Nano / RT-Kernel Core
- Sensors: Ouster OS1-32 Solid-State LiDAR, FLIR Thermal
- Radiation Node: Matrix-Scintillator Quantum Detector
- Battery: High-Density Graphene Storage (120 min runtime)

2. CORE ALGORITHM LAYERS
--------------------------------------------------------
- Spatial SLAM: RTAB-Map ROS2 package
- Route Optimization: Superposition Hilbert Solver
- Equation: Cost = αR + βT + γH + δC + εE
- Guided Guidance: Vector Laser projection matrix v2

3. RECONNAISSANCE PROTOCOL
--------------------------------------------------------
Deploy Command -> Auto SLAM -> Heat Overlay -> collapse -> escape

End of Transmission.
========================================================`;
            
            const blob = new Blob([documentContent], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Quantum_Guardian_Specs_2045.txt';
            link.click();
        });
    }

    // ==================================================
    // 10. INTERACTIVE FULLSCREEN MELTDOWN SIMULATION
    // ==================================================
    const startSimBtn = document.getElementById('btn-start-simulation');
    const abortSimBtn = document.getElementById('btn-abort-simulation');
    const simOverlay = document.getElementById('simulation-overlay');
    const simTelemetry = document.getElementById('sim-telemetry');
    const simAlt = document.getElementById('sim-alt');
    const simRad = document.getElementById('sim-rad');
    const simStatusLabel = document.getElementById('sim-status-label');

    let simActive = false;
    let simInterval = null;
    let alarmInterval = null;

    if (startSimBtn && abortSimBtn && simOverlay) {
        startSimBtn.addEventListener('click', () => {
            simActive = true;
            simOverlay.classList.add('active');
            simTelemetry.innerHTML = "<div>[SIM] INITIALIZING SIMULATOR CORRIDOR...</div>";
            playSynthSound('click');
            
            // Start Simulation loop
            runMeltdownSimulation();
        });

        abortSimBtn.addEventListener('click', () => {
            simActive = false;
            simOverlay.classList.remove('active');
            clearInterval(simInterval);
            clearInterval(alarmInterval);
            playSynthSound('click');
        });
    }

    const simLogs = [
        "Deploying GDN-X9 Unit into Reactor Core 4...",
        "LiDAR Connection Established. Syncing 3D Mesh.",
        "Geiger Count: 480 mSv/h. Shielding active.",
        "Thermal scan complete. Human heat signature located in Zone B.",
        "Calculating superposition vector trajectories...",
        "Obstacle detected: Collapsed concrete debris blocking Tunnel 1.",
        "Wavefunction route collapsing into optimal route...",
        "Escape trajectory locked. Navigation path projected in green laser.",
        "Emitting acoustic evacuation commands to survivors...",
        "Survivors guided onto escape path. Escorting assets...",
        "Unit entered safe portal zone. Meltdown evacuation complete.",
        "SIMULATION SUCCESSFUL. Unit docked."
    ];

    function runMeltdownSimulation() {
        let logIndex = 0;
        let alt = 0.0;
        let rad = 250;
        simStatusLabel.innerText = "CALCULATING";
        simStatusLabel.style.color = "var(--accent-warning)";

        // Alarm Loop Sound
        if (audioEnabled && audioCtx) {
            alarmInterval = setInterval(() => {
                if (!simActive) return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            }, 900);
        }

        // Metrics and logs loop
        simInterval = setInterval(() => {
            if (!simActive) {
                clearInterval(simInterval);
                clearInterval(alarmInterval);
                return;
            }

            // Append simulation log
            if (logIndex < simLogs.length) {
                const log = document.createElement('div');
                log.innerText = `[${new Date().toLocaleTimeString()}] ${simLogs[logIndex]}`;
                simTelemetry.appendChild(log);
                simTelemetry.scrollTop = simTelemetry.scrollHeight;

                // Adjust metrics
                alt = Math.min(15.0, alt + Math.random() * 2.5);
                rad = Math.floor(Math.min(980, rad + Math.random() * 90));
                
                simAlt.innerText = alt.toFixed(1) + "m";
                simRad.innerText = rad + " mSv";

                if (logIndex === 4) {
                    simStatusLabel.innerText = "COLLAPSING";
                    simStatusLabel.style.color = "var(--accent-cyan)";
                } else if (logIndex === 7) {
                    simStatusLabel.innerText = "PATH LOCKED";
                    simStatusLabel.style.color = "var(--accent-green)";
                } else if (logIndex === 11) {
                    simStatusLabel.innerText = "COMPLETED";
                    simStatusLabel.style.color = "var(--accent-green)";
                    clearInterval(simInterval);
                    clearInterval(alarmInterval);
                }
                
                logIndex++;
            }
        }, 2200);
    }
});
