import { useAuth0 } from "@auth0/auth0-vue";
import { useSnackbar } from "@/composables/useSnackbar";

/**
 * Hook de acesso à API com tratamento de erros, snackbar e Auth0
 */
export function useApi() {
    const { getAccessTokenSilently, isAuthenticated, logout } = useAuth0();
    const { showMessage } = useSnackbar();

    /**
     * Faz uma requisição HTTP autenticada (quando possível)
     * @param {string} url - URL da requisição
     * @param {object} options - Configurações adicionais do fetch
     * @param {boolean} requireAuth - Define se precisa de autenticação (default: true)
     */
    const apiRequest = async (url, options = {}, requireAuth = true) => {
        try {

            const isFormData = options.body instanceof FormData;

            const headers = {
                ...(options.headers || {})
            };

            // só define JSON se NÃO for upload
            if (!isFormData) {
                headers["Content-Type"] = "application/json";
            }

            // 🔐 Adiciona o token do Auth0, se necessário
            if (requireAuth && isAuthenticated.value) {
                const token = await getAccessTokenSilently({
                    audience: "https://frc-awards.api",
                    scope: "read:events write:events",
                });
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`${process.env.VUE_APP_SERVER_DOMAIN}/api/${url}`, {
                ...options,
                headers,
            });

            // Se receber 401, faz logout automático
            if (response.status === 401) {
                showMessage("Sessão expirada. Você será desconectado.", "error");
                logout({ logoutParams: { returnTo: window.location.origin } });
                throw new Error("Usuário não autorizado (401)");
            }

            // ❗ Verifica outros códigos de erro HTTP
            if (!response.ok) {
                let message = `Erro ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData?.message) message = errorData.message;
                } catch { /* ignora parse */ }
                showMessage(message, "error");
                throw new Error(message);
            }

            // ✅ Retorna JSON ou null
            try {
                return await response.json();
            } catch {
                return null;
            }

        } catch (err) {
            showMessage(`Falha na comunicação: ${err.message}`, "error");
            throw err;
        }
    };

    return { apiRequest };
}