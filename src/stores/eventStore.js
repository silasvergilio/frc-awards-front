import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useEventStore = defineStore("eventStore", () => {
  const availableEvents = ref([]);
  const selectedEvent = ref(null);
  const selectedProgram = ref(null);

  // 🔹 1. Restaurar do localStorage ao carregar
  const savedEvent = localStorage.getItem("selectedEvent");
  const savedProgram = localStorage.getItem("selectedProgram");

  if (savedEvent) selectedEvent.value = JSON.parse(savedEvent);
  if (savedProgram) selectedProgram.value = savedProgram;

  // 🔹 2. Funções
  const setAvailableEvents = (events) => {
    availableEvents.value = events;
  };

  const setSelectedEvent = (eventCode) => {
    const event = availableEvents.value.find((e) => e.value === eventCode);
    selectedEvent.value = eventCode;
    selectedProgram.value = event?.program || null;
  };

  // 🔹 3. Persistir automaticamente
  watch(selectedEvent, (val) => {
    localStorage.setItem("selectedEvent", JSON.stringify(val));
  });

  watch(selectedProgram, (val) => {
    localStorage.setItem("selectedProgram", val || "");
  });

  return {
    availableEvents,
    selectedEvent,
    selectedProgram,
    setAvailableEvents,
    setSelectedEvent,
  };
});