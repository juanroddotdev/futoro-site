import { ref, readonly } from 'vue';

// Create a singleton instance
const loadedSections = ref<Set<string>>(new Set());
const visibleSections = ref<Set<string>>(new Set());

export function useLazySection() {
  // Register a section as loaded
  function markSectionLoaded(sectionId: string, track: boolean) {
    loadedSections.value.add(sectionId);
    console.log(`[SectionLoader] Section ${sectionId} loaded. Total loaded: ${loadedSections.value.size}`);
  }

  // Register a section as visible
  function markSectionVisible(sectionId: string, track: boolean) {
    visibleSections.value.add(sectionId);
    console.log(`[SectionLoader] Section ${sectionId} visible. Currently visible: ${Array.from(visibleSections.value).join(', ')}`);
  }

  // Register a section as hidden
  function markSectionHidden(sectionId: string) {
    visibleSections.value.delete(sectionId);
    console.log(`[SectionLoader] Section ${sectionId} hidden. Currently visible: ${Array.from(visibleSections.value).join(', ')}`);
  }

  // Check if a section is loaded
  function isSectionLoaded(sectionId: string) {
    return loadedSections.value.has(sectionId);
  }

  // Check if a section is visible
  function isSectionVisible(sectionId: string) {
    return visibleSections.value.has(sectionId);
  }

  // Get all loaded sections
  function getLoadedSections() {
    return Array.from(loadedSections.value);
  }

  // Get all visible sections
  function getVisibleSections() {
    return Array.from(visibleSections.value);
  }

  return {
    loadedSections: readonly(loadedSections),
    visibleSections: readonly(visibleSections),
    markSectionLoaded,
    markSectionVisible,
    markSectionHidden,
    isSectionLoaded,
    isSectionVisible,
    getLoadedSections,
    getVisibleSections
  };
}