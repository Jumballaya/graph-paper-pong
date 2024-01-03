import type { Vec3 } from "./math.types";

export type Transform = {
    translation: Vec3;
    rotation: number;
    scale: Vec3;
};
