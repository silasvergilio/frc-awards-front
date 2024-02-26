<template>
  <div class="text-center">

    <v-overlay :value="overlay">
      <v-progress-circular 
      color="#1E5AA8"
      indeterminate size="128"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
    props: {
    overlay: Boolean,
  
  },
};
</script>