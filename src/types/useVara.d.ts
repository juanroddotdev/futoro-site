declare module '@/composables/useVara' {
  import Vara from 'vara';

  interface VaraOptions {
    fontSize: number;
    strokeWidth: number;
    textAlign: string;
    text: string;
    y: number;
    duration?: number;
    letterSpacing?: number;
    autoAnimation?: boolean;
    color?: string;
    font?: string;
    delay?: number;
  }

  export function useVara(): {
    loadVara: (containerId: string, options: VaraOptions) => Promise<Vara>;
  };
} 