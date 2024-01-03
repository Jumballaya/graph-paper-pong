import { Vec2 } from "../math/types/math.types";

export class GameScreen {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;

    constructor(dimensions: Vec2, parent: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = dimensions[0];
        this.canvas.height = dimensions[1];
        parent.appendChild(this.canvas);
        this.gl = this.canvas.getContext('webgl2')!;
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    public get ctx(): WebGL2RenderingContext {
        return this.gl;
    }

    get dimensions(): Vec2 {
        return [
            this.gl.canvas.width,
            this.gl.canvas.height,
        ];
    }

    set dimensions(d: Vec2) {
        this.canvas.width = d[0];
        this.canvas.height = d[1];
    }

}

