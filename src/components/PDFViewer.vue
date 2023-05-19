<template>
  <VuePdf v-for="page in numOfPages" :key="page" :src="pdfSrc" :page="page" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from "vue";
import { VuePdf, createLoadingTask } from "vue3-pdfjs/esm";
import { VuePdfPropsType } from "vue3-pdfjs/components/vue-pdf/vue-pdf-props"; // Prop type definitions can also be imported
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { watch } from "vue";
export default defineComponent({
  name: "PDFViewer",
  components: { VuePdf },
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { src } = toRefs(props);
    const pdfSrc = ref<VuePdfPropsType["src"]>(src.value);
    const numOfPages = ref(0);

    onMounted(() => {
      let loadingTask = createLoadingTask(pdfSrc.value);
      loadingTask.promise.then((pdf: PDFDocumentProxy) => {
        numOfPages.value = pdf.numPages;
      });
    });
    // watch(
    //   () => props.src,
    //   (newVal) => {
    //     console.log(newVal);

    //     pdfSrc.value = newVal;
    //     let loadingTask = createLoadingTask(pdfSrc.value);
    //     loadingTask.promise.then((pdf: PDFDocumentProxy) => {
    //       numOfPages.value = pdf.numPages;
    //     });
    //   }
    // );
    return {
      pdfSrc,
      numOfPages,
    };
  },
});
</script>
