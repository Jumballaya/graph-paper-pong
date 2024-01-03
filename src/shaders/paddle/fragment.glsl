#version 300 es

precision highp float;
layout(location=0) out vec4 outColor;

uniform vec3 u_color;

in vec2 v_uv;

vec3 BLACK = vec3(0.0);

void main() {
    vec2 uv = v_uv;
    vec3 color = u_color;

    if (uv.x < 0.1 || uv.x > 0.9) {
        color = BLACK;
    }
    if (uv.y < 0.02 || uv.y > 0.98) {
        color = BLACK;
    }


    outColor = vec4(color, 1.0);
}
