<template>
  <div class="flex h-full min-h-screen">
    <div class="w-1/2 hidden md:flex flex justify-center items-center bg-primary text-white">
      <div>
        <div class="my-4 text-xl">Explore drawing challenges</div>
        <div class="my-4 text-xl">Share your progress with the community</div>
        <div class="my-4 text-xl">Track your skills progress</div>
      </div>
    </div>
    <div class="w-full md:w-1/2 flex justify-center items-center bg-gray-100 py-16">
      <div style="width: 320px; max-width: 320px;">
        <h1 class="mb-4 text-center">
          <span class="text-4xl font-bold text-primary mr-2">SketchDiary</span><!--
       --><span class="text-2xl text-gray-600">Beta</span>
        </h1>
        <div class="bg-white p-4 shadow-lg">
          <nuxt/>
        </div>
      </div>
    </div>
  </div>
</template>
