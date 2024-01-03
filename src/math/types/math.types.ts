export type Float = number;
export type Vec2 = [Float, Float];
export type Vec3 = [Float, Float, Float];
export type Vec4 = [Float, Float, Float, Float];

export type Mat2 = [...Vec2, ...Vec2];
export type Mat3 = [...Vec3, ...Vec3, ...Vec3];
export type Mat4 = [...Vec4, ...Vec4, ...Vec4, ...Vec4];
