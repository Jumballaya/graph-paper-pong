
export type UIState = 'start' | 'playing' | 'paused' | 'ended';

export class UI {
    
    private elements = {
        root: document.createElement('div'),
        overlay: document.createElement('div'),
        canvas: document.createElement('div'),
        router: {
            root: document.createElement('div'),
            start: document.createElement('div'),
            pause: document.createElement('div'),
            end: document.createElement('div'),
        },
    }

    private state: UIState = 'start';

    constructor() {
        document.body.appendChild(this.elements.root);
        this.elements.root.appendChild(this.elements.canvas); 
        this.elements.root.appendChild(this.elements.overlay);
        this.elements.root.appendChild(this.elements.router.root);

        this.elements.root.classList.add('pong-game');
        this.setupRouter();

        this.elements.overlay.classList.add('overlay');
        this.elements.overlay.innerHTML = `
            <h1>0</h1><h1>0</h1>
        `;
    }

    public get screenParent(): HTMLDivElement {
        return this.elements.canvas;
    }

    public setScore([left, right]: [number, number]) {
        this.elements.overlay.innerHTML = `
            <h1>${left}</h1><h1>${right}</h1>
        `;
    }

    public setState(state: UIState) {
        this.state = state;
    }

    public setWinner(winner: string) {
        this.elements.router.end.innerHTML = `
            <h1>The winner is:</h1>
            <h1>${winner}</h1>
        `;
    }

    public update() {
        switch (this.state) {
            case 'start': {
                if (this.elements.router.root.classList.contains('hidden')) {
                    this.elements.router.root.classList.remove('hidden');
                }
                if (this.elements.router.start.classList.contains('hidden')) {
                    this.elements.router.start.classList.remove('hidden');
                }
                if (!this.elements.router.end.classList.contains('hidden')) {
                    this.elements.router.end.classList.add('hidden');
                }
                if (!this.elements.router.pause.classList.contains('hidden')) {
                    this.elements.router.pause.classList.add('hidden');
                }
                break;
            }

            case 'playing': {
                const toHide = [
                    this.elements.router.root,
                    this.elements.router.pause,
                    this.elements.router.end,
                    this.elements.router.start,
                ];
                for (const el of toHide) {
                    if (!el.classList.contains('hidden')) {
                        el.classList.add('hidden');
                    }
                }
                break;
            }

            case 'paused': {
                if (this.elements.router.root.classList.contains('hidden')) {
                    this.elements.router.root.classList.remove('hidden');
                }
                if (this.elements.router.pause.classList.contains('hidden')) {
                    this.elements.router.pause.classList.remove('hidden');
                }
                if (!this.elements.router.end.classList.contains('hidden')) {
                    this.elements.router.end.classList.add('hidden');
                }
                if (!this.elements.router.start.classList.contains('hidden')) {
                    this.elements.router.start.classList.add('hidden');
                }
                break;
            }

            case 'ended': {
                if (this.elements.router.root.classList.contains('hidden')) {
                    this.elements.router.root.classList.remove('hidden');
                }
                if (this.elements.router.end.classList.contains('hidden')) {
                    this.elements.router.end.classList.remove('hidden');
                }
                if (!this.elements.router.pause.classList.contains('hidden')) {
                    this.elements.router.pause.classList.add('hidden');
                }
                if (!this.elements.router.start.classList.contains('hidden')) {
                    this.elements.router.start.classList.add('hidden');
                }
                break;
            }
        }
    }

    private setupRouter() {
        this.elements.router.root.appendChild(this.elements.router.start);
        this.elements.router.root.appendChild(this.elements.router.end);
        this.elements.router.root.appendChild(this.elements.router.pause);

        this.elements.router.root.classList.add('ui-router', 'hidden');

        this.elements.router.start.classList.add('ui-screen');
        this.elements.router.start.innerHTML = `
            <div>
                <h1>Graph Paper Pong!<h1>
                <h1>Press <span style="color:#DD1C1A;">Space</span> to start the game</h1>
                <h2>Left controls: <em style="color:#2465CC;">w</em> for up and <em style="color:#2465CC;">s</em> for down</h2>
                <h2>Right controls: <em style="color:#2465CC;">up arrow</em> for up and <em style="color:#2465CC;">down arrow</em> for down</h2>
            </div>
        `;

        this.elements.router.pause.classList.add('ui-screen', 'overlay');
        this.elements.router.pause.innerHTML = `
            <h1>Press <span style="color:#DD1C1A;">Space</span> to continue the game</h1>
        `;

        this.elements.router.end.classList.add('ui-screen', 'overlay');
        this.elements.router.end.innerHTML = `
            <h1>Thanks for playing!</h1>
        `;
    }
}
