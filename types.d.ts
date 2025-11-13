/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Global type declarations for React
declare module "react" {
  interface FormEvent<T = Element> {
    target: EventTarget & T;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};