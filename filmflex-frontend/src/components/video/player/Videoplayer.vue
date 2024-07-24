<script setup lang="ts">
  import { ref, watch } from "vue";
  import "video.js/dist/video-js.css";
  import axios from "axios";

  const newVideoSrc = ref("./demo3.mp4");

  // const props = defineProps<{
  //   videoSrc: string;
  //   videoType: string;
  // }>();

  // watch(
  //   () => props.videoSrc,
  //   async (newSrc) => {
  //     try {
  //       console.log("NEW SRC: ", newSrc);

  //       // Задаем заголовки для запроса
  //       const headers = {
  //         Range: "bytes=0-", // Пример заголовка для получения первых байтов видео
  //       };

  //       // Отправка запроса для получения нового источника видео с заголовками
  //       const response = await axios.get(`${newSrc}`, {
  //         headers: headers,
  //       });

  //       newVideoSrc.value = response.data.videoUrl;
  //     } catch (error) {
  //       console.error("Error fetching new video source:", error);
  //     }
  //   }
  // );
</script>

<template></template>
