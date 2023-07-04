<template>
  <el-config-provider namespace="ep">
    <el-container
      style="min-height: 100vh; min-width: 100%"
      v-show="!chatDocument"
    >
      <BaseSide
        v-show="showSide"
        :style="{ width: isMobile ? '100vw' : '300px' }"
      />
      <div
        :style="{ width: getMainWidth() }"
        v-show="!isMobile || (isMobile && !showSide)"
      >
        <BaseHeader />
        <el-main>
          <!-- <HelloWorld msg="Hello Vue 3.0 + Element Plus + Vite" /> -->
          <chat :conversationId="activeConversationId" />
        </el-main>
      </div>
    </el-container>

    <el-container
      style="min-height: 100vh; min-width: 100%"
      v-show="chatDocument"
    >
      <DocSide
        v-show="showSide"
        :style="{ width: isMobile ? '100vw' : '70%' }"
        style="overflow-y: hidden; height: 100vh"
      />
      <div
        :style="{ width: getDocMainWidth() }"
        v-show="!isMobile || (isMobile && !showSide)"
      >
        <DocHeader />
        <el-main>
          <!-- <HelloWorld msg="Hello Vue 3.0 + Element Plus + Vite" /> -->
          <DocChat />
        </el-main>
      </div>
    </el-container>

    <Loading />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Chat from "~/components/Chat.vue";
import { useChatStore } from "~/store/chat";
import { useAppStore } from "~/store/app";
import { storeToRefs } from "pinia";
import { useDark, useToggle } from "@vueuse/core";

import { el } from "element-plus/es/locale";
const isDark = useDark();

let chatStore = useChatStore();
let appStore = useAppStore();
const { showSide, isMobile, chatDocument } = storeToRefs(appStore);

const { conversationList, messageList, activeConversationId } =
  storeToRefs(chatStore);

const mdcolor = ref("balck");
watch(
  () => isDark,
  (value, oldValue) => {
    if (value) {
      mdcolor.value = "white";
    } else {
      mdcolor.value = "black";
    }
  },
  { immediate: true }
);
const getDocMainWidth = () => {
  if (showSide.value) {
    if (isMobile.value) {
      return "0px";
    } else {
      return "30%";
    }
  } else {
    if (isMobile.value) {
      return "100vw";
    } else {
      return "100vw";
    }
  }
};
const getMainWidth = () => {
  if (showSide.value) {
    if (isMobile.value) {
      return "0px";
    } else {
      return "calc(100% - 300px)";
    }
  } else {
    if (isMobile.value) {
      return "100vw";
    } else {
      return "100vw";
    }
  }
};

//部分store持久化
let l1 = localStorage.getItem("chatStore_001");
if (l1) {
  chatStore.$patch(JSON.parse(l1));
}
//默认发送状态为空
chatStore.isSending = false;
chatStore.$subscribe((_, state) => {
  localStorage.setItem("chatStore_001", JSON.stringify(state));
});

let l2 = localStorage.getItem("appStore_001");
if (l2) {
  appStore.$patch(JSON.parse(l2));
}
//判断是否手机端
appStore.isMobile = window.innerWidth < 768;
//菜单自动收缩
if (appStore.isMobile) {
  appStore.showSide = false;
} else {
  appStore.showSide = true;
}
//重置文档对话状态
appStore.chatDocument = false;
//重置loading状态
appStore.loading = false;
appStore.$subscribe((_, state) => {
  localStorage.setItem("appStore_001", JSON.stringify(state));
});
</script>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.element-plus-logo {
  width: 50%;
}
.vuepress-markdown-body {
  background-color: transparent !important;
  padding: 5px !important;
  text-align: left;
  font-size: 14px !important;
}
</style>
<style lang="scss">
.vuepress-markdown-body {
  color: var(--mdcolor) !important;
}
</style>
