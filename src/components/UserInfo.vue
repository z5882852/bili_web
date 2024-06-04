<template>
  <el-row v-loading="isLoading">
    <el-col :span="6">
      <img
        class="uesr-pic"
        :src="'data:image/jpeg;base64,' + info.face_base64"
        alt="用户头像显示错误"
      />
    </el-col>
    <el-col :span="18">
      <el-descriptions
        class="margin-top"
        title="作者信息"
        :column="2"
        size="large"
        border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Tickets />
              </el-icon>
              用户名
            </div>
          </template>
          {{ info.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Tickets />
              </el-icon>
              性别
            </div>
          </template>
          {{ info.sex }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Timer />
              </el-icon>
              主页签名
            </div>
          </template>
          {{ info.sign }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Timer />
              </el-icon>
              等级
            </div>
          </template>
          {{ info.level }}
        </el-descriptions-item>
      </el-descriptions>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";
import { ElMessage } from 'element-plus'


export default defineComponent({
  components: {},
  props: {
    mid: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isLoading = ref(true)
    const userInfo = ref({
      name: "",
      sex: "",
      sign: "",
      level: 0,
    });
    const loadData = () => {
        var mid = props.mid + ""
        isLoading.value = true;
        window.$axios.get("/api/v1/video/user/info", {
                params: {
                    mid: mid
                }
            }).then(response => {
                let data = response.data.data;
                if (response.data.code === 200) {
                    userInfo.value = data;
                    isLoading.value = false;

                } else {
                    isLoading.value = false;
                    ElMessage({
                        type: "error",
                        message: response.data.msg,
                    });
                }
            })
                .catch(error => {
                    isLoading.value = false;
                    ElMessage({
                        type: "error",
                        message: "获取用户信息失败",
                    });
                    console.log(error);
                });
    }
    onMounted(() => {
      // loadData();
    })

    watch(
      () => props.mid,
      () => {
        loadData();
      }
    );

    return {
      info: userInfo,
      isLoading,
    };
  },
});
</script>

<style scoped>
.uesr-pic {
  max-width: 100%;
  max-height: 200px;
  border-radius: 100%;
}
</style>
