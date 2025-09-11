/// <reference types="vite/client" />

declare module "*.jsx" {
    const component: React.ComponentType<any>;
    export default component;
}

declare module "*.js" {
    const content: any;
    export default content;
    export const cn: (...args: any[]) => string;
}
