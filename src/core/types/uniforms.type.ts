import type { Mat2, Mat3, Mat4, Vec2, Vec3, Vec4 } from "../../math/types/math.types";

export type FloatUniform = {
    type: 'float';
    value: number;
};

export type Vec2Uniform = {
    type: 'vec2';
    value: Vec2;
};

export type Vec3Uniform = {
    type: 'vec3';
    value: Vec3;
}

export type Vec4Uniform = {
    type: 'vec4';
    value: Vec4;
}

export type Mat2Uniform = {
    type: 'mat2';
    value: Mat2;
};

export type Mat3Uniform = {
    type: 'mat3';
    value: Mat3;
};

export type Mat4Uniform = {
    type: 'mat4';
    value: Mat4;
};

export type Uniform = Vec2Uniform | Vec3Uniform | Vec3Uniform | Mat4Uniform | FloatUniform;
