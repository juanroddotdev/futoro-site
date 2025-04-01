interface LetterPosition {
  x: number;
  letterIndex: number;
}

interface OutlineLetterPosition {
  element: Element;
  xPercent: number;
}

interface LetterCalculationResult {
  letterPositions: LetterPosition[];
  containerRightEdge: number;
  outlineLetterPositions: OutlineLetterPosition[];
}

export function calculateLetterPositions(
  positions: { x: number; index: number }[],
  headlineContainer: HTMLElement,
  screenWidth: number
): LetterCalculationResult {
  // Calculate container width percentage
  const containerRect = headlineContainer.getBoundingClientRect();
  const containerRightEdge = (containerRect.width / screenWidth) * 100;
  
  // Calculate outline letter positions
  const outlineLetters = document.querySelectorAll('.outline-text-wrapper .letter');
  const outlineLetterPositions = Array.from(outlineLetters).map(letter => {
    const letterRect = letter.getBoundingClientRect();
    const containerLeft = headlineContainer.getBoundingClientRect().left;
    const letterX = letterRect.left - containerLeft;
    const letterXPercent = (letterX / containerRect.width) * 100;
    return { element: letter, xPercent: letterXPercent };
  });
  
  // Group paths by letter index
  const pathsByLetter = new Map<number, { x: number; index: number }[]>();
  positions.forEach(({ x, index }) => {
    const letterIndex = Math.floor(index / 2); // Assuming 2 paths per letter
    if (!pathsByLetter.has(letterIndex)) {
      pathsByLetter.set(letterIndex, []);
    }
    pathsByLetter.get(letterIndex)?.push({ x, index });
  });

  // Convert to array of letter positions
  const letterPositions = Array.from(pathsByLetter.entries()).map(([letterIndex, paths]) => {
    const avgX = paths.reduce((sum, { x }) => sum + x, 0) / paths.length;
    const percentage = (avgX / containerRect.width) * 100;
    return { x: percentage, letterIndex };
  });

  return {
    letterPositions,
    containerRightEdge,
    outlineLetterPositions
  };
} 