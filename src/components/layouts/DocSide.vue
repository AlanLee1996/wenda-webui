<template>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="false"
    @open="handleOpen"
    @close="handleClose"
    :style="{ backgroundColor: isDark ? '#000' : '#e4f5fc' }"
  >
    <div style="padding: 10px 0px 10px 40px; width: 300px">
      <div style="display: flex; justify-content: flex-start">
        <el-text style="font-size: 20px; font-weight: bolder">
          文档预览
        </el-text>
      </div>
    </div>

    <!-- 移动端菜单展开才会显示按钮 -->
    <div
      @click="toggleSide()"
      style="width: 60px; position: absolute; top: 0px; right: 0px"
      v-if="isMobile && showSide"
    >
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height); padding-top: 8px"
      >
        <i inline-flex i="ep-close" v-if="showSide" />
        <i inline-flex i="ep-operation" v-if="!showSide" />
      </button>
    </div>

    <el-scrollbar
      style="padding: 0px 20px 10px 20px; height: calc(100% - 120px)"
    >
      <el-empty description="请先选择文档" v-if="!fileSrc" />
      <vue-office-docx
        :src="fileSrc"
        v-if="fileTail == 'docx'"
        @rendered="docxRendered"
      />
      <PDFViewer
        :src="fileSrc"
        v-if="fileTail == 'pdf'"
        :key="fileSrc"
      ></PDFViewer>
    </el-scrollbar>
    <div>
      <el-text style="font-size: 12px; opacity: 0.5">
        上传文档支持pdf、docx。其他格式请使用粘贴文本。
      </el-text>
    </div>
    <!-- 隐藏的文件上传 -->
    <input
      ref="fileInput"
      style="display: none"
      type="file"
      @change="changeHandle"
      accept=".docx,.pdf"
    />
    <div
      style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 100%;
      "
    >
      <div style="margin-bottom: 5px">
        <el-button @click="selectFile()" style="margin-right: 0px"
          >上传文档</el-button
        >
        <el-button @click="copyTxt()" style="margin-right: 10px"
          >粘贴文本</el-button
        >
        <el-button
          @click="chatDocument = false"
          style="margin: 0"
          color="#ef534f"
          :dark="isDark"
          plain
          >关闭文档对话</el-button
        >
      </div>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
import { ElMessage, ElNotification } from "element-plus";
//文档预览插件
import VueOfficeDocx from "@vue-office/docx";
import "@vue-office/docx/lib/index.css";
//pdf
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import * as PdfJs from "pdfjs-dist/legacy/build/pdf.js"; // 注意导入的写法

import { ref, watch, getCurrentInstance } from "vue";
const currentInstance = getCurrentInstance();

import { storeToRefs } from "pinia";
import { useChatStore } from "~/store/chat";
import { useDocChatStore } from "~/store/docChat";
import { useDark, useToggle } from "@vueuse/core";
import { relative } from "path";
import { nanoid } from "nanoid";

import { useAppStore } from "~/store/app";
let appStore = useAppStore();
const { showSide, isMobile, chatDocument } = storeToRefs(appStore);

const isDark = useDark();

const isCollapse = ref(true);
const title = ref(import.meta.env.VITE_APP_TITLE);
const subtitle = ref(import.meta.env.VITE_APP_SUBTITLE);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
let chatStore = useChatStore();
let docChatStore = useDocChatStore();
const { messageList } = storeToRefs(docChatStore);
const toggleSide = () => {
  console.log(appStore.showSide);

  appStore.showSide = !appStore.showSide;
};
//文件选择
const selectFile = () => {
  const fileInput = currentInstance.refs.fileInput as HTMLInputElement;
  //点击
  fileInput.click();
};
//粘贴文本
const copyTxt = () => {
  ElMessage.error("暂不支持粘贴文本，请等待版本更新！");
};
//文件选择后的回调
const fileSrc = ref("");
const fileTail = ref("");
const changeHandle = (event: any) => {
  if (event.target.files.length == 0) {
    return;
  } else {
    //清空文件
    fileSrc.value = "";
    fileTail.value = "";
    //console.log(fileSrc.value, fileTail.value);
  }
  let file = event.target.files[0];
  fileTail.value = getTail(file.name);
  let fileReader = new FileReader();
  //console.log(fileTail.value);
  switch (fileTail.value) {
    case "docx":
      console.log("开始处理word");
      appStore.loading = true;
      appStore.loadingText = "正在提取word内容";
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = () => {
        fileSrc.value = fileReader.result;
      };
      break;
    case "pdf":
      console.log("开始处理pdf");
      appStore.loading = true;
      appStore.loadingText = "正在提取pdf内容";
      fileSrc.value = URL.createObjectURL(file);
      getPdfContent();
      break;
    default:
      ElMessage.error("不支持的文件格式,请使用粘贴文本！");
      return;
  }

  messageList.value = [
    {
      messageId: "123123",
      role: "AI",
      content:
        "你好，请上传文档，然后和我对话。我可以帮您总结文档，您也可以询问我文档中的信息！",
      time: "2023-01-02 12:00:00",
    },
  ];
};
//获取文件后缀
const getTail = (dataName: string) => {
  let arr = dataName.split("."); //通过\分隔字符串，成字符串数组
  return arr[arr.length - 1].trim().toLowerCase(); //取最后一个，就是文件扩展名
};
//文档uuid
const fileId = ref("");
//docx渲染完成后的回调
const docxRendered = async () => {
  console.log("docx渲染完成");
  fileId.value = nanoid();
  docChatStore.doc_id = fileId.value;

  let elArr = document.getElementsByClassName("docx");
  for (let i = 0; i < elArr.length; i++) {
    let element = elArr[i];

    let text = element.textContent;
    //console.log(text);
    await chatStore
      .uploadToRtst(fileId.value, `第${i + 1}页`, text)
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
    appStore.loadingText = `正在处理第 ${i + 1} / ${elArr.length} 页`;
  }
  appStore.loading = false;
};
//提取pdf内容
const getPdfContent = () => {
  fileId.value = nanoid();
  docChatStore.doc_id = fileId.value;
  console.log("开始提取pdf内容");
  let loadingTask = PdfJs.getDocument(fileSrc.value);
  loadingTask.promise.then((pdf: PDFDocumentProxy) => {
    let successPage = 0;
    for (let i = 1; i <= pdf.numPages; i++) {
      pdf.getPage(i).then((page: any) => {
        page.getTextContent().then(async (textContent: any) => {
          let pdfContent = "";
          textContent.items.forEach((textItem: any) => {
            pdfContent += textItem.str;
          });
          //console.log(i, pdfContent);
          chatStore
            .uploadToRtst(fileId.value, `第${i}页`, pdfContent)
            .then(function (data) {
              console.log(data);
              successPage++;
              appStore.loadingText = `正在处理第 ${successPage} / ${pdf.numPages} 页`;
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      });
    }
    //等待所有页上传完成
    let timer = setInterval(() => {
      if (successPage == pdf.numPages) {
        clearInterval(timer);
        appStore.loading = false;
      }
    }, 1000);
  });
};
</script>
<style lang="css">
.docx-wrapper {
  padding: 10px !important;
  background-color: transparent !important;
}
.docx {
  margin-bottom: 20px !important;
}
</style>
