#version 300 es

precision highp float;
layout(location=0) out vec4 outColor;

uniform vec2 u_resolution;
uniform vec3 u_color;
in vec2 v_uv;

float inverse_lerp(float v, float minVal, float maxVal) {
    return (v - minVal) / (maxVal - minVal);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverse_lerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

vec3 draw_grid(vec3 color, vec3 lineColor, float cellSpacing, float lineWidth) {
    vec2 center = ((v_uv * 2.0) - 0.5);
    vec2 cells = abs(fract(center * u_resolution / cellSpacing) - 0.5);
    float distToEdge = (0.5 - max(cells.x, cells.y)) * cellSpacing;
    float lines = smoothstep(0.0, lineWidth, distToEdge);
    color = mix(lineColor, color, lines);
    return color;
}

void main() {
    vec2 uv = v_uv * 2.0;
    vec3 color = u_color;
    color = draw_grid(color, vec3(0.99, 0.87, 0.89), 20.0, 1.0);
    color = draw_grid(color, vec3(0.55, 0.49, 0.52), 100.0, 2.0);

    float flare = smoothstep(0.0, 0.5, abs(uv.x - 0.5));
    color = mix(color * 1.1, color, flare);

    float yAxis = smoothstep(0.0, 0.003, abs(uv.x - 0.5));
    color = fract(mix(vec3(0.0), color / 1.1, yAxis));

    outColor = vec4(color, 1.0);
}
