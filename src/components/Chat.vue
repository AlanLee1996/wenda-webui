<script setup lang="ts">
import { ref, reactive, toRefs, defineProps } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useChatStore } from "~/store/chat";
import { storeToRefs } from "pinia";
import { useDark, useToggle } from "@vueuse/core";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

const isDark = useDark();

let chatStore = useChatStore();
const { conversationList, messageList, activeConversationId } =
  storeToRefs(chatStore);

const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
});

console.log(chatStore.getMessageByConversationId(props.conversationId));

const state = reactive({
  circleUrl:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  squareUrl:
    "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
  sizeList: ["small", "", "large"] as const,
});

const sendMessage = () => {
  if (chatStore.inputMessage.length == 0) {
    ElMessage.warning("消息不能为空");
    return;
  }
  chatStore.isSending = true;
  let sendtime = dayjs().format("YYYY-MM-DD hh:mm:ss");
  let messageSend = {
    messageId: nanoid(),
    role: "user",
    content: chatStore.inputMessage,
    time: sendtime,
  };
  let messageList = chatStore.getMessageByConversationId(
    chatStore.activeConversationId
  );
  messageList.history.push(messageSend);
  getKnowledge();
};

const getKnowledge = () => {
  let sendtime = dayjs().format("YYYY-MM-DD hh:mm:ss");
  let messageSend = {
    messageId: nanoid(),
    role: "ui",
    content: "正在检索数据...",
    time: sendtime,
  };
  let messageList = chatStore.getMessageByConversationId(
    chatStore.activeConversationId
  );
  messageList.history.push(messageSend);

  //开始获取知识库
  axios
    .post(import.meta.env.VITE_WENDA_URL + "/api/find", {
      prompt: chatStore.inputMessage,
    })
    .then(function (response) {
      console.log(response.data);

      //给机器人添加等待效果
      let messageAI = {
        messageId: nanoid(),
        role: "AI",
        content: "等待模型中...",
        time: sendtime,
        source: response.data,
      };
      let lastIndex = messageList.history.push(messageAI);
      let lastMsg = messageList.history[lastIndex - 1];

      chatStore.sendMessage(lastMsg);

      // if (response.data.length > 0) {
      //   chatStore.inputMessage = response.data[0].answer;
      //   chatStore.sendMessage();
      // }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getMsgBackColor = (role: string) => {
  if (role == "user") {
    return isDark.value ? "#303133" : "#e4f5fc";
  } else {
    return isDark.value ? "#202020" : "#f2f6fc";
  }
};
const jumpToSource = (content: any) => {
  content = content.title;
  if (content.indexOf("](http") != -1) {
    const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/;
    const matches = content.match(regex);
    if (matches) {
      const url = matches[2]; // 获取 URL
      console.log(`URL: ${url}`);
      window.open(url);
    } else {
      ElMessage.warning("该来源无法直接打开！");
    }
  }
};
const getSorceInfo = (content: any, type: string) => {
  if (type == "title" || type == "url") {
    content = content.title;
    if (content.indexOf("](http") != -1) {
      const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/;
      const matches = content.match(regex);

      if (matches) {
        const title = matches[1]; // 获取标题
        const url = matches[2]; // 获取 URL
        console.log(`Title: ${title}`);
        console.log(`URL: ${url}`);
      } else {
        console.log("No matches found.");
      }
      if (type == "title") {
        return matches[1];
      } else if (type == "url") {
        return matches[2];
      }
    } else {
      return content;
    }
  } else if (type == "content") {
    return content.content;
  }
};

const toast = () => {
  ElMessage.success("Hello");
};

const { circleUrl, squareUrl, sizeList } = toRefs(state);
</script>

<template>
  <el-scrollbar style="padding: 0px 10px 0px 0px; height: calc(100vh - 200px)">
    <!-- 聊天内容 -->
    <transition
      name="el-zoom-in-top"
      v-for="message in chatStore.getMessageByConversationId(
        props.conversationId
      )?.history"
      :key="
        chatStore.getMessageByConversationId(props.conversationId)
          ?.conversationId
      "
    >
      <div
        style="display: flex; width: 100%; margin-bottom: 10px"
        :style="{
          justifyContent: message.role == 'user' ? 'flex-end' : 'flex-start',
        }"
      >
        <div
          v-if="message.role == 'ui'"
          style="
            font-size: 12px;
            margin-left: 40px;
            font-weight: bolder;
            opacity: 0.5;
          "
        >
          {{ message.content }}
        </div>

        <div style="display: flex" v-if="message.role != 'ui'">
          <div v-if="message.role == 'AI'" style="margin-right: 10px">
            <Logo
              :width="30"
              :height="30"
              :color="isDark ? 'white' : 'black'"
            />
          </div>
          <el-card
            shadow="hover"
            style="
              max-width: calc((100vw - 100px) / 2);
              padding: 0px !important;
            "
            :style="{
              backgroundColor: getMsgBackColor(message.role),
            }"
            :body-style="{
              padding: '5px',
            }"
          >
            <v-md-preview
              :text="message.content"
              style="background-color: transparent"
            ></v-md-preview>
            <el-popover
              v-for="source in message.source"
              placement="top-start"
              title="数据来源"
              :width="200"
              trigger="hover"
              :content="getSorceInfo(source, 'content')"
            >
              <template #reference>
                <el-tag style="margin: 5px" @click="jumpToSource(source)">
                  <el-text class="w-150px" truncated>{{
                    getSorceInfo(source, "title")
                  }}</el-text>
                </el-tag>
              </template>
            </el-popover>
          </el-card>
        </div>
      </div>
    </transition>
  </el-scrollbar>
  <div style="position: fixed; width: calc(100% - 350px); bottom: 10px">
    <el-input
      :rows="4"
      type="textarea"
      v-model="chatStore.inputMessage"
      placeholder="请输入内容"
      resize="none"
      input-style="padding-right: 120px"
    >
    </el-input>
    <el-button
      round
      color="#79b7d1"
      :dark="isDark"
      plain
      style="position: absolute; right: 10px; top: 30px"
      @click="sendMessage()"
      :loading="chatStore.isSending"
    >
      发送
    </el-button>
  </div>
</template>

<style></style>
