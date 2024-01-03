import type { AABB } from "../math/types/aabb.type";
import type { Vec2 } from "../math/types/math.types";
import type { Transform } from "../math/types/transform.type";

export class RigidBody {
    private acceleration: Vec2 = [0, 0];
    private velocity: Vec2 = [0, 0];
    private transform: Transform = {
        translation: [0, 0, -1],
        rotation: 0,
        scale: [1,1,1],
    };

    public dampening = 1;

    public set position(pos: Vec2) {
        this.transform.translation[0] = pos[0];
        this.transform.translation[1] = pos[1];
    }

    public set scale(s: Vec2) {
        this.transform.scale[0] = s[0];
        this.transform.scale[1] = s[1];
    }

    public get aabb(): AABB {
        return {
            width: this.transform.scale[0] * 2,
            height: this.transform.scale[1] * 2,
            x: this.transform.translation[0],
            y: this.transform.translation[1],
        };
    }

    public get vel(): Vec2 {
        return [...this.velocity];
    }

    public set vel(v: Vec2) {
        this.velocity[0] = v[0];
        this.velocity[1] = v[1];
    }

    public accelerate(a: Vec2) {
        this.acceleration[0] += a[0];
        this.acceleration[1] += a[1];
    }

    public clearAcceleration() {
        this.acceleration[0] = 0;
        this.acceleration[1] = 0;
        this.velocity[0] = 0;
        this.velocity[1] = 0;
    }

    public update(dt: number) {
        this.velocity[0] += this.acceleration[0] * dt;
        this.velocity[1] += this.acceleration[1] * dt;
        this.acceleration[0] = 0;
        this.acceleration[1] = 0;

        this.velocity[0] *= this.dampening;
        this.velocity[1] *= this.dampening;

        this.transform.translation[0] += this.velocity[0];
        this.transform.translation[1] += this.velocity[1];
    }

    public collides(rb: RigidBody): boolean {
        const a = this.aabb;
        const b = rb.aabb;

        return (a.x < b.x + b.width
            && a.x + a.width > b.x
            && a.y < b.y + b.height
            && a.y + a.height > b.y);
    }
}
