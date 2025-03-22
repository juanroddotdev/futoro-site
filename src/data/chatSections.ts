// Chat message type definition
export interface ChatMessage {
  type: 'sent' | 'received' | 'step' | 'response';
  text: string;
  time?: string;
}

// Convert step data to chat message format
export function convertStepsToMessages(steps: any[]): ChatMessage[] {
  return steps.map(step => ({
    type: step.type === 'step' ? 'sent' : 'received',
    text: step.text,
    time: step.time || '10:30 AM'
  }));
}

// Vision to Reality section
export function getVisionToRealitySteps() {
  return [
    { type: 'response', text: "I've got a vision!" },
    { type: 'step', text: "Of love?! 😍" },
    { type: 'response', text: "Yeah.....? No!!" },
    { type: 'response', text: "I have this idea for my business" },
    { type: 'step', text: "Like, a really cool storefront," },
    { type: 'response', text: "but idk how to make it work online." },
    { type: 'step', text: "a brand that's gonna pop," },
    { type: 'step', text: "or maybe a portfolio that'll blow minds." },
    { type: 'response', text: "Exactly! I want something that stands out from my competitors." },
    { type: 'step', text: "But then you gotta build a website..." },
    { type: 'response', text: "That's where I get stuck. I don't know where to start." },
    { type: 'step', text: "and suddenly it's like, what's a 'widget' and why is my site taking forever to load?" },
    { type: 'response', text: "Right? All this technical jargon is overwhelming!" },
    { type: 'step', text: "Let's ditch the tech-speak and figure out how to make this awesome together." },
    { type: 'response', text: "That sounds perfect. I need someone who speaks my language." }
  ];
}

// Common Frustrations section
export function getCommonFrustrationsSteps() {
  return [
    { type: 'step', text: "Seriously, who's got time for all this website stuff?" },
    { type: 'response', text: "I know I don't. I'm already juggling so much with my business." },
    { type: 'step', text: "You're busy, I get it." },
    { type: 'response', text: "Thank you! Sometimes it feels like no one understands that." },
    { type: 'step', text: "DIY builders? They're okay, but they never really nail your vibe." },
    { type: 'response', text: "I tried one of those and gave up after two days. It looked nothing like I wanted." },
    { type: 'step', text: "And SEO? Forget about it." },
    { type: 'response', text: "Is that why no one can find my current site on Google?" },
    { type: 'step', text: "Basically, there's a ton of stuff that can go sideways, and it's super frustrating." },
    { type: 'response', text: "You're speaking my language. This is exactly what I've been dealing with." }
  ];
}

// Personal Approach section
export function getPersonalApproachSteps() {
  return [
    { type: 'step', text: "Okay, so here's the deal:" },
    { type: 'response', text: "I'm listening..." },
    { type: 'step', text: "What if you had someone real on your team?" },
    { type: 'response', text: "That would be amazing instead of dealing with chatbots and templates." },
    { type: 'step', text: "Not some robot website thing, but like, an actual person who gets your whole vibe?" },
    { type: 'response', text: "Yes! Someone who understands what makes my business unique." },
    { type: 'step', text: "Someone who can turn your crazy ideas into a website that actually, you know, works?" },
    { type: 'response', text: "That's exactly what I need - someone who can translate my vision into reality." },
    { type: 'step', text: "Yeah, that's me." },
    { type: 'response', text: "I think we're going to work well together." }
  ];
}

// Collaboration Process section
export function getCollaborationProcessSteps() {
  return [
    { type: 'step', text: "Here's how we'll work together:" },
    { type: 'response', text: "I'm excited to hear this." },
    { type: 'step', text: "First, we'll chat about your goals and what makes your business special." },
    { type: 'response', text: "That sounds like a great starting point." },
    { type: 'step', text: "Then I'll create a custom design that captures your brand's personality." },
    { type: 'response', text: "Will I get to provide feedback?" },
    { type: 'step', text: "Absolutely! We'll refine it together until it's perfect." },
    { type: 'response', text: "Perfect. I want to be involved in the process." },
    // Add the rest of the steps here
  ];
}
const getCollaborationProcessSteps2 = () => {
  return [
    { type: 'step', text: "Look, I'm not just throwing together some random website." },
    { type: 'response', text: "That's refreshing to hear. I want something thoughtful." },
    { type: 'step', text: "I'm building your online hangout, your digital HQ, you know?" },
    { type: 'response', text: "I like that perspective - it's more than just a website." },
    { type: 'step', text: "A place where people actually get you." },
    { type: 'response', text: "That's what's been missing from my online presence!" },
    { type: 'step', text: "Think of me as your web-bestie, your inside guy, your creative wingman." },
    { type: 'response', text: "Having someone in my corner who understands tech would be such a relief." },
    { type: 'step', text: "So, how do we make this happen? Let's break it down." },
    { type: 'response', text: "I'm ready to get started. What's the first step?" }
  ];
};