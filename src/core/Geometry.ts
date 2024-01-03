import { Vec3 } from "../math/types/math.types";

export type VertexLayout = {
    data: Float32Array;
    stride: number;
    attributes: Array<{
        length: number;
        offset: number;
    }>;
};

export class Geometry {
    private vao: WebGLVertexArrayObject;
    private buffer: WebGLBuffer;

    public vertexCount: number;

    constructor(gl: WebGL2RenderingContext, layout: VertexLayout) {
        this.vao = gl.createVertexArray()!;
        if (!this.vao) throw new Error(`Error creating vertex array object`);
        gl.bindVertexArray(this.vao);
        this.buffer = gl.createBuffer()!;
        if (!this.buffer) throw new Error(`Error creating buffer`);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        for (let i = 0; i < layout.attributes.length; i++) {
            const attr = layout.attributes[i];
            gl.enableVertexAttribArray(i);
            gl.vertexAttribPointer(i, attr.length, gl.FLOAT, false, layout.stride, attr.offset);
        }
        gl.bufferData(gl.ARRAY_BUFFER, layout.data, gl.STATIC_DRAW);
        this.vertexCount = layout.data.length / (layout.stride / 4);
    }

    public bind(gl: WebGL2RenderingContext) {
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }
}
