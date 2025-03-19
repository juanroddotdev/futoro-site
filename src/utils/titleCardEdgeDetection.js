/**
 * Handles title card edge detection and animation
 * @param {Object} options - Configuration options
 * @param {string} options.hurdlesSectionSelector - Selector for hurdles section
 * @param {string} options.solutionsSectionSelector - Selector for solutions section
 * @param {string} options.titleCardSelector - Selector for title cards
 * @param {number} options.edgeThreshold - Threshold in pixels to detect edge (default: 50)
 * @param {number} options.slideUpMultiplier - Multiplier for slide up amount (default: 1.2)
 * @param {number} options.topPosition - Top position for sticky cards (default: 100)
 * @returns {Function} - Function to handle title card edge detection
 */
export function createTitleCardEdgeDetector(options = {}) {
  const {
    hurdlesSectionSelector = '.hurdles-section',
    solutionsSectionSelector = '.solutions-section',
    titleCardSelector = '.title-card',
    edgeThreshold = 50,
    slideUpMultiplier = 1.2,
    topPosition = 100
  } = options;

  // Function to check if a card is at the left edge of viewport
  const isAtLeftEdge = (card) => {
    if (!card) return false;
    const rect = card.getBoundingClientRect();
    return rect.left <= edgeThreshold;
  };

  // Return the handler function
  return function handleTitleCardEdgeDetection() {
    const hurdlesTitleCard = document.querySelector(`${hurdlesSectionSelector} ${titleCardSelector}`);
    const solutionsTitleCard = document.querySelector(`${solutionsSectionSelector} ${titleCardSelector}`);
    
    // Handle hurdles title card
    if (hurdlesTitleCard && document.body.classList.contains('hurdles-active')) {
      // Card is at the edge, slide it up and make it sticky
      if (isAtLeftEdge(hurdlesTitleCard) && !hurdlesTitleCard.classList.contains('at-edge')) {
        hurdlesTitleCard.classList.add('at-edge');
        
        // Calculate the slide up amount - move it above the row
        const slideUpAmount = hurdlesTitleCard.offsetHeight * slideUpMultiplier;
        
        // Apply the transform immediately
        hurdlesTitleCard.style.transform = `translateY(-${slideUpAmount}px)`;
        hurdlesTitleCard.style.zIndex = '100';
        
        // Make it sticky immediately
        hurdlesTitleCard.classList.add('sticky-card');
        hurdlesTitleCard.style.position = 'sticky';
        hurdlesTitleCard.style.left = '20px';
        hurdlesTitleCard.style.top = `${topPosition}px`; // Position from top of viewport
      }
      
      // Reset when scrolling back
      if (!isAtLeftEdge(hurdlesTitleCard) && hurdlesTitleCard.classList.contains('at-edge')) {
        hurdlesTitleCard.classList.remove('at-edge', 'sticky-card');
        hurdlesTitleCard.style.position = 'relative';
        hurdlesTitleCard.style.left = 'auto';
        hurdlesTitleCard.style.top = 'auto';
        hurdlesTitleCard.style.transform = 'translateY(0)';
        hurdlesTitleCard.style.zIndex = '1';
      }
    }
    
    // Handle solutions title card (similar logic)
    if (solutionsTitleCard && document.body.classList.contains('solutions-active')) {
      // Card is at the edge, slide it up and make it sticky
      if (isAtLeftEdge(solutionsTitleCard) && !solutionsTitleCard.classList.contains('at-edge')) {
        solutionsTitleCard.classList.add('at-edge');
        
        // Calculate the slide up amount - move it above the row
        const slideUpAmount = solutionsTitleCard.offsetHeight * slideUpMultiplier;
        
        // Apply the transform immediately
        solutionsTitleCard.style.transform = `translateY(-${slideUpAmount}px)`;
        solutionsTitleCard.style.zIndex = '100';
        
        // Make it sticky immediately
        solutionsTitleCard.classList.add('sticky-card');
        solutionsTitleCard.style.position = 'sticky';
        solutionsTitleCard.style.left = '20px';
        solutionsTitleCard.style.top = `${topPosition}px`; // Position from top of viewport
      }
      
      // Reset when scrolling back
      if (!isAtLeftEdge(solutionsTitleCard) && solutionsTitleCard.classList.contains('at-edge')) {
        solutionsTitleCard.classList.remove('at-edge', 'sticky-card');
        solutionsTitleCard.style.position = 'relative';
        solutionsTitleCard.style.left = 'auto';
        solutionsTitleCard.style.top = 'auto';
        solutionsTitleCard.style.transform = 'translateY(0)';
        solutionsTitleCard.style.zIndex = '1';
      }
    }
  };
}

/**
 * Updates the transform of a title card to counter-move it horizontally
 * @param {HTMLElement} titleCard - The title card element
 * @param {number} scrollAmount - The amount the container has scrolled
 * @param {number} slideUpMultiplier - Multiplier for slide up amount (default: 1.2)
 */
export function updateTitleCardPosition(titleCard, scrollAmount, slideUpMultiplier = 1.2) {
  if (!titleCard || !titleCard.classList.contains('at-edge')) return;
  
  const slideUpAmount = titleCard.offsetHeight * slideUpMultiplier;
  titleCard.style.transform = `translateY(-${slideUpAmount}px) translateX(${-scrollAmount}px)`;
}