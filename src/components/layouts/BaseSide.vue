<template>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="false"
    @open="handleOpen"
    @close="handleClose"
    :style="{ backgroundColor: isDark ? '#000' : '#e4f5fc' }"
  >
    <div style="padding: 40px 0px 40px 30px; width: 300px">
      <div style="display: flex; justify-content: flex-start">
        <el-text style="font-size: 20px; font-weight: bolder"> 闻 达 </el-text>
      </div>
      <div style="display: flex; justify-content: flex-start">
        <el-text style="font-size: 15px; opacity: 0.5">
          大规模语言模型调用平台
        </el-text>
      </div>
    </div>

    <div style="position: absolute; opacity: 1; top: 0px; right: 0px">
      <!-- <Logo :width="80" :height="80" :color="isDark ? 'white' : 'black'" /> -->
      <img
        src="/robot.jpg"
        alt=""
        style="width: 120px; mix-blend-mode: multiply"
      />
    </div>
    <el-scrollbar
      style="padding: 0px 20px 10px 20px; height: calc(100vh - 210px)"
    >
      <div
        v-for="conversation in conversationList"
        :key="conversation.conversationId"
        style="height: 63px"
      >
        <el-card
          shadow="never"
          style="
            width: auto;
            height: 60px;
            border-radius: 5px;
            margin-top: 10px;
            cursor: pointer;
          "
          :style="{
            border:
              conversation.conversationId == activeConversationId
                ? '2px solid #aaa'
                : '0',
          }"
          :body-style="{
            padding: 0,
          }"
          @click="activeConversationId = conversation.conversationId"
        >
          <div style="width: auto; padding: 5px">
            <div
              style="
                display: flex;
                justify-content: flex-start;
                padding: 0px 5px;
              "
            >
              <el-text style="font-weight: bold; text-align: start" truncated
                >{{ conversation.title }}
              </el-text>
            </div>

            <div
              style="
                display: flex;
                justify-content: space-between;
                padding: 5px;
              "
            >
              <el-text>{{ conversation.msgCount }}条记录</el-text>
              <el-text>{{ conversation.time }}</el-text>
            </div>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
    <div>
      <el-text style="font-size: 12px; opacity: 0.5">
        共{{ conversationList.length }}个会话
      </el-text>
    </div>
    <el-button @click="chatStore.createConversation()">新建会话</el-button>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore } from "~/store/chat";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();

const isCollapse = ref(true);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
let chatStore = useChatStore();
const { conversationList, messageList, activeConversationId } =
  storeToRefs(chatStore);
activeConversationId.value = messageList.value[0].conversationId;
</script>
<style scoped></style>
