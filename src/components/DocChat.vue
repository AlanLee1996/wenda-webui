<script setup lang="ts">
import imgAi from "~/assets/head.png";

import { ref, reactive, toRefs, defineProps, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElNotification } from "element-plus";
import { useChatStore } from "~/store/chat";
import { useDocChatStore } from "~/store/docChat";
import { useAppStore } from "~/store/app";
import { storeToRefs } from "pinia";
import { useDark, useToggle } from "@vueuse/core";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const copy = async (content: string) => {
  try {
    await toClipboard(content);
    ElMessage.warning("消息复制成功");
  } catch (e) {
    console.error(e);
  }
};

const isDark = useDark();

let chatStore = useChatStore();
let docChatStore = useDocChatStore();

let { messageList } = storeToRefs(docChatStore);
let appStore = useAppStore();
const { showSide, isMobile } = storeToRefs(appStore);

const state = reactive({});

//发送按钮事件
const sendMessage = () => {
  //如果在发送状态则终止发送
  if (chatStore.isSending) {
    chatStore.isAbort = true;
    //console.log(chatStore.isAbort);

    chatStore.isSending = false;
    return;
  }
  if (chatStore.inputMessage.length == 0) {
    ElMessage.warning("消息不能为空");
    return;
  }
  chatStore.isAbort = false;
  chatStore.isSending = true;
  //先显示用户发送的消息
  let sendtime = dayjs().format("YYYY-MM-DD hh:mm:ss");
  let thisMessageId = nanoid();
  let messageSend = {
    messageId: thisMessageId,
    role: "user",
    content: chatStore.inputMessage,
    time: sendtime,
  };
  messageList.value.push(messageSend);
  //进入检索知识库流程
  getKnowledge(thisMessageId, false);
};
//重试按钮事件
const retryMessage = (messageId: string) => {
  //当前未在发送状态才能重试
  if (chatStore.isSending) {
    ElMessage.warning("当前正在发送消息，无法重试");
    return;
  }
  chatStore.isAbort = false;
  chatStore.isSending = true;
  getKnowledge(messageId, true);
};

//获取知识库数据
const getKnowledge = (parentMessageId: string, isRetry: boolean) => {
  let sendtime = dayjs().format("YYYY-MM-DD hh:mm:ss");
  //如果是重试
  if (isRetry) {
    //将输入框的内容设置为parentMessageId的内容
    chatStore.inputMessage = messageList.value.find(
      (i: any) => i.messageId == parentMessageId
    ).content;
  }
  let lastMsg: any;
  //如果是重试
  if (isRetry) {
    lastMsg = messageList.value.find(
      (i: any) => i.parentMessageId == parentMessageId
    );
  }
  //则开始检索
  let messageSend = {
    messageId: nanoid(),
    role: "ui",
    content: "正在检索数据...",
    time: sendtime,
  };

  let parentIndex = messageList.value.findIndex(
    (i: any) => i.messageId == parentMessageId
  );
  //在parentMessageId后面插入消息
  messageList.value.splice(parentIndex + 1, 0, messageSend);
  let uiMsg = messageList.value[parentIndex + 1];

  //开始获取知识库
  axios
    .post(import.meta.env.VITE_WENDA_URL + "/api/find_rtst_in_memory", {
      memory_name: docChatStore.doc_id,
      prompt: chatStore.inputMessage,
      step: 3,
    })
    .then(function (response) {
      //console.log(response.data);

      //从消息数组中删除所有role为ui的消息
      messageList.value = messageList.value.filter((i: any) => i.role != "ui");

      //如果已经终止发送
      if (chatStore.isAbort) {
        return;
      }
      //如果不是重试
      if (!isRetry) {
        //给机器人添加等待效果
        let messageAI = {
          messageId: nanoid(),
          role: "AI",
          content: "等待模型中...",
          time: sendtime,
          source: response.data,
          parentMessageId: parentMessageId,
        };

        let lastIndex = messageList.value.push(messageAI);
        lastMsg = messageList.value[lastIndex - 1];
      }

      //合并数据源并生成prompt
      chatStore.finallyPrompt = chatStore.promptTemplate
        .replace("{{问题}}", chatStore.inputMessage)
        .replace(
          "{{知识库}}",
          response.data.map((i: any) => i.content).join("\n")
        );
      //console.log(chatStore.finallyPrompt);
      chatStore.sendMessage(chatStore.finallyPrompt, (data: any) => {
        if (data != "{{successEnd}}") {
          lastMsg.content = data;
        } else {
          chatStore.inputMessage = "";
          chatStore.isSending = false;
        }
      });
    })
    .catch(function (error) {
      console.log(error);
      uiMsg.content = "检索数据失败";
    });
};
//删除消息
const deleteMessage = (messageId: string) => {
  //当前未在发送状态才能删除
  if (chatStore.isSending) {
    ElMessage.warning("当前正在发送消息，无法删除");
    return;
  }
  messageList.value = messageList.value.filter(
    (i: any) => i.messageId != messageId
  );
};

//收到消息自动滚动到底部
const chatScroll = ref(null);
const chatInner = ref(null);
onMounted(() => {
  setInterval(() => {
    if (chatStore.isSending) {
      chatScroll.value.setScrollTop(chatInner.value.scrollHeight);
    }
  }, 100);
});
//获取消息在不同状态下的背景颜色
const getMsgBackColor = (role: string) => {
  if (role == "user") {
    return isDark.value ? "#303133" : "#e4f5fc";
  } else {
    return isDark.value ? "#202020" : "#f2f6fc";
  }
};
//跳转到数据来源
const jumpToSource = (content: any) => {
  content = content.title;
};
//获取数据来源的相关信息
const getSorceInfo = (content: any, type: string) => {
  if (type == "title" || type == "url") {
    content = content.title;
    if (content.indexOf("](http") != -1) {
      const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/;
      const matches = content.match(regex);

      if (matches) {
        const title = matches[1]; // 获取标题
        const url = matches[2]; // 获取 URL
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
//自动复制上条发送的消息内容到编辑框
const copyLastMessage = () => {
  //当前未在发送状态才能复制
  if (chatStore.isSending) {
    ElMessage.warning("当前正在发送消息，无法操作");
    return;
  }
  try {
    //取到上条用户发送的消息内容
    let lastMsgContent = messageList.value
      .filter((i: any) => i.role == "user")
      .pop().content;
    //复制到编辑框
    chatStore.inputMessage = lastMsgContent;
  } catch (error) {
    ElMessage.warning("没有取到上条消息！");
  }
};

//const { circleUrl, squareUrl, sizeList } = toRefs(state);
</script>

<template>
  <el-scrollbar
    style="padding: 0px 10px 0px 0px; height: calc(100vh - 200px)"
    ref="chatScroll"
  >
    <div ref="chatInner">
      <!-- 聊天内容 -->
      <transition
        name="el-zoom-in-top"
        v-for="message in docChatStore.messageList"
        :key="message.messageId"
      >
        <div
          style="display: flex; width: 100%; margin-bottom: 10px"
          :style="{
            justifyContent: message.role == 'user' ? 'flex-end' : 'flex-start',
          }"
        >
          <!-- 系统提示消息 -->
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
          <el-popover
            placement="top"
            :width="200"
            trigger="hover"
            :popper-style="{
              padding: '3px',
              width: 'auto',
            }"
          >
            <div
              style="width: 100%; display: flex; justify-content: space-around"
            >
              <el-button
                size="small"
                type="danger"
                plain
                @click="deleteMessage(message.messageId)"
                >删除</el-button
              >
              <el-button
                size="small"
                type="primary"
                plain
                @click="copy(message.content)"
                >复制</el-button
              >
              <el-button
                size="small"
                type="warning"
                plain
                v-if="message.role == 'user'"
                @click="retryMessage(message.messageId)"
                >重试</el-button
              >
            </div>
            <template #reference>
              <div style="display: flex" v-if="message.role != 'ui'">
                <div v-if="message.role == 'AI'" style="margin-right: 10px">
                  <img
                    :src="imgAi"
                    alt=""
                    style="width: 25px; mix-blend-mode: multiply"
                    :style="{
                      filter: isDark ? 'invert(1)' : 'invert(0)',
                    }"
                  />
                </div>
                <el-card
                  shadow="hover"
                  style="padding: 0px !important"
                  :style="{
                    backgroundColor: getMsgBackColor(message.role),
                    maxWidth: isMobile
                      ? 'calc(100vw - 100px)'
                      : 'calc((100vw - 100px) / 2)',
                  }"
                  :body-style="{
                    padding: '5px',
                  }"
                  @mouseover=""
                >
                  <v-md-preview
                    :text="message.content"
                    style="background-color: transparent"
                  ></v-md-preview>
                  <div
                    style="
                      width: 100%;
                      display: flex;
                      justify-content: flex-start;
                      flex-wrap: wrap;
                    "
                  >
                    <el-popover
                      v-for="source in message.source"
                      placement="top-start"
                      :title="`数据来源:${getSorceInfo(source, 'title')}`"
                      :width="500"
                      trigger="hover"
                      :content="getSorceInfo(source, 'content')"
                    >
                      <template #reference>
                        <el-tag
                          style="margin: 5px; cursor: pointer"
                          @click="jumpToSource(source)"
                          :style="{
                            cursor:
                              source.title.indexOf(`](http`) != -1
                                ? 'pointer'
                                : 'default',
                          }"
                        >
                          <el-text
                            style="max-width: 130px"
                            truncated
                            :style="{
                              textDecoration:
                                source.title.indexOf(`](http`) != -1
                                  ? 'underline'
                                  : 'none',
                            }"
                            >{{ getSorceInfo(source, "title") }}</el-text
                          >
                        </el-tag>
                      </template>
                    </el-popover>
                  </div>
                </el-card>
              </div>
            </template>
          </el-popover>
        </div>
      </transition>
    </div>
  </el-scrollbar>
  <div
    style="position: fixed; bottom: 10px"
    :style="{ width: showSide ? 'calc(30% - 40px)' : 'calc(100% - 40px)' }"
  >
    <el-input
      :rows="4"
      type="textarea"
      v-model="chatStore.inputMessage"
      placeholder="请输入内容。方向上键传入上次消息。Ctrl+Enter直接发送"
      resize="none"
      input-style="padding-right: 120px"
      @keyup.up="copyLastMessage()"
      @keyup.ctrl.enter="sendMessage()"
      :disabled="chatStore.isSending"
    >
    </el-input>
    <el-button
      round
      :color="chatStore.isSending ? '#ef534f' : '#79b7d1'"
      :dark="isDark"
      plain
      style="position: absolute; right: 10px; top: 30px"
      @click="sendMessage()"
    >
      {{ chatStore.isSending ? "终止" : "发送" }}
    </el-button>
  </div>
</template>

<style></style>
