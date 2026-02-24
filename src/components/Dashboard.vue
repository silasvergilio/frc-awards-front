<template>
    <v-container>
        <!-- Abas -->
        <v-tabs v-model="activeTab" background-color="#598290" dark>
            <v-tab value="init">Inicialização</v-tab>
            <v-tab value="judges">Juízes</v-tab>
        </v-tabs>

        <!-- Conteúdo das abas -->
        <div class="tab-content">
            <div v-if="activeTab === 'init'">
                <v-text-field autocomplete="off" v-model="eventCode" label="Código do Evento"
                    prepend-icon="mdi-pound-box-outline" variant="solo-filled"></v-text-field>

                <v-combobox autocomplete="off" v-model="program" :items="programs" item-title="text" item-value="value"
                    prepend-icon="mdi-application-braces-outline" label="Selecione o programa"
                    variant="solo-filled"></v-combobox>

                <v-btn class="add-button" color="#598290" variant="outlined" elevation="3" @click="startEvent"
                    :loading="loader">
                    Inicializar evento
                </v-btn>
            </div>

            <div v-else-if="activeTab === 'judges'">
                <v-row class="align-start" no-gutters>
                    <!-- Lista de Juízes à esquerda -->
                    <v-col cols="12" md="5" lg="4">
                        <v-card max-width="450">
                            <v-list density="compact">
                                <v-list-subheader>Juízes</v-list-subheader>
                                <v-list-item v-if="judges.length > 0" v-for="(judge, i) in judges" :key="i" :ripple="false" tabindex="-1"
                                    class="static-list-item">
                                    <template v-slot:prepend>
                                        <v-icon icon="mdi-account-supervisor"></v-icon>
                                    </template>

                                    <v-list-item-title>{{ judge.judgeName}}</v-list-item-title>

                                    <template v-slot:append>
                                        <v-btn class="delete-btn" icon="mdi-delete-outline" variant="text"></v-btn>
                                    </template>
                                </v-list-item>
                                <v-card v-else text="Não há juízes cadastrados"></v-card>
                            </v-list>
                        </v-card>
                    </v-col>

                    <!-- Input à direita -->
                    <v-col cols="12" md="7" lg="8" class="pl-6">
                        <v-text-field autocomplete="off" v-model="judgeName" label="Nome dos Juízes"
                            prepend-icon="mdi-account-multiple-check" variant="solo-filled"></v-text-field>

                        <v-btn class="add-button-judge" color="#598290" variant="outlined" elevation="3"
                            @click="addJudge" :loading="loader" :disabled="!judgeName || judgeName.trim().length < 1">
                            Adicionar Juizes
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
        </div>
    </v-container>
</template>

<script>
import { ref, watch } from "vue";
import { useApi } from "@/composables/useApi";
import { useEventStore } from "@/stores/eventStore";


export default {
    setup() {
        const { apiRequest } = useApi();
        const eventCode = ref("");
        const judgeName = ref("");
        const program = ref("");
        const activeTab = ref("init");
        const loader = ref(false);
        const judges = ref([]);


        const programs = [
            { text: "FRC", value: "frc" },
            { text: "FTC", value: "ftc" },
        ];



        const api = useApi();
        const eventStore = useEventStore();

        // 📌 Fetch do evento
        const fetchJudges = async () => {
            try {
                const result = await api.apiRequest('judges', {
                    method: "GET",
                    headers: { eventCode: eventStore.selectedEvent?.value }
                });
                judges.value = result;
            } catch (error) {
                console.error("Erro ao buscar juizes:", error.message);
            }
        };


        // 🔁 Reativo: sempre que o evento mudar, recarrega times e dados do evento
        watch(
            () => eventStore.selectedEvent,
            (newEvent, oldEvent) => {
                if (newEvent?.value && newEvent?.value !== oldEvent?.value) {
                    fetchJudges();
                }
            },
            { immediate: true }
        );


        const addJudge = async () => {
            try {
                await api.apiRequest("judges", {
                    method: "POST",
                    headers: { eventCode: eventStore.selectedEvent.value },
                    body: JSON.stringify({
                        judgeName: judgeName.value,
                    })
                });
            } catch (error) {
                console.error("Erro ao enviar submissão:", error.message);
            } finally {
                judgeName.value = ''
            }
        };


        const startEvent = async () => {
            try {
                loader.value = true;
                const result = await apiRequest("events", {
                    method: "POST",
                    body: JSON.stringify({
                        eventCode: eventCode.value,
                        program: program.value,
                    }),
                });
                console.log("Evento iniciado:", result);
            } catch (err) {
                console.error("Erro ao iniciar evento:", err.message);
            } finally {
                loader.value = false;
            }
        };

        return { eventCode, program, programs, startEvent, activeTab, loader, judges, judgeName, addJudge };
    },
};
</script>

<style scoped>
.tab-content {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.add-button {
    width: fit-content;
    font-weight: 500;
    font-size: 1.1rem;
    transition: all 0.25s ease;
    border-color: #1e5aa8;
    color: #1e5aa8;
}

.add-button-judge {
    width: fit-content;
    font-weight: 500;
    font-size: 1.1rem;
    transition: all 0.25s ease;
    border-color: #1e5aa8;
    color: #b2ebf2;
    margin-left: 2rem;
}

.add-button:hover {
    background-color: #1e5aa8;
    color: white;
    transform: scale(1.03);
}

/* remove o comportamento interativo */
.static-list-item {
    pointer-events: none;
    /* impede clique no item */
    user-select: none;
    cursor: default;
}

/* mas reativa o clique apenas nos botões */
.static-list-item .v-btn {
    pointer-events: auto;
}

/* botão normal e hover */
.delete-btn {
    color: #757575;
    transition: all 0.25s ease;
}

.delete-btn:hover {
    color: #e53935;
    background-color: rgba(229, 57, 53, 0.1);
    transform: scale(1.1);
}
</style>