<template>
  <movie-detail :is-edit="true" />
</template>

<script>
import MovieDetail from './components/MovieDetail'

export default {
  name: 'EditMovie',
  components: { MovieDetail }
}
</script>
