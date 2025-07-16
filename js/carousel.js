// 等待 DOM 加载完成后执行主逻辑
document.addEventListener("DOMContentLoaded", () => {

  // 获取所有轮播组件
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {
    // 获取轮播内部结构
    const wrapper = carousel.querySelector(".carousel-wrapper"); // 滑动轨道
    const slides = wrapper.querySelectorAll(".carousel-slide"); // 幻灯片数组
    const leftBtn = carousel.querySelector(".carousel-arrow.left"); // 左按钮
    const rightBtn = carousel.querySelector(".carousel-arrow.right"); // 右按钮
    const dotsContainer = carousel.querySelector(".carousel-dots"); // 导航点容器
    const videos = carousel.querySelectorAll("video"); // 所有视频元素

    const totalSlides = slides.length; // 总幻灯片数
    let currentIndex = 0; // 当前索引
    let inViewport = false; // 是否在视口中

    // ---------------- 视频播放控制 ----------------

    // 播放视频一次并在最后一帧停住
    function playVideoOnce(video) {
      video.currentTime = 0;
      video.loop = false;
      video.play().catch(() => { });
      video.onended = () => {
        video.pause();
        video.currentTime = video.duration;
      };
    }

    // ---------------- 初始化结构与状态 ----------------

    // 设置滑动容器宽度（根据幻灯片数量）
    wrapper.style.width = `calc(100vw * ${totalSlides})`;

    // 生成导航圆点
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll("button");

    // ---------------- 更新轮播状态函数 ----------------

    function updateCarousel() {
      // 滑动位置
      wrapper.style.transform = `translateX(-${currentIndex * 100}vw)`;

      // 幻灯片与圆点高亮
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentIndex);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });

      // 左右按钮状态更新
      leftBtn.classList.toggle("disabled", currentIndex === 0);
      rightBtn.classList.toggle("disabled", currentIndex === totalSlides - 1);

      // 暂停非当前视频
      slides.forEach((slide, i) => {
        const video = slide.querySelector("video");
        if (video && i !== currentIndex) {
          video.pause();
          video.currentTime = 0;
          video.onended = null;
        }
      });
    }

    // 初次显示初始化
    updateCarousel();

    // ---------------- 按钮切换事件 ----------------

    // 左箭头：向前切换
    leftBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
        if (inViewport) {
          const currentVideo = slides[currentIndex].querySelector("video");
          if (currentVideo) playVideoOnce(currentVideo);
        }
      }
    });

    // 右箭头：向后切换
    rightBtn.addEventListener("click", () => {
      if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateCarousel();
        if (inViewport) {
          const currentVideo = slides[currentIndex].querySelector("video");
          if (currentVideo) playVideoOnce(currentVideo);
        }
      }
    });

    // ---------------- 视口监控：自动播放 ----------------

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        inViewport = entry.isIntersecting;

        if (inViewport) {
          const currentVideo = slides[currentIndex].querySelector("video");
          if (currentVideo) playVideoOnce(currentVideo);
        } else {
          videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
            video.onended = null;
          });
        }
      });
    }, { threshold: 0.1 });

    observer.observe(carousel);
  });

});
