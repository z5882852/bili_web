<template>
    <VideoInfo :data="info" />
    <el-divider />
    <UserInfo :mid="mid" />
</template>

<script>
import { defineComponent, watch, ref, onMounted  } from 'vue';
import VideoInfo from '@/components/VideoInfo.vue';
import UserInfo from '@/components/UserInfo.vue';

export default defineComponent({
    components: {
        VideoInfo,
        UserInfo,
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        page: {
            type: Number,
        },
    },
    setup(props) {
        const videoData = ref({});
        const mid = ref("")

        
        const loadData = () => {
            var dat = props.data
            dat['page'] = dat.pages[props.page - 1]
            videoData.value = Object.assign({}, dat)
            mid.value = dat.owner.mid + ""
        }
        
        onMounted(() => {
            if (props.page !== 0) {
                loadData();
            }
        })

        watch(
            () => props.data,
            () => {
                if (props.page !== 0) {
                    loadData();
                }
            }
        );
        

        return {
            info: videoData,
            mid,
        }
    }

})

</script>

<style scoped>
.el-descriptions {
    margin-top: 20px;
}

.cell-item {
    display: flex;
    align-items: center;
}

.margin-top {
    margin-top: 20px;
}
</style>
