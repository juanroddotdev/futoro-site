declare module '@/components/sections/ChatScrollSection.vue' {
  import { DefineComponent } from 'vue';
  
  const ChatScrollSection: DefineComponent<{
    messages: any[];
    showTypingFor?: number[];
    layout?: 'content-left' | 'content-right' | 'content-top';
    sectionId?: string;
    containerHeight?: string;
    tiltX?: number;
    tiltY?: number;
    debug?: boolean;
    customClass?: string;
  }>;
  
  export default ChatScrollSection;
}