# bili_web

> B站视频反馈优化系统（前端）

### v1.0.1

## 关于项目

### 介绍

本项目为前后端分离项目，本项目为前端。

功能:
- 用户鉴权
- 解析视频信息
- 获取用户信息
- 分析弹幕数据并可视化显示
- 文心一言根据弹幕反馈提供优化建议

[后端地址](https://github.com/z5882852/bili_server)

### 技术栈

- vue3
- axios
- element-plus
- echarts

## 如何使用

### 安装Node.js

**建议安装最新版本**

### 安装依赖
```
npm install
```

### 设置后端地址

在`src/main.js`中修改`window.$baseURL`的值
```js
window.$baseURL = 'http://localhost:8089'
window.$axios = axios.create({
    //设置超时时间
    timeout: 8000,
    baseURL: window.$baseURL,
});

```

### 启动服务
```
npm run serve
```

### 构建项目
```
npm run build
```

## 参考

[哔哩哔哩-API收集整理 | bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

[bilidown-web | Zhouqluo/bilidown-web](https://github.com/Zhouqluo/bilidown-web)

