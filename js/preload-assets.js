async function preloadAssets() {
  // 简化日志输出函数
  const log = console.log;
  const error = console.warn;

  try {
    // 异步获取资源清单JSON文件
    const res = await fetch('js/asset-list.json');
    // 解析JSON为JavaScript对象
    const data = await res.json();

    // 按顺序遍历资源列表，逐个预加载
    for (const url of data.assets) {
      try {
        // 发起请求，no-cors模式避免跨域报错，但限制多
        await fetch(url, { mode: 'no-cors' });
        // 请求成功，打印日志
        log(`✅ 资源预加载成功：${url}`);
      } catch (e) {
        // 请求失败，打印警告日志
        error(`⚠️ 资源预加载失败：${url}`, e);
      }
    }
  } catch (e) {
    // 如果资源清单加载失败，打印错误日志
    error("❌ 资源清单加载失败", e);
  }
}

// 浏览器空闲时执行预加载，减少性能影响
if (window.requestIdleCallback) {
  requestIdleCallback(preloadAssets);
} else {
  // 不支持的浏览器用延时代替
  setTimeout(preloadAssets, 3000);
}