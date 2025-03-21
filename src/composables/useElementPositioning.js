/**
 * Composable for positioning elements relative to targets
 * Handles both absolute positioning and parent-relative positioning
 */
export function useElementPositioning() {
  /**
   * Positions an element relative to a target or its parent
   * @param {HTMLElement} element - Element to position
   * @param {HTMLElement|null} targetElement - Target to position relative to
   * @param {Object} options - Positioning options
   */
  const positionElement = (element, targetElement, options) => {
    const { 
      offsetX = 0, 
      offsetY = 0, 
      relativeToParent = false,
      width = '100px',
      height = '100px'
    } = options;
    
    if (!element) return;
    
    if (relativeToParent || !targetElement) {
      // Position relative to parent with offsets
      Object.assign(element.style, {
        position: 'absolute',
        left: `${offsetX}px`,
        top: `${offsetY}px`,
        width,
        height
      });
    } else {
      // Position absolutely relative to target element
      const targetRect = targetElement.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      Object.assign(element.style, {
        position: 'absolute',
        left: `${targetRect.left + scrollX + offsetX}px`,
        top: `${targetRect.top + scrollY + offsetY}px`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`
      });
    }
  };
  
  return {
    positionElement
  };
}