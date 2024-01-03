import { mat4 } from "../math/mat4";
import { Vec2 } from "../math/types/math.types";
import { ShaderPool } from "./ShaderPool";

export class Camera {
    private screenSize: Vec2;

    constructor(screenSize: Vec2) {
        this.screenSize = screenSize;
    }

    public update(pool: ShaderPool) {
        pool.bind(pool.current);
        pool.setUniform(pool.current, 'u_view_matrix', { type: 'mat4', value: mat4.projection(...this.screenSize, 20) });
    }
}
