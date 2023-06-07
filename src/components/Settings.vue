<template>
  <el-dialog v-model="visible" title="设置" :fullscreen="isMobile">
    <div class="slider-block">
      <span class="demonstration">Token限制</span>
      <el-slider
        v-model="chatStore.max_length"
        :step="10"
        :min="1000"
        :max="4000"
        show-input
      />
    </div>
    <div class="slider-block">
      <span class="demonstration">Temperature</span>
      <el-slider
        v-model="chatStore.temperature"
        :step="0.1"
        :min="0"
        :max="2"
        show-input
      />
    </div>
    <div class="slider-block">
      <span class="demonstration">Top_p</span>
      <el-slider
        v-model="chatStore.top_p"
        :step="0.1"
        :min="0"
        :max="1"
        show-input
      />
    </div>
    <div class="slider-block">
      <span class="demonstration">Prompt模板</span>
      <el-input
        v-model="chatStore.promptTemplate"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="Prompt模板"
      />
    </div>
    <div class="slider-block">
      <span class="demonstration">聊天记录导出</span>
      <el-button type="primary" plain @click="exportHistory('current')">
        导出当前会话
      </el-button>
      <el-button type="primary" plain @click="exportHistory('all')">
        导出所有
      </el-button>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="visible = false"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import { useChatStore } from "~/store/chat";

import { storeToRefs } from "pinia";
import { useAppStore } from "~/store/app";
let appStore = useAppStore();
const { showSide, isMobile } = storeToRefs(appStore);

let chatStore = useChatStore();
const visible = ref(false);
defineExpose({
  visible,
});
const downloadTextFile = (text: String, filename: String) => {
  // 创建一个Blob对象，并设置其类型为文本/plain
  const blob = new Blob([text], { type: "text/plain" });

  // 创建一个临时URL，用于生成下载链接
  const url = URL.createObjectURL(blob);

  // 创建一个<a>元素，设置其属性为下载链接
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // 将<a>元素隐藏并添加到文档中
  a.style.display = "none";
  document.body.appendChild(a);

  // 模拟点击<a>元素以触发下载
  a.click();

  // 清理临时URL和<a>元素
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
const exportHistory = (type: string) => {
  if (type == "current") {
    let history: any = chatStore.getMessageByConversationId(
      chatStore.activeConversationId
    );
    let filename = history.conversationId + ":聊天记录导出.txt";
    history = JSON.stringify(history);

    downloadTextFile(history, filename);
  } else if (type == "all") {
    let history: any = chatStore.messageList;
    history = JSON.stringify(history);
    let filename = "聊天记录导出.txt";
    downloadTextFile(history, filename);
  }
  // let text = "这是一段示例文本。";
  // let filename = "聊天记录导出.txt";
  // downloadTextFile(text, filename);
};
</script>
<style>
.slider-block {
  display: flex;
  align-items: center;
}
.slider-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
  text-align: left;
  min-width: 100px;
}
</style>
