<template>
    <div class="chatpage-container">
        <el-header v-loading="chating" class="console-container">
            <el-row>
                <el-col :span="12">tokens: {{ tokens }}</el-col>
                <el-col :span="12" style="text-align: right"><el-button type="primary"
                        @click="handleChat">获取</el-button></el-col>
            </el-row>
        </el-header>
        <el-main v-loading="showLoading">
            <div v-html="markdownToHtml" class="markdown-body"></div>
            <el-empty v-if="markdownToHtml == ''" description="请点击获取建议" image="./ERNIE.png" />
        </el-main>
        <el-footer v-if="!chating && markdownToHtml != ''" class="footer-container">
            <span>内容由ERNIE-4.0-8K-0104大模型生成，无法确保真实准确，仅供参考</span>
        </el-footer>
    </div>
</template>

<script>
import { defineComponent, watch } from "vue";
import { ElMessage } from "element-plus";
import { marked } from "marked";
import { ref, shallowRef } from "vue";

export default defineComponent({
    components: {},
    props: {
        data: {
            type: Object,
            required: true,
        },
        page: {
            type: Number,
        },
    },
    setup(props) {
        marked.setOptions({
            renderer: new marked.Renderer(), // 这是必填项
            gfm: true, // 启动类似于Github样式的Markdown语法
            pedantic: false, // 只解析符合Markdwon定义的，不修正Markdown的错误
            sanitize: false, // 原始输出，忽略HTML标签（关闭后，可直接渲染HTML标签）
        });
        const markdownToHtml = shallowRef("");
        const tokens = ref(0);
        const showLoading = ref(false);
        const chating = ref(false);

        const change = (value) => {
            markdownToHtml.value = marked(value);
        };

        const getChat = async (cid) => {
            try {
                markdownToHtml.value = "";
                showLoading.value = true;
                chating.value = true;
                tokens.value = 0;
                const res = await fetch(
                    `${window.$baseURL}/api/v1/video/optimization?cid=${cid}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("access_token"),
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (res.status === 401) {
                    ElMessage({
                        type: "error",
                        message: "请登录",
                    });
                    chating.value = false;
                    showLoading.value = false;
                    return
                } else if (res.status !== 200) {
                    ElMessage({
                        type: "error",
                        message: "获取优化建议失败",
                    });
                    chating.value = false;
                    showLoading.value = false;
                    return
                }
                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                var result = "";
                while (cid) {
                    // 读取数据流的第一块数据，done表示数据流是否完成，value表示当前的数
                    const { done, value } = await reader.read();
                    showLoading.value = false;
                    if (done) break;
                    const text = decoder.decode(value);
                    let data = JSON.parse(text);
                    if (data.error) {
                        change(data.message);
                        ElMessage({
                            type: "error",
                            message: "获取优化建议失败",
                        });
                        break;
                    }
                    result += data.result;
                    change(result);
                    tokens.value = data.usage.total_tokens;
                }
                chating.value = false;
            } catch (error) {
                ElMessage({
                    type: "error",
                    message: "获取优化建议失败",
                });
                console.log(error);
                chating.value = false;
                showLoading.value = false;
            }
        };

        watch(
            () => props.data,
            () => {
                if (props.data !== 0) {
                    markdownToHtml.value = "";
                    tokens.value = 0;
                }
            }
        );

        const handleChat = () => {
            if (
                props.data &&
                props.data.pages &&
                props.data.pages[props.page - 1] &&
                props.data.pages[props.page - 1].cid
            ) {
                var cid = props.data.pages[props.page - 1].cid;
                getChat(cid);
            } else {
                ElMessage({
                    type: "error",
                    message: "获取优化建议失败, 无法获取视频cid",
                });
            }
        };

        return {
            handleChat,
            markdownToHtml,
            showLoading,
            chating,
            tokens,
        };
    },
});
</script>

<style>
.chatpage-container {
    width: 60%;
    min-width: 400px;
    height: 100%;
    margin: 0 auto;
}

.markdown-body {
    text-align: left;
}

.console-container {
    text-align: left;
    /* border-bottom: 0.5px solid #aaa; */
}

.footer-container {
    margin-top: 10px;
    font-size: 12px;
}
</style>
