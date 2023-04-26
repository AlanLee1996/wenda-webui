<template>
  <el-config-provider namespace="ep">
    <el-container style="min-height: 100vh; min-width: 100%">
      <BaseSide style="width: 300px" />
      <div style="min-width: calc(100% - 300px)">
        <BaseHeader />
        <el-main>
          <!-- <HelloWorld msg="Hello Vue 3.0 + Element Plus + Vite" /> -->
          <chat :conversationId="activeConversationId" />
        </el-main>
      </div>
    </el-container>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Chat from "~/components/Chat.vue";
import { useChatStore } from "~/store/chat";
import { storeToRefs } from "pinia";
import { useDark, useToggle } from "@vueuse/core";
const isDark = useDark();

let chatStore = useChatStore();
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

//部分store持久化
let l1 = localStorage.getItem("chatStore_001");
if (l1) {
  chatStore.$patch(JSON.parse(l1));
}
chatStore.$subscribe((_, state) => {
  localStorage.setItem("chatStore_001", JSON.stringify(state));
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
