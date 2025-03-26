declare module '@/utils/containerHeightUtils' {
  /**
   * Calculates container height based on message count or content size
   */
  export function calculateContainerHeight(
    messageCount: number, 
    options?: {
      baseHeight?: number;
      itemHeight?: number;
      padding?: number;
      heightMultiplier?: number;
      minHeight?: number;
      adaptToScreenSize?: boolean;
    }
  ): string;

  /**
   * Calculates container height specifically for services section
   */
  export function calculateServicesHeight(
    serviceCount: number,
    options?: {
      itemHeight?: number;
      heightMultiplier?: number;
    }
  ): string;

  /**
   * Calculates container height for horizontal scrolling card sections
   */
  export function calculateHorizontalScrollHeight(
    cardCount: number,
    options?: {
      baseHeight?: number;
      heightMultiplier?: number;
      minHeight?: number;
    }
  ): string;
}