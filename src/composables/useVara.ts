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

export function useVara() {
  const loadVara = async (containerId: string, options: VaraOptions) => {
    // Ensure the font is loaded before creating the Vara instance
    const fontPath = options.font || '/futoro-site/fonts/Satisfy/SatisfySL.json';
    
    const vara = new Vara(
      containerId,
      fontPath,
      [
        {
          text: options.text,
          fontSize: options.fontSize,
          strokeWidth: options.strokeWidth,
          textAlign: options.textAlign,
          y: options.y,
          duration: options.duration,
          letterSpacing: options.letterSpacing,
          autoAnimation: options.autoAnimation,
          color: options.color,
          delay: options.delay
        },
      ]
    );

    // Wait for the Vara instance to be ready
    await vara.ready();
    return vara;
  };

  return {
    loadVara,
  };
} 