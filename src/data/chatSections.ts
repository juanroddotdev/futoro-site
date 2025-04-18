// Define proper TypeScript interfaces
export interface ChatMessage {
  type: 'sent' | 'received' | 'step';
  text: string;
  sender?: string;
  timestamp?: number;
}

// Complete chat array with all messages
const chat: ChatMessage[] = [
  { type: 'received', text: "I've got a vision!" },
  { type: 'sent', text: "Of love?! 😍" },
  { type: 'received', text: "Yeah.....? No!!" },
  { type: 'received', text: "I have this idea for my business" },
  { type: 'sent', text: "Like, a really cool storefront," },
  { type: 'received', text: "but idk how to make it work online." },
  { type: 'sent', text: "a brand that's gonna pop," },
  { type: 'sent', text: "or maybe a portfolio that'll blow minds." },
  { type: 'received', text: "Exactly! I want something that stands out from my competitors." },
  { type: 'sent', text: "But then you gotta build a website..." },
  { type: 'received', text: "That's where I get stuck. I don't know where to start." },
  { type: 'sent', text: "and suddenly it's like, what's a 'widget' and why is my site taking forever to load?" },
  { type: 'received', text: "Right? All this technical jargon is overwhelming!" },
  { type: 'sent', text: "Let's ditch the tech-speak and figure out how to make this awesome together." },
  { type: 'received', text: "That sounds perfect. I need someone who speaks my language." },
  { type: 'sent', text: "Seriously, who's got time for all this website stuff?" },
  { type: 'received', text: "I know I don't. I'm already juggling so much with my business." },
  { type: 'sent', text: "You're busy, I get it." },
  { type: 'received', text: "Thank you! Sometimes it feels like no one understands that." },
  { type: 'sent', text: "DIY builders? They're okay, but they never really nail your vibe." },
  { type: 'received', text: "I tried one of those and gave up after two days. It looked nothing like I wanted." },
  { type: 'sent', text: "And SEO? Forget about it." },
  { type: 'received', text: "Is that why no one can find my current site on Google?" },
  { type: 'sent', text: "Basically, there's a ton of stuff that can go sideways, and it's super frustrating." },
  { type: 'received', text: "You're speaking my language. This is exactly what I've been dealing with." },
  { type: 'sent', text: "Okay, so here's the deal:" },
  { type: 'received', text: "I'm listening..." },
  { type: 'sent', text: "What if you had someone real on your team?" },
  { type: 'received', text: "That would be amazing instead of dealing with chatbots and templates." },
  { type: 'sent', text: "Not some robot website thing, but like, an actual person who gets your whole vibe?" },
  { type: 'received', text: "Yes! Someone who understands what makes my business unique." },
  { type: 'sent', text: "Someone who can turn your crazy ideas into a website that actually, you know, works?" },
  { type: 'received', text: "That's exactly what I need - someone who can translate my vision into reality." },
  { type: 'sent', text: "Yeah, that's me." },
  { type: 'received', text: "I think we're going to work well together." },
  { type: 'sent', text: "Here's how we'll work together:" },
  { type: 'received', text: "I'm excited to hear this." },
  { type: 'sent', text: "First, we'll chat about your goals and what makes your business special." },
  { type: 'received', text: "That sounds like a great starting point." },
  { type: 'sent', text: "Then I'll create a custom design that captures your brand's personality." },
  { type: 'received', text: "Will I get to provide feedback?" },
  { type: 'sent', text: "Absolutely! We'll refine it together until it's perfect." },
  { type: 'received', text: "Perfect. I want to be involved in the process." },
  { type: 'sent', text: "Look, I'm not just throwing together some random website." },
  { type: 'received', text: "That's refreshing to hear. I want something thoughtful." },
  { type: 'sent', text: "I'm building your online hangout, your digital HQ, you know?" },
  { type: 'received', text: "I like that perspective - it's more than just a website." },
  { type: 'sent', text: "A place where people actually get you." },
  { type: 'received', text: "That's what's been missing from my online presence!" },
  { type: 'sent', text: "Think of me as your web-bestie, your inside guy, your creative wingman." },
  { type: 'received', text: "Having someone in my corner who understands tech would be such a relief." },
  { type: 'sent', text: "So, how do we make this happen? Let's break it down." },
  { type: 'received', text: "I'm ready to get started. What's the first step?" }
];

/**
 * Returns initial conversation messages for the hero section
 */
export function getInitialConversation(): ChatMessage[] {
  return [
    { type: 'received', text: "I've got a vision!" },
    { type: 'sent', text: "Of love?! 😍" },
    { type: 'received', text: "Yeah.....? No.." },
    { type: 'received', text: "I have this idea for my business" },
    { type: 'sent', text: "Clothing store!?" },
    { type: 'sent', text: "like an Etsy but its yours? and a brand that pops! right?" },
    { type: 'received', text: "Exactly! I want something that stands out!" },
    { type: 'sent', text: "But then you gotta build a website..." },
    { type: 'received', text: "That's where I get stuck. Idk where to start." },
    { type: 'sent', text: "Yeah, it can be a lot." },
    { type: 'received', text: "Yup! All this technical 💩 is overwhelming!" },
  ];
}

/**
 * Returns messages for the hurdles introduction section
 */
export function getHurdlesIntroduction(): ChatMessage[] {
  return [
    { type: 'sent', text: "&  who has time for all that?" },
    { type: 'received', text: "Not me. I'm swamped." },
    { type: 'sent', text: "DIY builders? They're great! ...if you know what you're doing." },
    { type: 'received', text: "Tried that. Epic fail." },
    { type: 'sent', text: "And SEO? Ugh." },
    { type: 'received', text: "What's that?" },
    { type: 'sent', text: "...Exactly!" }
  ];
}

/**
 * Returns messages for the transition to solutions section
 */
export function getTransitionToSolutions(): ChatMessage[] {
  return [
    { type: 'sent', text: "What if you had someone *real* on your team?" },
    { type: 'received', text: "Like, not a robot?" },
    { type: 'sent', text: "Exactly! Someone who gets your vibe." },
    { type: 'received', text: "And can turn my ideas into a website?" },
    { type: 'sent', text: "Yeah, that's me." }
  ];
}

/**
 * Returns messages for the final conversation section
 */
export function getFinalConversation(): ChatMessage[] {
  return [
    { type: 'sent', text: "Here's how we'll work together:" },
    { type: 'received', text: "Tell me more!" },
    { type: 'sent', text: "We'll chat, design, refine - together." },
    { type: 'received', text: "Sounds good. I want to be involved." },
    { type: 'sent', text: "Think of me as your web-bestie, your wingman." },
    { type: 'received', text: "That's a relief!" },
    { type: 'sent', text: "So, let's make this happen. Ready?" }
  ];
}

/**
 * Returns the full chat conversation
 */
export function getFullConversation(): ChatMessage[] {
  return chat;
}

/**
 * Returns a specific segment of the conversation
 * @param startIndex The starting index (inclusive)
 * @param endIndex The ending index (exclusive)
 */
export function getConversationSegment(startIndex: number, endIndex: number): ChatMessage[] {
  return chat.slice(startIndex, endIndex);
}

// Commented out original functions for reference
/*
export const getInitialConversation = () => {
  return chat.slice(0, 14); // chat[0] to chat[13] (inclusive)
};

export const getHurdlesIntroduction = () => {
  return chat.slice(13, 24); // chat[13] to chat[23] (inclusive)
};

export const getTransitionToSolutions = () => {
  return chat.slice(23, 34); // chat[23] to chat[33] (inclusive)
};

export const getFinalConversation = () => {
  return chat.slice(33); // chat[33] to the end of the array
};
*/
