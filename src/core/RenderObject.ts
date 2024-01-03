import { mat4 } from "../math/mat4";
import { Mat4, Vec2, Vec3 } from "../math/types/math.types";
import { GeometryPool } from "./GeometryPool";
import { ShaderPool } from "./ShaderPool";

type Transform = {
    translation: Vec3;
    rotation: number;
    scale: Vec3;
};

export class RenderObject {
    public geometry: string;
    public shader: string;
    public color: [number, number, number] = [0,0,0];

    private transform: Transform = {
        translation: [0, 0, -1],
        rotation: 0,
        scale: [1,1,1],
    };

    constructor(geo: string, shader: string) {
        this.geometry = geo;
        this.shader = shader;
    }

    public bind(shaders: ShaderPool, geometries: GeometryPool) {
        shaders.bind(this.shader);
        geometries.bind(this.geometry);
    } 

    public updateShaders(shaders: ShaderPool) {
        shaders.setUniform(this.shader, 'u_color', { type: 'vec3', value: this.color });
        shaders.setUniform(this.shader, 'u_model_matrix', { type: 'mat4', value: this.calcTransform() });
    }

    get position(): Vec2 {
        return [this.transform.translation[0], this.transform.translation[1]];
    }
    
    get scale(): Vec2 {
        return [
            this.transform.scale[0],
            this.transform.scale[1],
        ]
    }

    public moveTo(x: number, y: number) {
        this.transform.translation[0] = x;
        this.transform.translation[1] = y;
    }

    public rotate(r: number) {
        this.transform.rotation = r;
    }

    public set scale(s: Vec2) {
        this.transform.scale[0] = s[0];
        this.transform.scale[1] = s[1];
    }

    private calcTransform(): Mat4 {
        const trans: Vec3 = [
            this.transform.translation[0] + this.transform.scale[0],
            this.transform.translation[1] + this.transform.scale[1],
            this.transform.translation[2],
        ];
        return mat4.transform(
            trans,
            this.transform.rotation,
            this.transform.scale,
        );
    }
}
