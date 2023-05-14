<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { toggleDark } from "~/composables";
import { ref, reactive, getCurrentInstance } from "vue";
import { useChatStore } from "~/store/chat";
import { storeToRefs } from "pinia";
let chatStore = useChatStore();
const { zhishiku } = storeToRefs(chatStore);

const about = () => {
  console.log(123);

  ElMessageBox.alert(
    `
  本项目是专为 <a href="https://github.com/l15y/wenda" target="_blank">闻达</a> 设计的webui。<br>
  本项目git地址： <a href="https://github.com/AlanLee1996/wenda-webui" target="_blank">wenda-webui</a>
  `,
    "关于本项目",
    {
      dangerouslyUseHTMLString: true,
    }
  );
};
const settingsDialog = ref();
const currentInstance = getCurrentInstance();
const settings = () => {
  //console.log(currentInstance.ctx.$refs.settingsDialog.visible);
  currentInstance.ctx.$refs.settingsDialog.visible = true;
};
const settingsDisplay = ref(false);
const reactiveObj = reactive({
  settingsDisplay,
});
</script>

<template>
  <div
    style="display: flex; justify-content: end; border-bottom: 1px solid #ccc"
  >
    <div style="display: flex; margin-right: 20px">
      <div style="margin-top: 17px">知识库</div>
      <el-switch
        v-model="zhishiku"
        style="margin-left: 5px; margin-top: 12px"
      />
    </div>
    <button
      class="border-none bg-transparent cursor-pointer"
      @click="settings()"
    >
      设置
    </button>
    <div @click="toggleDark()" style="width: 60px">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </div>
    <button
      class="border-none bg-transparent cursor-pointer"
      @click="about()"
      style="margin-right: 20px"
    >
      关于
    </button>
  </div>
  <Settings ref="settingsDialog"></Settings>
</template>
