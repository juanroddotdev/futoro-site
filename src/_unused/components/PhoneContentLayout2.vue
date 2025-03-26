<template>
  <div class="phone-content-layout" :class="[layout, customClass]">
    <div class="content-container">
      <div class="headline-container" v-if="$slots.headline">
        <slot name="headline"></slot>
      </div>
      <div class="subheadline-container" v-if="$slots.subheadline">
        <slot name="subheadline"></slot>
      </div>
      <div class="content" v-if="$slots.content">
        <slot name="content"></slot>
      </div>
      <div class="cta-container" v-if="primaryCta || secondaryCta">
        <a v-if="primaryCta" :href="primaryCta.link" class="primary-cta">{{ primaryCta.text }}</a>
        <a v-if="secondaryCta" :href="secondaryCta.link" class="secondary-cta">{{ secondaryCta.text }}</a>
      </div>
    </div>
    <div class="phone-container">
      <PhoneSection
        :messages="messages"
        :showTypingFor="showTypingFor"
        :sectionId="sectionId"
        :position="phonePosition"
        :tiltX="tiltX"
        :tiltY="tiltY"
        :ambientMode="ambientMode"
        :enablePullEffect="enablePullEffect"
        :ambientTheme="ambientTheme"
        :unlockAnimationType="unlockAnimationType"
        :isUnlocked="isUnlocked"
        @pull-threshold-reached="onPullThresholdReached"
        @unlock="onUnlock"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PhoneSection from '@/components/PhoneSection.vue';

interface Props {
  messages: any[];
  showTypingFor: number[];
  layout?: 'content-left' | 'content-right' | 'content-top';
  phonePosition?: 'left' | 'right' | 'center';
  tiltX?: number;
  tiltY?: number;
  sectionId?: string;
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  customClass?: string;
  // Add ambient screen related props
  ambientMode?: boolean;
  enablePullEffect?: boolean;
  ambientTheme?: {
    baseColor?: string;
    endColor?: string;
    accentColor?: string;
  };
  unlockAnimationType?: 'wave' | 'ripple';
  isUnlocked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'content-left',
  phonePosition: 'right',
  tiltX: 8,
  tiltY: -20,
  sectionId: 'phone-content-section',
  customClass: '',
  // Default values for ambient screen props
  ambientMode: false,
  enablePullEffect: true,
  ambientTheme: () => ({
    baseColor: '#1a1f2c',
    endColor: '#2E3440',
    accentColor: 'rgba(245, 245, 245, 0.3)'
  }),
  unlockAnimationType: 'wave',
  isUnlocked: false
});

const emit = defineEmits(['pull-threshold-reached', 'unlock']);

const onPullThresholdReached = () => {
  emit('pull-threshold-reached');
};

const onUnlock = () => {
  emit('unlock');
};

// Method to focus the content section
const focusContent = () => {
  const contentElement = document.querySelector('.content-container');
  if (contentElement) {
    contentElement.scrollIntoView({ behavior: 'smooth' });
  }
};

// Expose methods
defineExpose({
  focusContent
});
</script>

<style lang="scss">
.phone-content-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 2;
  
  .content-container {
    width: 100%;
    min-height: 100vh;
    
    .headline-container, .subheadline-container, .content, .cta-container {
      padding: 1rem;
    }
    
    .headline-container {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .subheadline-container {
      font-size: 1.2rem;
      color: #555;
    }
    
    .content {
      margin: 1rem 0;
    }
    
    .cta-container {
      display: flex;
      gap: 1rem;
      
      .primary-cta, .secondary-cta {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        text-decoration: none;
        color: white;
      }
      
      .primary-cta {
        background-color: #007bff;
      }
      
      .secondary-cta {
        background-color: #6c757d;
      }
    }
  }
  
  .phone-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}

/* Layout variations */
.phone-content-layout {
  &.position-left {
    .content-container {
      .headline-container, .subheadline-container, .content, .cta-container {
        grid-column: 2 / 3;
      }
      
      .phone-container {
        grid-column: 1 / 2;
      }
    }
  }
  
  &.position-center {
    .content-container {
      grid-template-columns: 1fr;
      
      .headline-container, .subheadline-container, .content, .cta-container {
        grid-column: 1 / 2;
        text-align: center;
      }
      
      .phone-container {
        grid-column: 1 / 2;
        margin-top: 2rem;
      }
    }
  }
}

/* Media query for mobile */
@media (max-width: 768px) {
  .phone-content-layout {
    .content-container .section-inner {
      grid-template-columns: 1fr;
      
      .content-area, .phone-area {
        grid-column: 1 / 2;
      }
      
      .phone-area {
        margin-top: 2rem;
      }
    }
  }
}
</style>
