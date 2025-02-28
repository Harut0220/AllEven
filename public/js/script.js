let rn = getCookie('register_notif')

if(rn){
  let cl = document.querySelector(".Message")
  cl.style.display = 'flex',
  delete_cookie('register_notif')
}

function Name() {
  const Name = document.getElementById("Name");
  const val = Name.value;
  const Err = document.getElementById("Error");
  if (val.length >= 3) {
    Err.innerHTML = "";
    Name.style.borderColor = "green";
    Name.setAttribute("name", true);
  } else {
    Err.innerHTML = "*Имя обязательно!";
    Name.style.borderColor = "red";
    Name.setAttribute("name", false);
  }
}
function surName() {
  const surName = document.getElementById("surName");
  const val = surName.value;
  const Err1 = document.getElementById("Error1");
  if (val.length >= 3) {
    Err1.innerHTML = "";
    surName.style.borderColor = "green";
    surName.setAttribute("name", true);
  } else {
    Err1.innerHTML = "*Фамилия обязательна!";
    surName.style.borderColor = "red";
    surName.setAttribute("name", false);
  }
}
function Email() {
  const Email = document.getElementById("Email");
  const val = Email.value;
  const Err2 = document.getElementById("Error2");
  if (val.length <= 0) {
    Err2.innerHTML = "*Электронная почта обязательна!";
    Email.style.borderColor = "red";
    Email.setAttribute("name", false);
  } else {
    Err2.innerHTML = "";
    Email.style.borderColor = "green";
    Email.setAttribute("name", true);
  }
}

function Password() {
  const Pass = document.getElementById("Pass");
  const val = Pass.value;
  const Err4 = document.getElementById("Error4");

  if (val.length < 8) {
    Err4.innerHTML = "*Длина пароля должна быть не менее 8 символов!";
    Pass.style.borderColor = "red";
    // Pass.setAttribute("name", false);
  } else {
    Err4.innerHTML = "";
    Pass.style.borderColor = "green";
    // Pass.setAttribute("name", true);
  }
}

function passwordRep() {
  const PassRep = document.getElementById("PassRep");
  const val = document.getElementById("Pass").value;
  const val1 = PassRep.value;
  const Err5 = document.getElementById("Error5");
  if (val == val1) {
    Err5.innerHTML = "";
    PassRep.style.borderColor = "green";
    // PassRep.setAttribute("name", true);
  } else {
    Err5.innerHTML = "*Пароли не совпадают!";
    PassRep.style.borderColor = "red";
    // PassRep.setAttribute("name", false);
  }
}
function Tel() {
  const Tel = document.getElementById("Tel");
  const val2 = Tel.value;
  const Err3 = document.getElementById("Error3");
  const reg =
    /^(\+7)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm;
  if (val2 !== "") {
    if (reg.test(val2)) {
      Err3.innerHTML = "";
      Tel.style.borderColor = "green";
      Tel.setAttribute("name", true);
    } else {
      Err3.innerHTML = "*Не корректно указан номер телефона!";
      Tel.style.borderColor = "red";
      Tel.setAttribute("name", false);
    }
  }
}

function RegEnd() {
  const message = document.querySelector(".Message");
  const inp = document.querySelectorAll(".Inp");
  const arr = [];
  inp.forEach((elem, index) => {
    const name = elem.getAttribute("name");
    if (name == "true") {
      arr.push(name);
    }
  });
  if (arr.length == inp.length) {
    message.style.display = "flex";
  } else {
    message.style.display = "none";
  }
}
function RemoveMessage() {
  const message = document.querySelector(".Message");
  message.style.display = "none";
}


