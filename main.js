const navToggle = document.querySelector('.nav-toggle');
const navBar = document.querySelector('.nav-bar');
navToggle.addEventListener('click', () => {
  navBar.classList.toggle('open');
});
// ナビ内リンククリックで自動で閉じる
document.querySelectorAll('.nav-bar a').forEach(link => {
  link.addEventListener('click', () => {
    navBar.classList.remove('open');
  });
});




document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    simulateTouch: window.innerWidth <= 600, // 600px以下のみタッチ操作有効
    breakpoints: {
      600: {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        simulateTouch: false, // 600px超はタッチ操作無効
      }
    }
  });
});