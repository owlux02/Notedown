const darkMode = localStorage.getItem('darkMode');

if (darkMode === 'true') {
  document.querySelector('html').dataset.mantineColorScheme = 'dark';
}

if (darkMode === 'false') {
  document.querySelector('html').dataset.mantineColorScheme = 'light';
}