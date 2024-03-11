// CanvasComponent.js
"use client"
import { useEffect, useRef } from 'react';

export default function CanvasComponent() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            return; // Skip if we're on the server
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Add these lines to set the canvas to overlay the content
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '25';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.pointerEvents = 'none';

        let w, h, balls = [];
        let mouse = {
            x: undefined,
            y: undefined
        }
        let rgb = [
            "rgb(26, 188, 156)", "rgb(46, 204, 113)", "rgb(52, 152, 219)",
            "rgb(155, 89, 182)", "rgb(241, 196, 15)", "rgb(230, 126, 34)", "rgb(231, 76, 60)"
        ]

        const resizeReset = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        class Ball {
            constructor() {
                this.start = {
                    x: mouse.x + getRandomInt(-10, 10),
                    y: mouse.y + getRandomInt(-10, 10),
                    size: getRandomInt(4, 7)
                }
                this.end = {
                    x: this.start.x + getRandomInt(-100, 100),
                    y: this.start.y + getRandomInt(-100, 100)
                }

                this.x = this.start.x;
                this.y = this.start.y;
                this.size = this.start.size;

                this.style = rgb[getRandomInt(0, rgb.length - 1)];

                this.time = 0;
                this.ttl = 120;
            }
            draw() {
                ctx.fillStyle = this.style;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            update() {
                if (this.time <= this.ttl) {
                    let progress = 1 - (this.ttl - this.time) / this.ttl;

                    this.size = this.start.size * (1 - easeOutQuart(progress));
                    this.x = this.x + (this.end.x - this.x) * 0.01;
                    this.y = this.y + (this.end.y - this.y) * 0.01;
                }
                this.time++;
            }
        }

        const drawBalls = () => {
            for (let i = 0; i < balls.length; i++) {
                balls[i].update();
                balls[i].draw();
            }
        }

        const animationLoop = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            drawBalls();

            let temp = [];
            for (let i = 0; i < balls.length; i++) {
                if (balls[i].time <= balls[i].ttl) {
                    temp.push(balls[i]);
                }
            }
            balls = temp;

            requestAnimationFrame(animationLoop);
        }

        const mousemove = (e) => {
            mouse.x = e.clientX + document.documentElement.scrollLeft;
            mouse.y = e.clientY + document.documentElement.scrollTop;
        
            for (let i = 0; i < 2; i++) {
                balls.push(new Ball());
            }
        }

        const mouseout = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        }

        function getRandomInt(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }

        function easeOutQuart(x) {
            return 1 - Math.pow(1 - x, 4);
        }

        // Initialize and set up event listeners
        resizeReset();
        window.addEventListener("resize", resizeReset);
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseout", mouseout);

        // Start the animation loop
        animationLoop();

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            window.removeEventListener("resize", resizeReset);
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseout", mouseout);
        };
    }, []); // Empty array ensures effect is only run on mount and unmount

    return <canvas ref={canvasRef} id="canvas" />;
}