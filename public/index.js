function redirect(loc) {
    const elements = document.querySelectorAll('.' + loc);
    elements.forEach(element => {
        element.classList.add('shrink-shake');
      });
      setTimeout(() => { window.location.href = "/trial.html?car=" + loc } )
}
  