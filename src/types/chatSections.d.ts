declare module '@/data/chatSections' {
  export interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'assistant' | string;
    timestamp?: number;
    type?: string;
    status?: string;
  }

  /**
   * Returns initial conversation messages for the hero section
   */
  export function getInitialConversation(): ChatMessage[];

  /**
   * Returns messages for the vision to reality section
   */
  export function getVisionToRealitySteps(): ChatMessage[];

  /**
   * Returns messages for the common frustrations section
   */
  export function getCommonFrustrationsSteps(): ChatMessage[];

  /**
   * Returns messages for the personal approach section
   */
  export function getPersonalApproachSteps(): ChatMessage[];
}