<script setup lang="ts">
import { Deck } from '../utils/model';

const props = defineProps({
  deck: { type: Deck, required: true },
})

const emit = defineEmits<{
  (e: 'voted', value: number): void
}>()

function clearVote() {
  document.querySelectorAll('#deck-cards > a').forEach((el) => el.classList.remove('active'))
}

function onCardSelected(event: MouseEvent) {
  // clear any other cards of their active class
  clearVote()

  // add the active class to the element that was clicked and emit an event (if it wasn't already selected)
  if(event.currentTarget) {
    const target = event.currentTarget as Element
    if(!target.classList.contains('active')) {
      target.classList.add('active')

      // emit an event with the card value
      const item = target.attributes.getNamedItem('data-card-value')
      if(item) {
        emit('voted', parseFloat(item.value))
      }
    }
  }
}

defineExpose({
  clearVote
})
</script>

<template>
  <div class="card-selector">
    <div id="deck-cards" class="list-group list-group-horizontal">
      <a v-for="card in props.deck.cards"
         @click.prevent="onCardSelected"
         href="#"
         class="list-group-item list-group-item-action text-center"
         :data-card-value="card.value">{{ card.label }}</a>
    </div>
  </div>
</template>

<style scoped>
.card-selector {
  padding-top: 10px;
}
</style>
