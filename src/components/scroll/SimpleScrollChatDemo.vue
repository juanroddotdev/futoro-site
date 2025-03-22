<template>
  <div>
    <SimpleScrollChat
      title="From Vision to Reality"
      :messages="demoMessages"
      sectionId="simple-chat-demo"
      clientLabel="Client:"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SimpleScrollChat from './SimpleScrollChat.vue';

// Sample messages for demonstration
const demoMessages = ref([
  { type: 'received', text: 'I need a website for my business.' },
  { type: 'sent', text: 'Great! What kind of business do you have?' },
  { type: 'received', text: 'I run a small bakery that specializes in custom cakes.' },
  { type: 'sent', text: 'That sounds delicious! What are your main goals for the website?' },
  { type: 'received', text: 'I want to showcase my cake designs and allow customers to place orders online.' },
  { type: 'sent', text: 'Perfect. We can create a portfolio section for your designs and an order form with customization options.' },
  { type: 'received', text: 'How long would something like this take to build?' },
  { type: 'sent', text: 'For a site with portfolio and basic ordering functionality, were looking at about 3-4 weeks.' },
  { type: 'received', text: 'That works for my timeline. What about mobile users?' },
  { type: 'sent', text: 'The site will be fully responsive, ensuring a great experience on all devices. Many customers order on mobile these days.' },
  { type: 'received', text: 'Sounds perfect. When can we get started?' },
  { type: 'sent', text: 'We can begin right away! Ill prepare a detailed proposal with timeline and pricing for your review.' }
]);
</script>