

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DwmbjvGT.js","_app/immutable/chunks/4NX1HZQ5.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BPo_48BI.js"];
export const stylesheets = ["_app/immutable/assets/2.DycO--Y8.css"];
export const fonts = [];
