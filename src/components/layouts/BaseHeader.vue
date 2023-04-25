<script lang="ts" setup>
import { toggleDark } from "~/composables";
import { ref } from "vue";
import { useChatStore } from "~/store/chat";
import { storeToRefs } from "pinia";
let chatStore = useChatStore();
const { zhishiku } = storeToRefs(chatStore);
</script>

<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    style="display: flex; justify-content: end"
  >
    <div style="display: flex; margin-right: 10px">
      <div style="margin-top: 17px">知识库</div>
      <el-switch
        v-model="zhishiku"
        style="margin-left: 5px; margin-top: 12px"
      />
    </div>
    <el-menu-item>设置</el-menu-item>
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
    <el-menu-item>关于</el-menu-item>
  </el-menu>
</template>
