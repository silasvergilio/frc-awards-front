<template>
  <v-form ref="form">
    <v-container fluid>
      <!-- Título com descrição -->
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          Indicar Time
        </v-card-title>

        <!-- Loader -->
        <v-skeleton-loader v-if="loader" class="mx-auto mt-6 pa-4" type="card" elevation="2">
          <template #default>
            <v-card flat class="pa-4">
              <v-skeleton-loader type="heading" width="60%" class="mb-6" />
              <v-skeleton-loader type="paragraph" width="100%" height="45px" class="mb-4" />
              <v-skeleton-loader type="paragraph" width="100%" height="45px" class="mb-4" />
              <v-skeleton-loader type="paragraph" width="100%" height="45px" class="mb-4" />
              <v-skeleton-loader type="button" width="150px" height="40px" class="mt-6" />
            </v-card>
          </template>
        </v-skeleton-loader>

        <!-- Seleções -->
        <v-row v-else>

          <v-col cols="12" md="4">
            <v-combobox v-model="award" :items="premios" item-title="text" item-value="value" label="Selecione o prêmio"
              outlined dense required variant="solo-filled"></v-combobox>
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox v-model="team" :items="times" item-title="text" item-value="value" label="Selecione o time"
              variant="solo-filled"></v-combobox>
          </v-col>

          <v-col cols="12" md="4">
            <v-combobox v-model="room" :items="isFTC ? salasFTC : salasFRC" item-title="text" label="Selecione a Dupla"
              outlined dense required variant="solo-filled"></v-combobox>
          </v-col>
        </v-row>

        <!-- Justificativa -->
        <v-row v-if="!loader">
          <v-col cols="12">
            <v-textarea v-model="message" label="Justificativa" outlined dense></v-textarea>
          </v-col>
        </v-row>
<!-- 
        <v-row v-if="!loader">
          <v-col cols="12" md="6">
            <v-file-input v-model="image" label="Enviar imagem (opcional)" accept="image/*" prepend-icon="mdi-camera"
              variant="solo-filled" show-size></v-file-input>
          </v-col>
        </v-row> -->

        <!-- Botão de envio -->
        <v-row v-if="!loader">
          <v-col cols="12" md="4">
            <v-btn @click="indicaTime" color="#1E5AA8" depressed elevation="5" outlined
              :disabled="!team || !award || !room || !message">
              Enviar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useApi } from "@/composables/useApi";
import { useEventStore } from "@/stores/eventStore";
import { computed } from "vue";

export default {
  setup() {
    const team = ref(null);
    const award = ref(null);
    const room = ref(null);
    const message = ref("");
    const times = ref([]);
    const loader = ref(false);
    const image = ref(null);


    const premiosFRC = [
      { text: "Autonomous", value: 1, category: "MCI" },
      { text: "Creativity", value: 2, category: "MCI" },
      { text: "Excellence in Engineering", value: 3, category: "MCI" },
      { text: "Industrial Design", value: 4, category: "MCI" },
      { text: "Innovation in Control", value: 5, category: "MCI" },
      { text: "Quality", value: 6, category: "MCI" },
      { text: "Engineering Inspiration", value: 7, category: "AE" },
      { text: "Gracious Professionalism", value: 8, category: "AE" },
      { text: "Imagery", value: 9, category: "AE" },
      { text: "Judges", value: 10, category: "AE" },
      { text: "Rookie All Star", value: 11, category: "AE" },
      { text: "Rising All Star", value: 12, category: "AE" },
      { text: "Team Spirit", value: 13, category: "AE" },
      { text: "Sustainability", value: 14, category: "AE" },
    ];

    const premiosFTC = [
      { text: "Think Award", value: 2, category: "MCI" },
      { text: "Connect Award", value: 3, category: "AE" },
      { text: "Innovate Award", value: 4, category: "MCI" },
      { text: "Design Award", value: 5, category: "MCI" },
      { text: "Control Award", value: 6, category: "MCI" },
      { text: "Reach Award", value: 6, category: "AE" },
      { text: "Sustain Award", value: 6, category: "AE" },

    ];

    const salasFTC = [
      { text: "Sala A" },
      { text: "Sala B" },
      { text: "Sala C" },
      { text: "Sala D" },
      { text: "Sala E" },
    ];

    const salasFRC = [
      { text: "Valter / Arthur" },
      { text: "Flaudilenio / Isabela" },
      { text: "Vitor / Fabio" },
      { text: "Mariana / Yuri" },
      { text: "Karine / Gabriel" },
      { text: "Felipe / Lubia" },
      { text: "Vanessa / Juliane" },
      { text: "Simone / Willian" },

    ];

    const api = useApi();
    const eventStore = useEventStore();


    const isFTC = computed(() => {
      const event = eventStore.selectedEvent;
      if (!event) return false;

      // ajuste conforme seu modelo real
      return event.program === "ftc";
    });

    const premios = computed(() => {
      if (!eventStore.selectedEvent?.value) return [];

      // ajuste essa condição ao seu modelo real de evento

      if (eventStore.selectedEvent.program == "ftc") {
        return premiosFTC;
      }

      return premiosFRC;
    });

    const fetchTeams = async () => {
      if (!eventStore.selectedEvent?.value) return;

      loader.value = true;
      try {
        const result = await api.apiRequest("teams", {
          method: "GET",
          headers: { eventCode: eventStore.selectedEvent.value },
        });

        // transforma os times para o combobox
        times.value = (result.data || result).map((t) => ({
          value: t.value,
          text: t.text,
          state: t.state,
          school: t.school,
        }));
      } catch (error) {
        console.error("Erro ao buscar times:", error.message);
      } finally {
        loader.value = false;
      }
    };

    // Chama a API ao montar
    onMounted(fetchTeams);

    // Atualiza times automaticamente quando o evento mudar
    watch(
      () => eventStore.selectedEvent,
      (newEvent, oldEvent) => {
        if (newEvent?.value !== oldEvent?.value) fetchTeams();
      }
    );

    const indicaTime = async () => {

      if (!team.value || !award.value || !room.value || !message.value) {
        alert("Preencha todos os campos antes de enviar.");
        return;
      }

      try {

        const formData = new FormData();

        formData.append("awardName", award.value.text);
        formData.append("motive", message.value);
        formData.append("judge", room.value.text);
        formData.append("category", award.value.category);
        formData.append("value", team.value.value);

        if (image.value) {
          formData.append("image", image.value);
        }

        await api.apiRequest("awards", {
          method: "POST",
          headers: { eventCode: eventStore.selectedEvent.value },
          body: formData
        });

      } catch (error) {
        console.error("Erro ao enviar submissão times:", error.message);
      } finally {
        team.value = null;
        award.value = null;
        room.value = null;
        message.value = "";
        image.value = null;
      }
    };

    return { team, award, room, message, times, loader, premios, salasFTC, salasFRC, isFTC, image, indicaTime };
  },
};
</script>