import { ref } from "vue";

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

export function useSnackbar() {
  const showMessage = (message, type = "success") => {
    snackbarMessage.value = message;
    snackbarColor.value = type === "error" ? "red" : "green";
    snackbar.value = true;
  };

  return {
    snackbar,
    snackbarMessage,
    snackbarColor,
    showMessage,
  };
}