export const helloworld = 'Hello, world!';

export const isGoodAttitude = (attitude: string) => attitude === 'good';
export const isJediColor = (color: string) => color === 'blue' || color === 'green';
export const getSection = (name: string) => document.querySelector(`[data-section="${name}"]`);
export const domNodesToArray = (nodes: NodeListOf<HTMLInputElement>) => Array.prototype.slice.call(nodes);
