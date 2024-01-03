import { Shader } from "./Shader";
import { Uniform } from "./types/uniforms.type";

export class ShaderPool {
    private pool: Map<string, Shader> = new Map();
    private gl: WebGL2RenderingContext;

    public current = '';

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    public createShader(name: string, vertex: string, fragment: string) {
        const shader = new Shader(this.gl, vertex, fragment);
        this.pool.set(name, shader);
    }

    public bind(name: string) {
        if (name === this.current) return;
        this.pool.get(name)?.bind(this.gl);
        this.current = name;
    }

    public getShader(name: string): Shader | undefined {
        return this.pool.get(name);
    }

    public setUniform(name: string, uniform: string, value: Uniform) {
        this.pool.get(name)?.setUniform(this.gl, uniform, value);
    };
}
