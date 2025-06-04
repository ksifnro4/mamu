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



document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.hero-img-row');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const imgs = entry.target.querySelectorAll('.hero-img');
          imgs.forEach((img, i) => {
            setTimeout(() => {
              img.classList.add('is-visible');
            }, i * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  rows.forEach(row => observer.observe(row));
});




document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.fadein-left, .fadein-right');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    }
  );
  targets.forEach(el => observer.observe(el));
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



document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.plan-summary-card');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px 0px 0px'
    }
  );
  targets.forEach(el => observer.observe(el));
});


document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.calendar-container');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px 0px 0px'
    }
  );
  targets.forEach(el => observer.observe(el));
});


document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.swiper-slide img');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // observer.unobserve(entry.target); // 1回だけなら
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40% 0px' // 画面下40%で発火
    }
  );
  images.forEach(img => observer.observe(img));
});