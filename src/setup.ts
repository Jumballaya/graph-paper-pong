import fragBg from './shaders/background/fragment.glsl?raw'
import vertBg from './shaders/background/vertex.glsl?raw'

import fragPaddle from './shaders/paddle/fragment.glsl?raw'
import vertPaddle from './shaders/paddle/vertex.glsl?raw'

import fragBall from './shaders/ball/fragment.glsl?raw'
import vertBall from './shaders/ball/vertex.glsl?raw'

import { PongGame } from "./PongGame";
import { GameObject } from "./core/GameObject";
import { RenderObject } from "./core/RenderObject";

export function setupGame(game: PongGame): [RenderObject, GameObject, GameObject, GameObject] {
    game.shaders.createShader('background', vertBg, fragBg);
    game.shaders.setUniform('background', 'u_resolution', { type: 'vec2', value: game.screen.dimensions });
    game.shaders.createShader('paddle', vertPaddle, fragPaddle);
    game.shaders.createShader('ball', vertBall, fragBall);
    game.geometries.createGeometry('square', {
        data: new Float32Array([
            // X   Y  U  V
              -1, -1, 0, 0,
               1, -1, 1, 0,
               1,  1, 1, 1,

              -1, -1, 0, 0,
               1,  1, 1, 1,
              -1,  1, 0, 1,
        ]),
        stride: 16,
        attributes: [
            { length: 2, offset: 0 },
            { length: 2, offset: 8 },
        ],
    });

    const background = new RenderObject('square', 'background');
    background.color = [0.98, 0.96, 0.96];
    background.scale = game.screenDimensions;

    const paddleLeft = new GameObject({
        geometry: 'square',
        shader: 'paddle',
        color: [0.92, 0.9, 0.9],
        transform: {
            translation: [20, 20, 1],
            scale: [8, 40, 1],
            rotation: 0,
        },
        dampening: 0.6,
    });

    const paddleRight = new GameObject({
        geometry: 'square',
        shader: 'paddle',
        color: [0.92, 0.9, 0.9],
        transform: {
            translation: [game.screenDimensions[0] - 36, 20, 1],
            scale: [8, 40, 1],
            rotation: 0,
        },
        dampening: 0.6,
    });

    const ball = new GameObject({
        geometry: 'square',
        shader: 'ball',
        color: [0.79, 0.76, 0.76],
        transform: {
            translation: [
                (game.screenDimensions[0] / 2) - 10,
                (game.screenDimensions[1] / 2) - 10,
                1
            ],
            scale: [10, 10, 1],
            rotation: 0,
        },
        dampening: 1,
    });
    ball.rb.accelerate([
        Math.random() > 0.5 ? -300 : 300,
        Math.random() > 0.5 ? 100 : -100,
    ]);

    return [background, paddleLeft, paddleRight, ball];
}
