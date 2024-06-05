<template>
    <el-main v-loading="showLoading" element-loading-text="加载中...">
        <el-row>
            <el-col :span="12">
                <el-statistic title="弹幕数量" :value="dm.dm_list.length" />
            </el-col>
            <el-col :span="12">
                <el-statistic title="平均权重" :value="Math.floor(dm.avg_weight * 100) / 100" :precision=2 />
            </el-col>
        </el-row>
        <el-divider />
        <DmChart :data="dm"></DmChart>
    </el-main>
</template>
<script>
import { defineComponent, watch, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import DmChart from '@/components/DmChart.vue';


export default defineComponent({
    components: {
        DmChart
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        page: {
            type: Number,
        },
        tap: {
            type: Number
        }
    },
    setup(props) {
        const dm = ref({
            dm_list: [],
            time_count: [],
            word_count: [],
            sentiment_count: { positive: 0, negative: 0 }
        })
        const tempData = ref({})
        const showLoading = ref(false)

        const analyseDm = (cid) => {
            showLoading.value = true;
            window.$axios.get("/api/v1/video/dm/analyse", {
                timeout: 16000,
                params: {
                    cid: cid
                },
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access_token")
                }
            }).then(response => {
                let data = response.data.data;
                if (response.data.code === 200) {
                    dm.value = Object.assign({}, data)
                } else {
                    ElMessage({
                        type: "error",
                        message: response.data.message,
                    });
                }
                showLoading.value = false;

            })
                .catch(error => {
                    showLoading.value = false;
                    if (error.response && error.response.status == "401") {
                        ElMessage({
                            type: "error",
                            message: "请先登录",
                        });
                    } else {
                        ElMessage({
                            type: "error",
                            message: "分析失败，请联系客服",
                        });
                    }
                    console.log(error);
                });

        }

        const handleAnalyseDm = () => {
            if (
                props.data &&
                props.data.pages &&
                props.data.pages[props.page - 1] &&
                props.data.pages[props.page - 1].cid
            ) {
                var cid = props.data.pages[props.page - 1].cid;
                analyseDm(cid);
            } else {
                ElMessage({
                    type: "error",
                    message: "获取优化建议失败, 无法获取视频cid",
                });
            }
        }

        onMounted(() => {
            if (props.tap == 2) {
                handleAnalyseDm();
            }
        })

        watch(
            () => props.tap,
            () => {
                if (props.page !== 0 && tempData.value !== props.data) {
                    tempData.value = props.data
                    handleAnalyseDm()
                }
            }
        );

        return {
            dm,
            showLoading
        }
    }

})


</script>