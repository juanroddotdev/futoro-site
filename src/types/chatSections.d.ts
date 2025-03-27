declare module '@/data/chatSections' {
  export interface ChatMessage {
    type: string;
    text: string;
  }
  
  export function getHurdlesIntroduction(): ChatMessage[];
  export function getTransitionToSolutions(): ChatMessage[];
  export function getInitialConversation(): ChatMessage[];
  export function getFinalConversation(): ChatMessage[];
  export function getFullConversation(): ChatMessage[];
  export function getConversationSegment(startIndex: number, endIndex: number): ChatMessage[];
}
