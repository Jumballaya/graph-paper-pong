import type { Uniform } from './types/uniforms.type';

export class Shader {
    private program: WebGLProgram;
    private uniforms: Map<string, { type: Uniform['type']; location: WebGLUniformLocation; }> = new Map();

    constructor(gl: WebGL2RenderingContext, vert: string, frag: string) {
        const program = gl.createProgram();
        if (!program) throw new Error("couldn't create program");

        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!vertShader) throw new Error(`could not create vertex shader`);
        if (!fragShader) throw new Error(`could not create vertex shader`);

        gl.shaderSource(vertShader, vert);
        gl.shaderSource(fragShader, frag);

        gl.compileShader(vertShader);
        gl.compileShader(fragShader);
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            throw new Error(`Vertex Shader Error: ${gl.getShaderInfoLog(vertShader)}`);
        }
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            throw new Error(`Fragment Shader Error: ${gl.getShaderInfoLog(fragShader)}`);
        }

        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(`Shader Program Error: ${gl.getProgramInfoLog(program)}`);
        }
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);

        this.program = program;
        gl.useProgram(program);
    }

    public bind(gl: WebGL2RenderingContext) {
        gl.useProgram(this.program);
    }

    public setUniform(gl: WebGL2RenderingContext, name: string, uniform: Uniform) {
        this.bind(gl);
        let found = this.uniforms.get(name);
        if (!found) {
            const loc = gl.getUniformLocation(this.program, name);
            if (!loc) throw new Error(`could not get uniform location for uniform "${name}"`);
            found = { type: uniform.type, location: loc };
            this.uniforms.set(name, found);
        }
        switch (uniform.type) {
            case 'float': {
                gl.uniform1f(found.location, uniform.value);
                break;
            }
            case 'vec2': {
                gl.uniform2f(found.location, ...uniform.value);
                break;
            }
            case 'vec3': {
                gl.uniform3f(found.location, ...uniform.value);
                break;
            }
            case 'mat4': {
                gl.uniformMatrix4fv(found.location, false, uniform.value);
                break;
            }
        }
    }
}
