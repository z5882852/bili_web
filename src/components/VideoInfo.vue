<template>
  <el-row>
    <el-col :span="8">
      <img
        class="video-pic"
        :src="'data:image/jpeg;base64,' + info.pic_base64"
        alt="视频封面显示错误"
      />
    </el-col>
    <el-col :span="16">
      <el-descriptions
        class="margin-top"
        title="视频信息"
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
              视频标题
            </div>
          </template>
          {{ info.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Tickets />
              </el-icon>
              副标题
            </div>
          </template>
          {{ info.page.part }}
        </el-descriptions-item>
        <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Timer />
          </el-icon>
          发布时间
        </div>
      </template>
      {{ info.pubdate_format }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Timer />
          </el-icon>
          视频时长
        </div>
      </template>
      {{ info.page.duration_format }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <user />
          </el-icon>
          作者
        </div>
      </template>
      {{ info.owner.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <CollectionTag />
          </el-icon>
          标签
        </div>
      </template>
      <el-tag size="default">{{ info.tname }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon>
            <Memo />
          </el-icon>
          视频简介
        </div>
      </template>
      {{ info.desc }}
    </el-descriptions-item>
      </el-descriptions>
    </el-col>
  </el-row>
  <el-descriptions class="margin-top" :column="2" size="large" border>
    
  </el-descriptions>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";

// 将秒数转换为 hh:mm:ss 格式
const formatSeconds = (value) => {
  let theTime = parseInt(value); // 秒
  let theTime1 = 0; // 分
  let theTime2 = 0; // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  let result = `${
    parseInt(theTime) < 10 ? "0" + parseInt(theTime) : parseInt(theTime)
  }`;
  if (theTime1 > 0) {
    result = `${
      parseInt(theTime1) < 10 ? "0" + parseInt(theTime1) : parseInt(theTime1)
    }:${result}`;
  }
  if (theTime2 > 0) {
    result = `${
      parseInt(theTime2) < 10 ? "0" + parseInt(theTime2) : parseInt(theTime2)
    }:${result}`;
  }
  return result;
};

const formatDate = (value) => {
  let date = new Date(value * 1000);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour1 = date.getHours();
  let minute1 = date.getMinutes();
  let second1 = date.getSeconds();
  let result = `${year}-${month}-${day} ${hour1}:${minute1}:${second1}`;
  return result;
};

export default defineComponent({
  components: {},
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const videoInfo = ref({
      title: "",
      page: {
        part: "",
        duration: "",
      },
      pubdate: "",
      tname: "",
      desc: "",
      owner: {
        name: "",
      },
    });
    const loadData = () => {
      var dat = Object.assign({}, props.data);
      dat.page.duration_format = formatSeconds(dat.page.duration);
      dat.pubdate_format = formatDate(dat.pubdate);
      videoInfo.value = Object.assign({}, dat);
    };
    onMounted(() => {
      // loadData();
    })

    watch(
      () => props.data,
      () => {
        loadData();
      }
    );

    return {
      info: videoInfo,
    };
  },
});
</script>

<style scoped>
.video-pic {
  max-width: 100%;
  max-height: 300px;
}

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
