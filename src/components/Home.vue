<script setup lang="ts">
</script>

<template>
  <h1 class="text-center">Planning Poker</h1>
  <p class="text-center paddown">A minimalist planning poker application.</p>
  <div class="container text-center">
    <div class="row">
      <div class="col">
        <router-link to="/game/new" class="btn btn-primary">Create New Game</router-link>
      </div>
      <div class="col">
        <router-link to="/game/join" class="btn btn-primary">Join Existing Game</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paddown {
  padding-bottom: 100px;
}
</style>