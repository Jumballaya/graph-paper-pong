import { UI } from "./UI";
import { Camera } from "./core/Camera";
import { GameObject } from "./core/GameObject";
import { GameScreen } from "./core/GameScreen";
import { GeometryPool } from "./core/GeometryPool";
import { Input } from "./core/Input";
import { RenderObject } from "./core/RenderObject";
import { ShaderPool } from "./core/ShaderPool";
import { Vec2 } from "./math/types/math.types";
import { setupGame } from "./setup";

export class PongGame {
    public screenDimensions: Vec2;
    public ui: UI;
    public screen: GameScreen;
    public shaders: ShaderPool;
    public geometries: GeometryPool;
    public camera: Camera;
    public input: Input;

    public leftPaddle: GameObject;
    public rightPaddle: GameObject;
    public ball: GameObject;
    public background: RenderObject;

    private running = true;
    private paused = true;
    private time = Date.now();
    private deltaTime = 0;

    private score: Vec2 = [0, 0];

    constructor(size: Vec2) {
        this.screenDimensions = size; 
        this.ui = new UI();
        this.screen = new GameScreen(this.screenDimensions, this.ui.screenParent);
        this.shaders = new ShaderPool(this.screen.ctx);
        this.geometries = new GeometryPool(this.screen.ctx);
        this.camera = new Camera(this.screenDimensions);
        this.input = new Input();

        const [bg, left, right, ball] = setupGame(this);
        this.background = bg;
        this.leftPaddle = left;
        this.rightPaddle = right;
        this.ball = ball;
    }

    public run() {
        this.running = true;
        this.time = Date.now();
        this.loop();
    }

    private pause() {
        this.paused = true;
        this.ui.setState('paused');
    }

    private unpause() {
        this.paused = false;
        this.ui.setState('playing');
    }

    private loop() {

        if (this.running) {
            const t = Date.now();
            const dt = t - this.time;
            this.deltaTime += dt / 1000;
            this.time = t;
            this.update(dt / 1000);
            requestAnimationFrame(() => {
                this.loop();
            });
        }
    }

    private update(dt: number) {
        this.handleInput();
        this.updatePhysics(dt);
        this.render();
        this.handleUI();
        this.handleWin();
    }

    private render() {
        const gl = this.screen.ctx;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw Background
        this.background.bind(this.shaders, this.geometries);
        this.background.updateShaders(this.shaders);
        this.camera.update(this.shaders);
        gl.drawArrays(gl.TRIANGLES, 0, this.geometries.getVertexCount(this.background.geometry));

        // Draw this.items
        this.leftPaddle.render(gl, this.camera, this.shaders, this.geometries);
        this.rightPaddle.render(gl, this.camera, this.shaders, this.geometries);
        this.ball.render(gl, this.camera, this.shaders, this.geometries);
    }

    private handleInput() {
        if (!this.paused) {
            if (this.input.keyIsPressed('w')) {
                this.leftPaddle.rb.accelerate([0, -600]);
            }
            if (this.input.keyIsPressed('s')) {
                this.leftPaddle.rb.accelerate([0, 600]);
            }
            if (this.input.keyIsPressed('ArrowUp')) {
                this.rightPaddle.rb.accelerate([0, -600]);
            }
            if (this.input.keyIsPressed('ArrowDown')) {
                this.rightPaddle.rb.accelerate([0, 600]);
            }
        }
    }

    private updatePhysics(dt: number) {
        if (this.paused) return;
        this.leftPaddle.update(dt);
        this.rightPaddle.update(dt);
        this.ball.update(dt);

        // Ball bounds
        if (this.ball.rb.aabb.x < 0) {
            this.score[1]++;
            this.pause();
            this.ball.moveTo([
                (this.screenDimensions[0] / 2) - (this.ball.rb.aabb.width / 2),
                (this.screenDimensions[1] / 2) - (this.ball.rb.aabb.height / 2)
            ]);
            this.ball.rb.clearAcceleration();
            this.ball.rb.accelerate([-300, Math.random() > 0.5 ? -100 : 100]);
            this.ui.setScore(this.score)
            return;
        }
        if (this.ball.rb.aabb.x > (this.screenDimensions[0] - (this.ball.rb.aabb.width))) {
            this.score[0]++;
            this.pause();
            this.ball.moveTo([
                (this.screenDimensions[0] / 2) - (this.ball.rb.aabb.width / 2),
                (this.screenDimensions[1] / 2) - (this.ball.rb.aabb.height / 2)
            ]);
            this.ball.rb.clearAcceleration();
            this.ball.rb.accelerate([300, Math.random() > 0.5 ? -100 : 100]);
            this.ui.setScore(this.score)
            return;
        }
        if (this.ball.rb.aabb.y < 0) {
            this.ball.rb.accelerate([0, 200]);
        }
        if (this.ball.rb.aabb.y > (this.screenDimensions[1] - (this.ball.rb.aabb.height))) {
            this.ball.rb.accelerate([0, -200]);
        }

        // Ball 'gravity'
        if (this.ball.rb.vel[0] < 0) {
            this.ball.rb.accelerate([-2.5, 0]);
        } else {
            this.ball.rb.accelerate([2.5, 0]);
        }

        // Left paddle bounds
        if (this.leftPaddle.rb.aabb.y < 0) {
            this.leftPaddle.moveTo([this.leftPaddle.rb.aabb.x, 0]);
        }
        if (this.leftPaddle.rb.aabb.y > this.screenDimensions[1] - this.leftPaddle.rb.aabb.height) {
            this.leftPaddle.moveTo([this.leftPaddle.rb.aabb.x, this.screenDimensions[1] - this.leftPaddle.rb.aabb.height]);
        }

        // Right paddle bounds
        if (this.rightPaddle.rb.aabb.y < 0) {
            this.rightPaddle.moveTo([this.rightPaddle.rb.aabb.x, 0]);
        }
        if (this.rightPaddle.rb.aabb.y > this.screenDimensions[1] - this.rightPaddle.rb.aabb.height) {
            this.rightPaddle.moveTo([this.rightPaddle.rb.aabb.x, this.screenDimensions[1] - this.rightPaddle.rb.aabb.height]);
        }


        // Ball <-> Paddle collision
        if (this.ball.rb.collides(this.leftPaddle.rb)) {
            const a: Vec2 = [900, this.leftPaddle.rb.vel[1] * 10];
            this.ball.rb.accelerate(a);
            this.ball.moveTo([this.ball.rb.aabb.x + 16, this.ball.rb.aabb.y]);
        }
        if (this.ball.rb.collides(this.rightPaddle.rb)) {
            const a: Vec2 = [-900, this.leftPaddle.rb.vel[1] * 10];
            this.ball.rb.accelerate(a);
            this.ball.moveTo([this.ball.rb.aabb.x - 16, this.ball.rb.aabb.y]);
        }
    }

    private handleUI() {
        this.ui.update();
        if (this.input.keyIsPressed(' ') && this.paused) {
            this.unpause();
        }
        if (this.input.keyIsPressed('Escape') && !this.paused) {
            this.pause();
        }
    }

    private handleWin() {
        if (this.score[0] >= 13) {
            this.ui.setState('ended');
            this.ui.setWinner('Left Paddle');
            this.paused = true;
            return;
        }
        if (this.score[1] >= 13) {
            this.ui.setState('ended');
            this.ui.setWinner('Right Paddle');
            this.paused = true;
            return;
        }
    }
}
