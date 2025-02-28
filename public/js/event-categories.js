//   function CreateTable() {
//     let tbody = document.getElementById("tbody");

//     info.map((el) => {
//       let tr = document.createElement("tr");
//       tbody.appendChild(tr);

//       Object.keys(el).map((key) => {
//         let th = document.createElement("th");
//         if (key === "icon") {
//           let img = document.createElement("img");
//           img.className = "iconsImg";
//           img.src = el.icon;
//           tr.appendChild(img);
//         } else if (key === "edits") {
//           let edits = document.createElement("img");
//           edits.id = "edits";
//           edits.src = el.edits;
//           edits.setAttribute("data-number", el.id);
//           tr.appendChild(edits);
//           edits.onclick = EditFile;
//         } else if (key === "descriptions") {
//           let p = document.createElement("p");
//           p.className = "descriptionText";
//           p.innerHTML = el.descriptions;
//           tr.appendChild(p);
//         } else if (key === "CategoryNames") {
//           th.innerHTML = el.CategoryNames;
//           th.className = "CategoryNames";
//           tr.appendChild(th);
//         } else if (key === "statuss") {
//           th.innerHTML = el.statuss ? "Активный" : "Неактивный";
//           th.className = "txt";
//           tr.appendChild(th);
//         } else {
//           th.className = "txt";
//           th.innerHTML = el[key];
//           tr.appendChild(th);
//         }
//       });
//     });
//   }
const selectedFile = document.getElementById("image-input2").files[0];
const inputElement = document.getElementById("image-input2");
let reader = new FileReader();
function FileLoad2() {
  if (this?.files[0]) {
    reader.readAsDataURL(this.files[0]);
    reader.onload = function () {
      const uploaded_image = reader.result;
      document.querySelector(
        "#display-image2"
      ).style.backgroundImage = `url(${uploaded_image})`;
    };
  }
}
inputElement.addEventListener("load", FileLoad2, true);

imageInput = document.querySelector("#image-input");

function FileLoad() {
  if (this?.files[0]) {
    reader.readAsDataURL(this.files[0]);
    reader.onload = function () {
      const uploaded_image = reader.result;
      document.querySelector(
        "#display-image"
      ).style.backgroundImage = `url(${uploaded_image})`;
    };
  }
}

imageInput.addEventListener("change", FileLoad);

function UploadFile() {
  let el = document.getElementById("editContainer");
  el.style.display = "flex";

  let categoryName = document.getElementById("categoryName");
  let closePage1 = document.getElementById("closePage1");
  closePage1.onclick = function () {
    imageInput.removeEventListener("loadend", FileLoad, true);
    el.style.display = "none";
    document.getElementById("error").innerHTML = "";
    document.getElementById("descriptionError").innerHTML = "";
    textarea_1.style.border = "solid 1px #575757";
    categoryName.style.border = "solid 1px #575757";
    document.getElementById("load-icon-2-2").style.color = "#575757";
    display_image.style.background = "";
  };
}

let display_image = document.getElementById("display-image");
let display_image2 = document.getElementById("display-image2");
let editCategoryName = document.getElementById("editCategoryName");

function EditFile(e) {
  let iconsImg = document.getElementsByClassName("iconsImg");
  let categoryName = document.getElementsByClassName("CategoryNames");
  editCategoryName.setAttribute(
    "value",
    categoryName[+e.target.attributes["data-number"].nodeValue - 1].innerHTML
  );
  display_image2.setAttribute(
    "style",
    "background:url(" +
      iconsImg[+e.target.attributes["data-number"].nodeValue - 1].attributes.src
        .value +
      ") no-repeat"
  );
  display_image2.style.backgroundSize = "cover";

  let el2 = document.getElementById("editContainer2");
  el2.style.display = "flex";
  let closePage = document.getElementById("closePage");
  closePage.onclick = function () {
    inputElement.removeEventListener("change", FileLoad, false);

    el2.style.display = "none";
    document.getElementById("descriptionError2").innerHTML = "";
    textarea_.style.border = "solid 1px black";
    document.getElementById("load-icon-2").style.color = "#575757";
  };
}

const closeDv = document.getElementsByClassName("editContainer2")[0];
function removeModal() {
  closeDv.style.display = "none";
}

function AddValid() {
  let categoryName = document.getElementById("categoryName");
  let inputValue = document.getElementById("categoryName").value;

  let textValue = document.getElementById("textarea_1").value;
  let textarea_1 = document.getElementById("textarea_1");

  var select1 = document.getElementById("selectStatus");
  var select = document.getElementById("selectStatus").value;
  let text = info.reduce((last, next) => {
    if (inputValue === next.CategoryNames) {
      return "Категория с таким названием уже существует";
    }
    return last;
  }, "");
  if (inputValue.length > 15) {
    document.getElementById("error").innerHTML = "Количество слов превышает";
  } else if (text) {
    document.getElementById("error").innerHTML = text;
    categoryName.style.border = "solid 1px red";
  } else if (inputValue == "") {
    document.getElementById("error").innerHTML = "Заполните поле";
    categoryName.style.border = "solid 1px red";
  } else {
    categoryName.style.border = "solid 1px black";
    document.getElementById("error").innerHTML = "";
  }

  if (textarea_1.value.length > 100) {
    textarea_1.style.border = "solid 1px red";
    document.getElementById("descriptionError").innerHTML =
      "Количество слов превышает";
  } else if (textValue == "") {
    document.getElementById("descriptionError").innerHTML = "Заполните поле";
    textarea_1.style.border = "solid 1px red";
  } else {
    textarea_1.style.border = "solid 1px black";
    document.getElementById("descriptionError").innerHTML = "";
  }
  if (select == "") {
    select1.style.border = "solid 1px red";
  } else {
    select1.style.border = "solid 1px black";
  }
  let display__image = document.getElementById("display-image");

  uploadImages("#image-input", "display-image", "load-icon-2-2");
}
function EditValid() {
  let textValue = document.getElementById("textarea_").value;
  let textarea_1 = document.getElementById("textarea_");

  if (textarea_1.value.length >= 100) {
    textarea_1.style.border = "solid 1px red";
    document.getElementById("descriptionError2").innerHTML =
      "Количество слов превышает";
  } else if (textValue == "") {
    document.getElementById("descriptionError2").innerHTML = "Заполните поле";
    textarea_1.style.border = "solid 1px red";
  } else {
    textarea_1.style.border = "solid 1px black";
    document.getElementById("descriptionError2").innerHTML = "";
  }
  uploadImages("#image-input2", "display-image2", "load-icon-2");
}

function uploadImages(imgId, img, loadIcon) {
  let reader = new FileReader();
  const image_input = document.querySelector(imgId);
  if (image_input?.files[0]) {
    reader.readAsDataURL(image_input.files[0]);
    reader.onload = function (e) {
      let image = new Image();
      image.src = e.target.result;
      if (image.height > 400 || image.width > 400) {
        document.getElementById(loadIcon).style.color = "red";
        return false;
      }
      document.getElementById(loadIcon).style.color = "#575757";
      document.getElementById(img).style.border = "solid 1px green";
      return true;
    };
  } else {
    console.error("image");
  }
}

//   CreateTable();
function burgerMenu(icon) {
  const menu = document.querySelector(".Menu");
  icon.classList.toggle("change");
  if (menu.style.display == "none") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}

function openEditModal(data) {
  data = parseData(data);
  let act = document.getElementById("editContainerForm2");
  let mod = document.getElementById("editContainer2");
  let nameInp = document.getElementById("editCategoryName");
  let selectInp = document.getElementById("select_2");
  let textAr = document.getElementById("textarea_");
  let s = selectInp.getElementsByTagName("option");
  let img = document.getElementById("display-img2");
  let i = document.getElementById("editContainer2Id");
  i.value = data._id;
  // img.src = `/storage/${data.avatar}`;
  act.action = `/admin/profile/event-category/edit/${data._id}`;
  nameInp.value = data.name;
  textAr.innerHTML = data.description;
  if (data.status) {
    s[0].selected = true;
  } else {
    s[1].selected = true;
  }

  if (!data.avatar && !data.map_avatar) {
    s[0].disabled = true;
    s[1].disabled = true;
  }
  mod.style.display = "block";
}

function closeDiv() {
  const editDiv = document.getElementById("editContainer2");
  editDiv.style.display = "none";
}
const imageInp = document.getElementById("image-input");
const displayImg = document.getElementById("display-image");
imageInp.onchange = function () {
  const img = URL.createObjectURL(imageInp.files[0]);
  displayImg.src = img;
};
const imageInp2 = document.getElementById("image-input2");
const displayImg2 = document.getElementById("display-image_mapIcon");
imageInp2.onchange = function () {
  const img = URL.createObjectURL(imageInp2.files[0]);
  displayImg2.src = img;
};

const imageInp3 = document.getElementById("image-input3");
const displayImg3 = document.getElementById("display-img3");
imageInp3.onchange = function () {
  const img = URL.createObjectURL(imageInp3.files[0]);
  displayImg3.src = img;
};
const imageInp4 = document.getElementById("image-input4");
const displayImg4 = document.getElementById("display-image4");
imageInp4.onchange = function () {
  const img = URL.createObjectURL(imageInp4.files[0]);
  displayImg4.src = img;
};

// ================================================================
// ================================================================
// ================================================================

const fillInputLength = (input, span) => {
  span.innerHTML = `${input.value.length}/100`;
};
