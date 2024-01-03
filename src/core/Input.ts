export class Input {
    private keys: Record<string, boolean> = {};

    constructor() {
        document.body.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        document.body.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    public keyIsPressed(k: string): boolean {
        return !!this.keys[k]
    }

    public keysArePressed(...ks: string[]): boolean {
        return ks.every(k => !!this.keys[k]);
    }
}
