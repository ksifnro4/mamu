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
    slidesPerView: 1,      // 1枚半ぐらい見える感じに（調整可）
    centeredSlides: true,    // 現在のスライドを中央に配置

    spaceBetween: 20,

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    simulateTouch: true,

    breakpoints: {
      768: {
        slidesPerView: 1.3,
        spaceBetween: 30,
        centeredSlides: true,
      }
    }
  });

});
