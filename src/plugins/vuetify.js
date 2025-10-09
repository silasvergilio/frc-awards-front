// Vue 3 + Vuetify 3
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Importar estilos Vuetify 3
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#0083AE',
                    secondary: '#68C3E2',
                    accent: '#ABD8E7',
                },
            },
        },
    },
})