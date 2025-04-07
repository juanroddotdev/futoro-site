declare module 'vara' {
  export default class Vara {
    constructor(
      containerId: string,
      fontSource: string,
      config: Array<{
        text: string;
        fontSize: number;
        strokeWidth: number;
        textAlign: string;
        y: number;
        duration?: number;
        letterSpacing?: number;
        autoAnimation?: boolean;
        color?: string;
        font?: string;
        delay?: number;
      }>
    );
    
    draw(): void;
    ready(): Promise<void>;
  }
} 