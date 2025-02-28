function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return cookieValue ? cookieValue[2] : null;
}

function RemoveMessage() {
  const message1 = document.querySelector(".Message1");
  message1.style.display = "none";
}

function showMessage() {
  const message2 = document.querySelector(".Message1");
  message2.style.display = "flex";
}

let rn = getCookie('password_reset_notif');

if (rn) {
  let p = document.querySelector(".MessageTextP1");
  if (rn == 0) {
      p.innerHTML = 'Неправильный емейл';
  } else {
      p.innerHTML = 'К вам на почту поступит письмо со ссылкой для восстановления пароля.';
  }
  showMessage();
  delete_cookie('password_reset_notif');
}
