// Message type definition
export interface Message {
  type: 'sent' | 'received' | 'step';
  text: string;
  time?: string;
}

// Vision to Reality section
export function getVisionToRealitySteps() {
  return [
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
    { type: 'received', text: "That sounds perfect. I need someone who speaks my language." }
  ];
}

// Common Frustrations section
export function getCommonFrustrationsSteps() {
  return [
    { type: 'sent', text: "Seriously, who's got time for all this website stuff?" },
    { type: 'received', text: "I know I don't. I'm already juggling so much with my business." },
    { type: 'sent', text: "You're busy, I get it." },
    { type: 'received', text: "Thank you! Sometimes it feels like no one understands that." },
    { type: 'sent', text: "DIY builders? They're okay, but they never really nail your vibe." },
    { type: 'received', text: "I tried one of those and gave up after two days. It looked nothing like I wanted." },
    { type: 'sent', text: "And SEO? Forget about it." },
    { type: 'received', text: "Is that why no one can find my current site on Google?" },
    { type: 'sent', text: "Basically, there's a ton of stuff that can go sideways, and it's super frustrating." },
    { type: 'received', text: "You're speaking my language. This is exactly what I've been dealing with." }
  ];
}

// Personal Approach section
export function getPersonalApproachSteps() {
  return [
    { type: 'sent', text: "Okay, so here's the deal:" },
    { type: 'received', text: "I'm listening..." },
    { type: 'sent', text: "What if you had someone real on your team?" },
    { type: 'received', text: "That would be amazing instead of dealing with chatbots and templates." },
    { type: 'sent', text: "Not some robot website thing, but like, an actual person who gets your whole vibe?" },
    { type: 'received', text: "Yes! Someone who understands what makes my business unique." },
    { type: 'sent', text: "Someone who can turn your crazy ideas into a website that actually, you know, works?" },
    { type: 'received', text: "That's exactly what I need - someone who can translate my vision into reality." },
    { type: 'sent', text: "Yeah, that's me." },
    { type: 'received', text: "I think we're going to work well together." }
  ];
}

// Collaboration Process section
export function getCollaborationProcessSteps() {
  return [
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
}
