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
const imageInp5 = document.getElementById("image-input5");
const displayImg5 = document.getElementById("display-image5");
imageInp5.onchange = function () {
  const img = URL.createObjectURL(imageInp5.files[0]);
  displayImg5.src = img;
};
const imageInp6 = document.getElementById("image-input6");
const displayImg6 = document.getElementById("display-image6");
imageInp6.onchange = function () {
  const img = URL.createObjectURL(imageInp6.files[0]);
  displayImg6.src = img;
};

// ==============================================================
// ==============================================================
// ==============================================================

const fillInputLength = (input, span) => {
  span.innerHTML = `${input.value.length}/100`;
};
