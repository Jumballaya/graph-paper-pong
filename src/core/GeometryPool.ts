import { Geometry, VertexLayout } from "./Geometry";

export class GeometryPool {
    private pool: Map<string, Geometry> = new Map();
    private gl: WebGL2RenderingContext;

    public current = '';

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    public createGeometry(name: string, layout: VertexLayout) {
        const geometry = new Geometry(this.gl, layout);
        this.pool.set(name, geometry);
    }

    public bind(name: string) {
        if (name === this.current) return;
        this.pool.get(name)?.bind(this.gl);
        this.current = name;
    }

    public getVertexCount(name: string): number {
        return this.pool.get(name)?.vertexCount || 0;
    }
}
