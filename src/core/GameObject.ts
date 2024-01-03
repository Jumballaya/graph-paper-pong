import { Vec2, Vec3 } from "../math/types/math.types";
import { Transform } from "../math/types/transform.type";
import { Camera } from "./Camera";
import { GeometryPool } from "./GeometryPool";
import { RenderObject } from "./RenderObject";
import { RigidBody } from "./RigidBody";
import { ShaderPool } from "./ShaderPool";

type GameObjectConfig = {
    color: Vec3;
    geometry: string;
    shader: string;
    transform: Transform;
    dampening: number;
}

export class GameObject {
    public ro: RenderObject;
    public rb: RigidBody;

    constructor(config: GameObjectConfig) {
        this.rb = new RigidBody();
        this.ro = new RenderObject(config.geometry, config.shader);
        this.ro.color = config.color;
        this.ro.scale = [config.transform.scale[0], config.transform.scale[1]];
        this.ro.moveTo(config.transform.translation[0], config.transform.translation[1]);
        this.ro.rotate(config.transform.rotation);

        this.rb.scale = this.ro.scale;
        this.rb.position = this.ro.position;
        this.rb.dampening = config.dampening;
    }

    public update(dt: number) {
        this.rb.update(dt);
        this.ro.moveTo(this.rb.aabb.x, this.rb.aabb.y);
    }

    public moveTo(pos: Vec2) {
        this.ro.moveTo(...pos);
        this.rb.position = this.ro.position;
    }

    public render(gl: WebGL2RenderingContext, camera: Camera, shaders: ShaderPool, geometries: GeometryPool) {
        this.ro.bind(shaders, geometries);
        this.ro.updateShaders(shaders);
        camera.update(shaders);
        gl.drawArrays(gl.TRIANGLES, 0, geometries.getVertexCount(this.ro.geometry));
    }
}
