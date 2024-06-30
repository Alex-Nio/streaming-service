<script lang="ts" setup>
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  import Section from "@/components/layout/Section.vue";

  const searchQuery = ref("");
  const activeVideo = ref<Partial<VideoFile>>({});
  const files = ref<Partial<VideoFile>[]>([]);
  const HOST = "http://localhost:8080";

  interface VideoFile {
    fileName: string;
    magnetLink: string;
    magnet: string;
    author: string;
    title: string;
    category: string;
    size: string;
    quality: string;
    format: string;
    audio: string;
    seeds: string;
    peers: string;
  }

  const getMyMovies = async () => {
    const response = await axios.get(`${HOST}/movies`);
    files.value = response.data;
  };

  const findMovie = async () => {
    const response = await axios.get(`${HOST}/movies/search?nm=${searchQuery.value}`);
    files.value = response.data;
  };

  const play = async (file: Partial<VideoFile>) => {
    const { data } = await axios.get(`${HOST}/stream/add/${file.magnetLink}`);
    activeVideo.value = {
      magnetLink: file.magnetLink,
      fileName: data[0].name,
    };
  };

  const videoUrl = computed(() => {
    return activeVideo.value.fileName
      ? `${HOST}/stream/${activeVideo.value.magnetLink}/${activeVideo.value.fileName}`
      : "";
  });

  onMounted(getMyMovies);
</script>

<template>
  <Section>
    <h1>Movie Page</h1>

    <div>
      <video :src="videoUrl" controls autoplay></video>
      <hr />
      <input v-model="searchQuery" placeholder="Поиск фильма" type="search" />
      <button @click="findMovie">Найти</button>
      <hr />
      <ul>
        <li v-for="file in files" :key="file.magnet">
          <div v-if="file.title !== 'Не найдено'" class="file-details">
            <span class="film-author">
              <strong>Автор:</strong>
              {{ file.author }}
            </span>
            <span class="film-title">
              <strong>Название:</strong>
              {{ file.title }}
            </span>
            <span class="film-category">
              <strong>Категория:</strong>
              {{ file.category }}
            </span>
            <!-- <span class="film-size">
              <strong>Размер файла:</strong>
              {{ file.size.replace('↓', '') }}
            </span> -->
            <span class="film-quality">
              <strong>Качество видео:</strong>
              {{ file.quality }}
            </span>
            <span class="film-format">
              <strong>Формат видео:</strong>
              {{ file.format }}
            </span>
            <span class="film-audio">
              <strong>Формат аудио:</strong>
              {{ file.audio }}
            </span>
            <span class="film-seeds">
              <strong>Сиды:</strong>
              {{ file.seeds }}
            </span>
            <span class="film-peers">
              <strong>Пиры:</strong>
              {{ file.peers }}
            </span>
            <button @click="play(file)">Воспроизвести</button>
          </div>
          <div v-else class="file-details">Ничего не найдено</div>
        </li>
      </ul>
    </div>
  </Section>
</template>

<style lang="scss" scoped></style>
