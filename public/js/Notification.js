const saveNotification = () => {
  console.log("notification.js");
  
  const inputText = document.querySelector(".Input").value;
  const WhomInp = document.querySelector(".WhomInp").value;
  const TypeNotification1 = document.querySelector(".TypeNotification1").value;
  const dataInp = document.querySelector(".dataInp").value;
  document.forms[0].reset();
  const dv = document.createElement("div");
  dv.setAttribute("class", "notificationResult");
  document.querySelector(".addsaveNotification").appendChild(dv);
  const p = document.createElement("p");
  p.setAttribute("class", "notificationText");
  p.innerHTML = inputText;
  dv.appendChild(p);
  const deleteDv = document.createElement("dv1");
  deleteDv.style = "width:40%;text-align:center";
  dv.appendChild(deleteDv);
  const deleteImg = document.createElement("img");
  deleteImg.setAttribute("src", "staticimg/delete%201.svg");
  deleteImg.addEventListener("click", function removeNotification() {
    dv.remove();
  });
  deleteDv.appendChild(deleteImg);
  const p1 = document.createElement("p");
  p1.setAttribute("class", "notificationInfo");
  dv.appendChild(p1);
  p1.innerHTML = `${dataInp}, ${TypeNotification1}, ${WhomInp}`;
};
function burgerMenu(icon) {
  const menu = document.querySelector(".Menu");
  icon.classList.toggle("change");
  if (menu.style.display == "none") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}
