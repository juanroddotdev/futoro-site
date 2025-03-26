<template>
  <div class="chat-sections-demo debug">
    <h1>Chat Sections Demo</h1>
    
    <!-- Vision to Reality Section -->
    <ScrollableChatSection
      :messages="visionToRealityMessages"
      :showTypingFor="visionTypingIndicators"
      sectionId="vision-chat"
      layout="content-left"
      :containerHeight="visionContainerHeight"
    >
      <template #headline>
        <h2>Vision to Reality</h2>
      </template>
      <template #subheadline>
        <p>Turning your business vision into an online reality.</p>
      </template>
      <template #content>
        <p>This section demonstrates how we understand your vision and help bring it to life.</p>
        <button class="btn-primary">Learn More</button>
      </template>
    </ScrollableChatSection>
    
    <!-- Common Frustrations Section -->
    <ScrollableChatSection
      :messages="frustrationsMessages"
      :showTypingFor="frustrationsTypingIndicators"
      sectionId="frustrations-chat"
      layout="content-right"
      :containerHeight="frustrationsContainerHeight"
    >
      <template #headline>
        <h2>Common Frustrations</h2>
      </template>
      <template #subheadline>
        <p>We understand the challenges you face with website development.</p>
      </template>
      <template #content>
        <p>This section addresses the common pain points business owners experience.</p>
        <button class="btn-primary">Explore Solutions</button>
      </template>
    </ScrollableChatSection>
    
    <!-- Personal Approach Section -->
    <ScrollableChatSection
      :messages="approachMessages"
      :showTypingFor="approachTypingIndicators"
      sectionId="approach-chat"
      layout="content-top"
      :containerHeight="approachContainerHeight"
    >
      <template #headline>
        <h2>Personal Approach</h2>
      </template>
      <template #subheadline>
        <p>How we work with you to create your perfect website.</p>
      </template>
      <template #content>
        <p>This section highlights our personalized approach to web development.</p>
        <button class="btn-primary">Our Process</button>
      </template>
    </ScrollableChatSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ScrollableChatSection from '@/components/sections/ScrollableChatSection.vue';
import { 
  getVisionToRealitySteps, 
  getCommonFrustrationsSteps, 
  getPersonalApproachSteps 
} from '@/data/chatSections';
import { calculateContainerHeight } from '@/utils/containerHeightUtils';

// Vision to Reality Section
const visionToRealityMessages = getVisionToRealitySteps();
const visionTypingIndicators = [1, 4, 7, 10]; // Show typing indicators before specific messages
const visionContainerHeight = computed(() => 
  calculateContainerHeight(visionToRealityMessages.length, heightOptions)
);

// Common Frustrations Section
const frustrationsMessages = getCommonFrustrationsSteps();
const frustrationsTypingIndicators = [1, 3, 5, 7]; // Show typing indicators before specific messages
const frustrationsContainerHeight = computed(() => 
  calculateContainerHeight(frustrationsMessages.length, heightOptions)
);

// Personal Approach Section
const approachMessages = getPersonalApproachSteps();
const approachTypingIndicators = [1, 3, 5, 7]; // Show typing indicators before specific messages
const approachContainerHeight = computed(() => 
  calculateContainerHeight(approachMessages.length, heightOptions)
);

// Custom container height options if needed
const heightOptions = {
  itemHeight: 50,
  heightMultiplier: 1.3,
  padding: 100
};
</script>

<style lang="scss" scoped>
.chat-sections-demo {
  padding: 20px;
  color:white;
  
  h1 {
    text-align: center;
    margin-bottom: 40px;
    color: white;
  }
  
  .btn-primary {
    background-color: #4a6cf7;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    
    &:hover {
      background-color: #3a5ce7;
    }
  }
}
</style>
