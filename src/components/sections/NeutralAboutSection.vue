<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '@/assets/images/hero-image.jpg';


gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.from('.about-content', {
    scrollTrigger: {
      trigger: '.about-content',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });
});
const aboutMe = reactive({
  one: "Hi, I'm Juan! A front-end developer passionate about building beautiful and functional websites. With a decade of experience working with diverse clients, I understand the importance of personalized solutions. That's why I'm transitioning to freelance, where I can dedicate my skills to helping individuals and small businesses thrive online. Let's work together to create a website that truly reflects your brand and vision.",
  two: "Hello! I'm Juan Rodriguez, a front-end developer and instructor with a passion for empowering others through technology. With 10 years of experience in web development, I specialize in creating engaging and accessible digital experiences. Now, I'm eager to collaborate with individual clients, providing them with the tools and knowledge they need to succeed in the digital world.",
  three: "Hey there! I'm Juan Rodriguez, a front-end developer with over 10 years of experience crafting user-friendly websites and web applications. I specialize in turning complex ideas into intuitive and engaging digital experiences for businesses like yours. Now, I'm excited to bring my expertise directly to individual clients, helping them achieve their unique online goals. Let's collaborate and bring your digital vision to life!"
})
const aboutFutoro = reactive({
  one: "At Futoro, my plan is to empower businesses and individuals with exceptional custom online experiences. I understand that navigating the digital landscape can be challenging, which is why I offer comprehensive custom web development and optimization services. Whether you need a brand-new custom website built on platforms like Squarespace, Wix, or Webflow, or require updates and improvements to your existing site, I'm here to help. My goal is to create visually appealing and strategically optimized websites that drive results. From implementing clear calls-to-action to enhance user retention to optimizing metadata and SEO for improved visibility, I provide all the tools and expertise your business needs to thrive online."
})
</script>

<template>
  <section id="about" class="section py-32 border border-black">
    <div class="about-content grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="heading bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
          About Futoro
        </h2>
        <p class="text-lg text-black-400 mb-6">
          {{ aboutMe.one }}
        </p>
        <p class="text-lg text-black-400">
          {{ aboutFutoro.one }}
        </p>
      </div>
      <div class="relative">
        <img class="h-auto max-w-full rounded-lg shadow-lg mb-8" :src="heroImage" alt="Design showcase">
      </div>
      <!-- <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
        <div class="relative bg-neutral-gray p-8 rounded-2xl border border-white/10">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-secondary mb-2">150+</h3>
              <p class="text-gray-300">Projects Completed</p>
            </div>
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-accent mb-2">98%</h3>
              <p class="text-gray-300">Client Satisfaction</p>
            </div>
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-primary mb-2">10+</h3>
              <p class="text-gray-300">Years Experience</p>
            </div>
            <div class="p-4 text-center">
              <h3 class="text-4xl font-bold text-secondary mb-2">24/7</h3>
              <p class="text-gray-300">Support</p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>