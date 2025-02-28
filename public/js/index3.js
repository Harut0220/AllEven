function Pass() {
  const Pass1 = document.getElementById("Pass1");
  const val1 = Pass1.value;
  const Err1 = document.getElementById("Err1");
  if (val1.length < 8) {
    Err1.innerHTML = "*Длина пароля должна быть не менее 8 символов!";
    Pass1.style.borderColor = "red";
    Pass1.setAttribute("name", false);
  } else {
    Err1.innerHTML = "";
    Pass1.style.borderColor = "green";
    Pass1.setAttribute("name", true);
  }
}
function passRep() {
  const PassRep1 = document.getElementById("PassRep1");
  const val = document.getElementById("Pass1").value;
  const val1 = PassRep1.value;
  const Err2 = document.getElementById("Err2");
  if (val == val1) {
    Err2.innerHTML = "";
    PassRep1.style.borderColor = "green";
    PassRep1.setAttribute("name", true);
  } else {
    Err2.innerHTML = "*Пароли не совпадают!";
    PassRep1.style.borderColor = "red";
    PassRep1.setAttribute("name", false);
  }
}
