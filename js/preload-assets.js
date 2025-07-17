// 异步函数，用于预加载资源（图片、视频、页面）
async function preloadAssets() {
  // 控制台输出日志
  const log = console.log;
  const error = console.warn;

  try {
    // 尝试加载资源清单（JSON 格式）
    const res = await fetch('js/asset-list.json');

    // 解析 JSON 内容，包含 pages、images、videos 三类数组
    const data = await res.json();

    // 将所有资源合并为一个数组，准备依次发起请求
    const allAssets = [...data.pages, ...data.images, ...data.videos];

    // 遍历每一个资源地址，使用 fetch 请求进行预加载
    allAssets.forEach(url => {
      fetch(url, { mode: 'no-cors' })  // 使用 no-cors 避免跨域错误（但限制较多）
        .then(() => log(`✅ 缓存成功：${url}`))  // 请求成功时记录
        .catch(err => error(`⚠️ 缓存失败：${url}`, err));  // 请求失败时警告
    });

  } catch (e) {
    // 如果资源清单本身加载失败，输出错误信息
    error("❌ 资源清单加载失败", e);
  }
}

// 当浏览器空闲时再执行预加载逻辑，避免影响页面主线程渲染
if (window.requestIdleCallback) {
  // 支持 requestIdleCallback 的浏览器使用它
  requestIdleCallback(preloadAssets);
} else {
  // 不支持的浏览器使用 setTimeout 延迟执行
  setTimeout(preloadAssets, 3000);
}