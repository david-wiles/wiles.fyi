let theme = 'light';
let selectors = "h1, h2, h3, h4, h5, h6, p, li, a, i";

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("theme") === 'dark') {
    toggleTheme();
  }
});

function toggleTheme() {
  if (theme === 'light') {
    theme = 'dark';
    document.body.style.backgroundColor = 'rgb(50, 50, 50)'
    document.querySelectorAll(selectors).forEach((el) => el.classList.add("dark"));
    localStorage.setItem("theme", theme);
  } else {
    theme = 'light';
    document.body.style.backgroundColor = 'white';
    document.querySelectorAll(selectors).forEach((el) => el.classList.remove("dark"));
    localStorage.setItem("theme", theme);
  }
}

function toggleMenu() {
  document.querySelectorAll("header .header-list, .hamburger")
    .forEach((el) => el.classList.toggle("open"));
  document.querySelectorAll(".main-content, .header-logo")
    .forEach((el) => el.classList.toggle("hidden"));
}
