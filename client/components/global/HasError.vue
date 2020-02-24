<template>
  <span
    v-if="form.hasErrors(field)"
    class="block text-red text-sm mt-2">
    {{ form.getFirstError(field) }}
  </span>
</template>

<script>
export default {
  props: {
    form: { type: Object, required: true },
    field: { type: String, required: true }
  }
}
</script>
