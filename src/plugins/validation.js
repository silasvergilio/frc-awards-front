// src/plugins/validation.js
import { configure, defineRule } from "vee-validate";
import { required, email, min, max } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import ptBR from "@vee-validate/i18n/dist/locale/pt_BR.json";

// 1️⃣ Definir regras globais (assim você pode só usar `rules="required|min:3"` nos Fields)
defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

// 2️⃣ Configurar idioma e mensagens de erro
configure({
    generateMessage: localize({
        pt_BR: ptBR,
    }),
    validateOnInput: true, // valida enquanto o usuário digita
});