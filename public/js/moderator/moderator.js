function burgerMenu(icon) {
    const menu = document.querySelector(".Menu");
    icon.classList.toggle("change");
    if (menu.style.display == "none") {
      menu.style.display = "flex";
    } else {
      menu.style.display = "none";
    }
  }
  
  let SearchModal = document.getElementById("SearchModal");
  let pox = 0;
  function search() {
    if (pox === 0) {
      SearchModal.style.display = "flex";
      pox++;
    } else if (pox === 1) {
      SearchModal.style.display = "none";
      pox--;
    }
  }
  
  let periodInp = document.getElementById("period");
  function period() {
    if (checkbox1.checked) {
      periodInp.style.display = "flex";
    } else {
      periodInp.style.display = "none";
    }
  }
  
  let imgItem = document.getElementsByClassName("imgItem");
  function setBorder(arg) {
    for (i = 0; i < imgItem.length; i++) {
      imgItem[i].style.border = "none";
    }
    this.style.border = "2px solid #00ADA6";
    this.style.borderRadius = "5px";
  }
  
  for (i = 0; i < imgItem.length; i++) {
    imgItem[i].addEventListener("click", setBorder);
  }