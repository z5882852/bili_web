<template>
    <div class="dm-container">
        <div class="table-container card ">
            <el-auto-resizer>
                <template #default="{ height, width }">
                    <el-table-v2 :columns="columns" :data="dmData" :width="width" :height="height" fixed />
                </template>
            </el-auto-resizer>
        </div>
        <div class="chart-container">
            <div id="wordcloud" class="chart-box card"></div>
            <div id="timecount" class="chart-box card"></div>
            <div id="sentimentcount" class="chart-box card"></div>
            <div id="weightcount" class="chart-box card"></div>
        </div>
    </div>
</template>
<script>
import { defineComponent, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts'
import 'echarts-wordcloud'


export default defineComponent({
    components: {},
    props: {
        data: {
            type: Object,
        }
    },
    setup(props) {
        const columns = [
            {
                key: 'weight',
                dataKey: 'weight',
                title: '权重',
                width: 50
            },
            {
                key: 'content',
                dataKey: 'content',
                title: '弹幕内容',
                width: 300
            }
        ]
        const dmData = ref([])

        let wordcloud = null
        let timeCount = null
        let sentimentCount = null
        let weightCount = null
        const init = () => {
            initWordCloud();
            initTimeCount();
            initSentimentCount();
            initWeightCount();
        }
        const initWordCloud = () => {
            document.getElementById('wordcloud').setAttribute('_echarts_instance_', '')
            let containerDom = document.getElementsByClassName('chart-container')[0]
            wordcloud = echarts.init(document.getElementById('wordcloud'), null, {
                width: containerDom.clientWidth  / 2
            })

            let option = {
                title: {
                    text: "词云图",
                    padding: 10
                },
                series: [
                    {
                        type: 'wordCloud',
                        shape: 'circle',

                        width: "100%",
                        height: "100%",

                        textStyle: {
                            fontFamily: 'sans-serif',
                            fontWeight: 'bold',
                            // Color可以是回调函数或颜色字符串
                            color: function () {
                                // 任意颜色
                                return (
                                    'rgb(' +
                                    [
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                    ].join(',') +
                                    ')'
                                )
                            },
                        },
                        emphasis: {
                            focus: 'self',
                            textStyle: {
                                textShadowBlur: 10,
                                textShadowColor: '#333',
                            },
                        },
                        data: []
                    },
                ],
            }
            wordcloud.setOption(option)
        }
        const initTimeCount = () => {
            document.getElementById('timecount').setAttribute('_echarts_instance_', '')
            let containerDom = document.getElementsByClassName('chart-container')[0]
            timeCount = echarts.init(document.getElementById('timecount'), null, {
                width: containerDom.clientWidth  / 2 - 50
            })
            let option = {
                title: {
                    text: "时间分布",
                    padding: 10
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        areaStyle: {}
                    }
                ],
            };
            
            timeCount.setOption(option)
        }
        const initSentimentCount = () => {
            document.getElementById('sentimentcount').setAttribute('_echarts_instance_', '')
            let containerDom = document.getElementsByClassName('chart-container')[0]
            sentimentCount = echarts.init(document.getElementById('sentimentcount'), null, {
                width: containerDom.clientWidth  / 2 - 50
            })
            let option = {
                title: {
                    text: "情感分布",
                    padding: 10
                },
                yAxis: {
                    type: 'category',
                    data: ['正向', '负向']
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                series: [
                    {
                        data: [0, 0],
                        type: 'bar',
                        areaStyle: {}
                    }
                ],
            };
            
            sentimentCount.setOption(option)
        }
        const initWeightCount = () => {
            document.getElementById('weightcount').setAttribute('_echarts_instance_', '')
            let containerDom = document.getElementsByClassName('chart-container')[0]
            weightCount = echarts.init(document.getElementById('weightcount'), null, {
                width: containerDom.clientWidth  / 2 - 50
            })
            let option = {
                title: {
                    text: "权重分布",
                    padding: 10
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'bar',
                    }
                ],
            };
            
            weightCount.setOption(option)
        }
        const update = (data) => {
            dmData.value = data.dm_list
            wordcloud.setOption({
                series: [{
                    data: data.word_count
                }]
            })
            wordcloud.resize()

            timeCount.setOption({
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.time_count.map(item => item.name)
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: data.time_count.map(item => item.value),
                        type: 'line',
                        areaStyle: {}
                    }
                ],
            })
            timeCount.resize()

            sentimentCount.setOption({
                series: [
                    {
                        data: [data.sentiment_count.positive, data.sentiment_count.negative],
                        type: 'bar',
                        areaStyle: {}
                    }
                ],
            })
            sentimentCount.resize()

            if (data.dm_list.length === 0) {
                return
            }
            let weightCountData = {}
            for (let i=0; i<data.dm_list.length; i++) {
                let weight = data.dm_list[i].weight
                if (weightCountData[weight] === undefined) {
                    weightCountData[weight] = 0
                }
                weightCountData[weight]++
            }
            let x_list = []
            let y_list = []
            for(let key in weightCountData){
                x_list.push(key)
                y_list.push(weightCountData[key])
            }
            weightCount.setOption({
                xAxis: {
                    type: 'category',
                    data: x_list
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: y_list,
                        type: 'bar',
                    }
                ],
            })
            weightCount.resize()
        }

        onMounted(() => {
        });

        watch(
            () => props.data,
            () => {
                if (props.data) {
                    init();
                    update(props.data)
                }
            }
        );



        return {
            columns,
            dmData,
        }
    }

})

</script>

<style>
:root {
    --my-cool-background: #73a4f4;
}

.dm-container {
    width: 100%;
    height: 100%;
    display: flex;
}

.chart-container {
    width: 60%;
    height: 300px;
    display: flex;
    flex-wrap: wrap;
}

.table-container {
    width: 40%;
    height: 700px;
}

.chart-box {
    margin-left: 3%;
    margin-bottom: 50px;
    width: 45%;
    height: 300px;
}

.card {
    /* 添加阴影以创建 "card" 效果 */
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
}

/* 鼠标悬停时，添加更深的阴影 */
.card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.card-title {
    position: fixed;
    z-index: 100;
}
</style>
