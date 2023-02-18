<template>
  <movie-detail :is-edit="false" />
</template>

<script>
import MovieDetail from './components/MovieDetail'

export default {
  name: 'CreateMovie',
  components: { MovieDetail }
}
</script>
