#version 300 es

precision highp float;
layout(location=0) out vec4 outColor;

uniform vec3 u_color;

in vec2 v_uv;

float sdfCircle(vec2 p, float r ) {
    return length(p) - r;
}

void main() {
    vec2 uv = (v_uv - 0.5);
    vec3 color = u_color;
    float radius = 0.45;
    vec2 center = vec2(0.0, 0.0);
    float d = sdfCircle(uv - center, radius);

    float a = d < 0.0 ? 1.0 : 0.0;
    color = color * (0.85 - exp(-1.5 * abs(d))) * 24.0;
    outColor = vec4(color, a);
}
