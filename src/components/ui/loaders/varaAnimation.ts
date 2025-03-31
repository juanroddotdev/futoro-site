// Types
interface VaraOptions {
  fontSize?: number;
  strokeWidth?: number;
  color?: string;
  duration?: number;
  letterSpacing?: number;
  y?: number;
  x?: number;
  textAlign?: string;
  autoAnimation?: boolean;
}

interface VaraInstance {
  ready: (callback: () => void) => void;
  get: (index: number) => {
    characters: Array<{
      setAttribute: (name: string, value: string) => void;
      style: CSSStyleDeclaration;
    }>;
  };
  draw: (index: number) => void;
}

// Add TypeScript type for Vara
declare global {
  interface Window {
    Vara: any; // Use any to merge with existing declaration
  }
}

/**
 * Initialize Vara animation for the headline
 */
export const initHeadlineVara = async (
  headline: string,
  loadVara: () => Promise<typeof window.Vara>
): Promise<void> => {
  try {
    await loadVara();
    
    // Initialize Vara with the headline text
    const headlineVaraInstance = new window.Vara(
      "#headline-vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: headline,
          fontSize: 48, // Larger size for headline
          strokeWidth: 2,
          color: 'var(--theme-primary, #88C0D0)',
          duration: 2000,
          letterSpacing: 2,
          y: 35,
          x: 0,
          textAlign: "center",
          autoAnimation: false
        }
      ],
      {
        strokeWidth: 2,
        fontSize: 48,
        textAlign: "center"
      }
    );

    headlineVaraInstance.ready(() => {
      const varaText = headlineVaraInstance.get(0);
      const varaLetters = varaText.characters;
      
      headline.split('').forEach((letter, index) => {
        if (varaLetters[index]) {
          varaLetters[index].setAttribute('data-letter', letter);
          varaLetters[index].style.opacity = '1';
        }
      });

      headlineVaraInstance.draw(0);
    });
  } catch (error) {
    console.error('Failed to load headline Vara:', error);
    throw error;
  }
};

/**
 * Initialize Vara animation for the subheadline
 */
export const initSubheadlineVara = async (
  subheadline: string,
  loadVara: () => Promise<typeof window.Vara>
): Promise<VaraInstance> => {
  try {
    await loadVara();
    
    // Initialize Vara with the subheadline text
    const varaInstance = new window.Vara(
      "#subheadline-vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: subheadline,
          fontSize: 24,
          strokeWidth: 2,
          color: 'var(--theme-primary, #88C0D0)',
          duration: 2000,
          letterSpacing: 2,
          y: 35,
          x: 0,
          textAlign: "center",
          autoAnimation: false
        }
      ],
      {
        strokeWidth: 2,
        fontSize: 24,
        textAlign: "center"
      }
    );

    varaInstance.ready(() => {
      const varaText = varaInstance.get(0);
      const varaLetters = varaText.characters;
      
      subheadline.split('').forEach((letter, index) => {
        if (varaLetters[index]) {
          varaLetters[index].setAttribute('data-letter', letter);
          varaLetters[index].style.opacity = '1';
        }
      });

      varaInstance.draw(0);
    });

    return varaInstance;
  } catch (error) {
    console.error('Failed to load subheadline Vara:', error);
    throw error;
  }
}; 