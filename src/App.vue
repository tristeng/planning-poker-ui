<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setTheme, getTheme } from './stores/cookies'

onMounted(() => {
  let theme = getTheme()
  if (theme === '') {
    theme = 'light'  // default theme
  }

  document.documentElement.setAttribute('data-bs-theme', theme)
  const themeToggle = document.getElementById('themeToggle') as HTMLInputElement
  if (!themeToggle) {
    return
  }
  themeToggle.onchange = onThemeToggle
  themeToggle.checked = theme === 'dark'
})

function onThemeToggle() {
  const themeToggle = document.getElementById('themeToggle') as HTMLInputElement
  if (!themeToggle) {
    return
  }
  const theme = themeToggle.checked ? 'dark' : 'light'
  setTheme(theme)  // store it in the user's cookies
  document.documentElement.setAttribute('data-bs-theme', theme)
}

</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
</style>
