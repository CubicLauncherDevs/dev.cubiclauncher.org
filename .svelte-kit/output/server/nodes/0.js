

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.C9TLATUW.js","_app/immutable/chunks/4NX1HZQ5.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BPo_48BI.js"];
export const stylesheets = ["_app/immutable/assets/0.D29O2O6y.css"];
export const fonts = [];
