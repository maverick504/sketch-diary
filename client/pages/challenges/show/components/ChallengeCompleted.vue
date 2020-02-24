<template>
  <div class="flex-grow flex justify-center items-center">
    <div class="text-gray-900">
      <template v-if="challenge.userRelationship.status === 'completed'">
        <div class="text-center mb-4">
          <h1 class="text-2xl mb-2">
            Challenge Overcome!
          </h1>
          <p>
            Well done!
          </p>
        </div>
      </template>
      <template v-else-if="challenge.userRelationship.status === 'receiving-feedback'">
        <div class="text-center mb-4">
          <h1 class="text-2xl mb-2">
            Challenge Overcome!
          </h1>
          <p>
            Soon you will start receiving feedback from other users.
          </p>
        </div>
      </template>
      <template v-else-if="challenge.userRelationship.status === 'snap-required'">
        <div class="text-center mb-4">
          <h1 class="text-2xl mb-2">
            Challenge Overcome!
          </h1>
          <div class="mb-2">
            <span v-for="skill in challenge.skillPoints" :style="{ color: skill.color }" class="mr-2">
              {{ `+${skill.pivot.points} ${skill.name}` }}
            </span>
          </div>
          <p>
            Upload your a photo of your work.
          </p>
        </div>
        <t-button type="button" variant="primary" size="lg" class="inline-block mx-1" @click="$bus.$emit('openCreateSnapModal', { userChallengeId: challenge.userRelationship.id })">
          Upload
        </t-button><t-button type="button" variant="secondary" size="lg" class="inline-block mx-1"@click="$emit('reset')">
          Reset
        </t-button>
      </template>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    challenge: {
      type: Object,
      required: true
    }
  }
}
</script>
