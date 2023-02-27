<template>
  <cinema-detail :is-edit="true" />
</template>

<script>
import CinemaDetail from './components/CinemaDetail'

export default {
  name: 'EditCinema',
  components: { CinemaDetail }
}
</script>