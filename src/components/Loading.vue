<script setup lang="ts">
import { ref, watch } from "vue";
import { useAppStore } from "~/store/app";
import { storeToRefs } from "pinia";
import { ElLoading } from "element-plus";
let appStore = useAppStore();
const { loading, loadingText } = storeToRefs(appStore);
//全局loading动画
let loadingDom: any = null;
watch(
  () => loading.value,
  (value, oldValue) => {
    if (loading.value) {
      loadingDom = ElLoading.service({
        lock: true,
        text: loadingText.value,
        background: "rgba(255, 255, 255, 0.8)",
      });
    } else {
      try {
        loadingDom.close();
      } catch (error) {}
    }
  },
  { immediate: true }
);
watch(
  () => loadingText.value,
  (value, oldValue) => {
    try {
      loadingDom.setText(value);
    } catch (error) {}
  },
  { immediate: true }
);
</script>

<template></template>

<style></style>
