
export let controls = {
    keys: new Map<KeyboardEvent["key"], boolean>(),

    keyPressed(key: KeyboardEvent["key"]): boolean {
        return this.keys.get(key) ?? false;
    }
}

window.addEventListener("keydown", event => {
    controls.keys.set(event.key, true);
});

window.addEventListener("keyup", event => {
    controls.keys.set(event.key, false);
});