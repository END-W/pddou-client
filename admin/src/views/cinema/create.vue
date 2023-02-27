<template>
  <cinema-detail :is-edit="false" />
</template>

<script>
import CinemaDetail from './components/CinemaDetail'

export default {
  name: 'CreateCinema',
  components: { CinemaDetail }
}
</script>