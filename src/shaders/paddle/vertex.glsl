#version 300 es

layout(location=0) in vec3 a_position;
layout(location=1) in vec2 a_uv;

uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;

out vec2 v_uv;

void main() {
    vec4 position = u_view_matrix * u_model_matrix * vec4(a_position, 1.0);
    gl_Position = position;

    v_uv = a_uv;
}
