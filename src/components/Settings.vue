<template>
  <el-dialog v-model="visible" title="设置">
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

let chatStore = useChatStore();
const visible = ref(false);
defineExpose({
  visible,
});
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
