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