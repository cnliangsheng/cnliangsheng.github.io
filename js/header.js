// 等待 DOM 加载完成后再执行主逻辑
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------- Header 滚动隐藏逻辑 --------------------- */

  const header = document.querySelector('header'); // 获取 header 元素
  const threshold = 100; // 滚动触发的初距离

  // 节流锁，避免过度触发
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;

  // 初始化 header 显示状态
  header.classList.add('show');
  header.classList.remove('hide');

  // 滚动处理函数（节流版）
  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > threshold) {
      // 向下滚动且超过阈值，隐藏 header
      header.classList.add('hide');
      header.classList.remove('show');
    } else if (scrollTop < lastScrollTop) {
      // 向上滚动，显示 header
      header.classList.add('show');
      header.classList.remove('hide');
    }

    lastScrollTop = Math.max(scrollTop, 0); // 防止负值
    ticking = false; // 解锁下一帧
  }

  // 使用 requestAnimationFrame 优化 scroll 监听
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true; // 加锁
    }
  });

  /* --------------------- 禁止图片/视频交互行为 --------------------- */

  const mediaElements = document.querySelectorAll("img, video"); // 获取图片和视频元素

  mediaElements.forEach(el => {
    // 【属性级】HTML 层禁用拖拽行为
    el.setAttribute("draggable", "false"); // 彻底禁止元素被拖动（多数现代浏览器支持）

    // 【样式级】CSS 禁止选中行为（防止双击/拖动选区）
    el.style.userSelect = "none"; // 标准写法，适用于现代浏览器
    el.style.webkitUserSelect = "none"; // Chrome / Safari 专用
    el.style.mozUserSelect = "none"; // Firefox 专用
    el.style.msUserSelect = "none"; // IE / Edge 专用

    // 【样式级】彻底禁用点击、右键、拖拽、悬停等所有指针交互
    el.style.pointerEvents = "none"; // 完全不可交互（包括点击）

    // 【事件级】禁止右键菜单
    el.addEventListener("contextmenu", e => e.preventDefault());

    // 【事件级】禁止鼠标拖拽（即使 setAttribute 被忽略也能拦截）
    el.addEventListener("dragstart", e => e.preventDefault());
  });

});