import moment from "moment";
import Translator from "json-translation";
import path from "path";
import handlebars from "handlebars";
let ts = new Translator();
ts.setPath("languages");
ts.init();
ts.separator = ";";

const h = {
  meetingImpressionImages: (array, options) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array
      .map((item) => {


        return options.fn({
          id: item._id,
          paths: item.path, // Array of image paths
          user_name: item.user?.name || "Unknown",
          user_surname: item.user?.surname || "",
          user_avatar: item.user?.avatar || "default-avatar.png",
          event_id: item.meeting,
        });
      })
      .join("");
  },
  eventImpressionImages: (array, options) => {
    if (!Array.isArray(array)) {
        return "";
    }

    return array
        .map((item, index) => {
            return options.fn({
                id: item._id,
                paths: item.path, // Array of image paths
                user_name: item.user?.name || "Unknown",
                user_surname: item.user?.surname || "",
                user_avatar: item.user?.avatar || "default-avatar.png",
                event_id: item.event,
                event_index: index // Adding index
            });
        })
        .join("");
},
  //   ImpressionImages: (array, options) => {
  //     if (!Array.isArray(array)) {
  //         return '';
  //     }

  //     return array
  //         .map((item, index) => options.fn({
  //             path: item,
  //             first: index === 0,
  //             index: index
  //         }))
  //         .join('');
  // },
  ImpressionImages: (array, options) => {
    if (!Array.isArray(array)) {
        return '';
    }

    return array
        .map((item, index) => options.fn({ 
            path: item, 
            first: index === 0, 
            index: index 
        }))
        .join('');
},

  ImpressionImagesMeet: (array, options) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array.map((item) => options.fn({ path: item })).join("");
  },
  report: (
    array,
    idKey,
    nameKey,
    surnameKey,
    phone_numberKey,
    textKey,
    report_typeKey,
    event_commentKey,
    event_impressionKey,
    meeting_commentKey,
    meeting_impressionKey,
    company_commentKey,
    company_impressionKey,
    eventKey,
    companyKey,
    meetingKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array
      .map((item, itemIndex) => {
        const id = item[idKey] || "";
        const name = item[nameKey] || "";
        const surname = item[surnameKey] || "";
        const phone_number = item[phone_numberKey] || "";
        const text = item[textKey] || "";
        const report_type = item[report_typeKey];
        const event_comment = item[event_commentKey];
        const event_impression = item[event_impressionKey];
        const meeting_comment = item[meeting_commentKey];
        const meeting_impression = item[meeting_impressionKey];
        const company_comment = item[company_commentKey];
        const company_impression = item[company_impressionKey];
        const event = item[eventKey];
        const company = item[companyKey];
        const meeting = item[meetingKey];


        return options.fn({
          index: itemIndex + 1,
          id,
          name,
          surname,
          phone_number,
          text,
          report_type,
          event_comment,
          event_impression,
          meeting_comment,
          meeting_impression,
          company_comment,
          company_impression,
          event,
          company,
          meeting,
        });
      })
      .join("");
  },
  participantsArray: (array, userKey, options) => {
    // const urlPoint = options.hash.urlPoint;  // Get urlPoint from options
    // let out = '';
    // const linkArray=urlPoint.split(":/").join("://")

    return array
      .map((item) => {
        const user = item[userKey];

        return options.fn({ user });
      })
      .join("");
  },
  and: (a, b) => {
    return a && b;
  },
  eventCategoryArraysOne: (
    array,
    idKey,
    nameKey,
    descriptionKey,
    avatarKey,
    map_avatarKey,
    statusKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    // Generate <option> elements
    return array
      .map((item) => {
        const id = item[idKey];
        const name = item[nameKey];
        const description = item[descriptionKey];
        const avatar = item[avatarKey];
        const map_avatar = item[map_avatarKey];
        const status = item[statusKey];
        return options.fn({
          id,
          name,
          description,
          avatar,
          map_avatar,
          status,
        });
      })
      .join("");
  },
  limit: (array, limit, options) => {
    if (!array || !array.length) return "";

    let result = "";
    for (let i = 0; i < Math.min(limit, array.length); i++) {
      result += options.fn(array[i]); // Call the block with each item
    }

    return result;
  },
  or: (arg1, arg2, options) => {
    return arg1 || arg2 ? options.fn(this) : options.inverse(this);
  },
  companyCategoryArrays: (array, idKey, nameKey, iamgeKey, options) => {
    if (!Array.isArray(array)) {
      return "";
    }

    // Generate <option> elements
    return array
      .map((item) => {
        const id = item[idKey];
        const name = item[nameKey];
        const image = item[iamgeKey];
        return options.fn({ id, name, image });
      })
      .join("");
  },
  optionsFromArraysy: (array, idKey, pathKey, options) => {
    // const urlPoint = options.hash.urlPoint;  // Get urlPoint from options
    // let out = '';
    // const linkArray=urlPoint.split(":/").join("://")

    return array
      .map((item) => {
        const id = item[idKey];
        const path = item[pathKey];
        // const url = `${path}`;
        return options.fn({ id, path });
      })
      .join("");
  },
  getValueCategory: (obj, key) => {
    return obj[key];
  },
  getValueOwner: (obj, key) => {
    return obj[key];
  },
  // getValueMeet:(obj, key)=> {
  //   return obj[key];
  // },
  optionsCompanyArrays: (
    array,
    valueKey,
    textKey,
    ownerKey,
    startKey,
    endKey,
    ratingKey,
    categoryKey,
    placeKey,
    likesKey,
    statusKey,
    onlineKey,
    servicesKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    // Generate <option> elements
    return array
      .map((item) => {
        const id = item[valueKey];
        const name = item[textKey];
        const owner = item[ownerKey];
        const startHour = item[startKey];
        const endHour = item[endKey];
        const rating = item[ratingKey];
        const category = item[categoryKey];
        const address = item[placeKey];
        const likes = item[likesKey];
        const status = item[statusKey];
        const onlinePay = item[onlineKey];
        const services = item[servicesKey];
        return options.fn({
          id,
          name,
          owner,
          startHour,
          endHour,
          rating,
          category,
          address,
          likes,
          status,
          onlinePay,
          services,
        });
      })
      .join("");
  },

  optionsServicePays: (
    array,
    idKey,
    nameKey,
    surnameKey,
    companyKey,
    serviceKey,
    dateKey,
    statusKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    // Generate <option> elements
    return array
      .map((item) => {
        const id = item[idKey];
        const name = item[nameKey];
        const surname = item[surnameKey];
        const companyName = item[companyKey];
        const serviceName = item[serviceKey];
        const date = item[dateKey];
        const status = item[statusKey];

        return options.fn({
          id,
          name,
          surname,
          companyName,
          serviceName,
          date,
          status,
        });
      })
      .join("");
  },

  getServicesArrays: (array, typeKey, options) => {
    return array
      .map((item) => {
        const type = item[typeKey];

        return options.fn({ type });
      })
      .join("");
  },
  optionsMeetingArrays: (
    array,
    valueKey,
    purposeKey,
    ownerKey,
    addressKey,
    openDateKey,
    openTimeKey,
    startDateKey,
    statusKey,
    likesKey,
    sitKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    // Generate <option> elements
    return array
      .map((item) => {
        const id = item[valueKey];
        const purpose = item[purposeKey];
        const owner = item[ownerKey];
        const address = item[addressKey];
        const openDate = item[openDateKey];
        const openTime = item[openTimeKey];
        const startDate = item[startDateKey];
        const status = item[statusKey];
        const likes = item[likesKey];
        const situation = item[sitKey];

        return options.fn({
          id,
          purpose,
          owner,
          address,
          openDate,
          openTime,
          startDate,
          status,
          likes,
          situation,
        });
      })
      .join("");
  },
  optionsMeetingParticipants: (
    array,
    idKey,
    nameKey,
    surnameKey,
    emailKey,
    genderKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array
      .map((item) => {
        // const value = item[valueKey];
        const name = item[nameKey];
        const id = item[idKey];
        const surname = item[surnameKey];
        const email = item[emailKey];
        const gender = item[genderKey];

        return options.fn({ id, name, surname, email, gender });
      })
      .join("");
  },
  optionsPhoneArrays: (array, phoneKey, telegramKey, whatsKey, options) => {
    if (!Array.isArray(array)) {
      return "";
    }

    // Generate <option> elements
    return array
      .map((item) => {
        const phone = item[phoneKey];
        const telegram = item[telegramKey];
        const whats = item[whatsKey];
        return options.fn({ phone, telegram, whats });
      })
      .join("");
  },
  getImageUrls: (images) => {
    if (Array.isArray(images)) {
      return images.map((image) => image.url).join(", ");
    }
    return "No images available";
  },
  getNestedValue: (obj, keyPath) => {
    if (!obj || !keyPath) {
      return "";
    }

    // Split the keyPath by dots to traverse the object
    const keys = keyPath.split(".");
    let value = obj;

    // Traverse the object
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return "";
      }
    }

    return value;
  },
  ifEquals: (a, b, options) => {
    return a === b ? options.fn(this) : options.inverse(this);
  },
  json: (context) => {
    return JSON.stringify(context, null, 2);
  },
  getValueOwnerCompany: (obj, key) => {
    return obj[key];
  },
  getValue: (obj, key) => {
    return obj[key];
  },
  getValueUrl: (obj, key) => {
    return obj[key];
  },
  getNames: (array, options) => {
    // Check if the input is an array
    if (!Array.isArray(array)) {
      return "";
    }
    // Iterate over the array and build a result string
    return array.map((item) => options.fn(item)).join("");
  },
  list: (context, options) => {
    return (
      "<ul>" +
      context
        .map(function (item) {
          return "<li>" + options.fn(item) + "</li>";
        })
        .join("\n") +
      "</ul>"
    );
  },
  optionsFromArrays: (array, valueKey, textKey, options) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array
      .map((item, index) => {
        const value = item[valueKey];
        const url = item[textKey];

        // Pass index along with value and url
        return options.fn({ value, url, index, first: index === 0 });
      })
      .join("");
  },

  //     optionsFromArrays:(array, valueKey, textKey, options)=> {
  //   if (!Array.isArray(array)) {
  //       return '';
  //   }

  //   // Generate <option> elements
  //   return array.map(item => {
  //       const value = item[valueKey];
  //       const url = item[textKey];
  //       return options.fn({ value, url });
  //   }).join('');
  // },
  // imagesFromMeeting:(array, valueKey, textKey, options)=> {
  //   if (!Array.isArray(array)) {
  //       return '';
  //   }

  //   // Generate <option> elements
  //   return array.map(item => {
  //       const value = item[valueKey];
  //       const url = item[textKey];
  //       return options.fn({ value, url });
  //   }).join('');
  // },
  imagesFromMeeting: (array, valueKey, textKey, options) => {
    if (!Array.isArray(array)) {
      return "";
    }

    // Generate <option> elements
    return array
      .map((item) => {
        const id = item[valueKey];
        const path = item[textKey];
        return options.fn({ id, path });
      })
      .join("");
  },
  optionsFromArray: (
    array,
    valueKey,
    textKey,
    idKey,
    imagesKey,
    descKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array
      .map((item) => {
        const value = item[valueKey];
        const text = item[textKey];
        const id = item[idKey];
        const images = item[imagesKey];
        const desc = item[descKey];

        return options.fn({ value, text, id, images, desc });
      })
      .join("");
  },
  singleImage: (
    array,
    valueKey,
    textKey,
    idKey,
    imagesKey,
    descKey,
    options
  ) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array
      .map((item, itemIndex) => {
        const value = item[valueKey];
        const text = item[textKey];
        const id = item[idKey];
        const images = item[imagesKey];
        const desc = item[descKey];

        return options.fn({ value, text, id, images, desc });
      })
      .join("");
  },

  // singleImage:(array, valueKey, textKey, idKey, imagesKey,descKey, options)=> {

  //   if (!Array.isArray(array)) {
  //     return '';
  //   }

  //   return array.map(item => {
  //     const value = item[valueKey];
  //     const text = item[textKey];
  //     const id = item[idKey];
  //     const images = item[imagesKey];
  //     const desc=item[descKey]

  //     const imageElements = Array.isArray(images)
  //       // ? images.map(img => `<img class="img_service" src="/${img}" data-bs-toggle="modal" data-bs-target="#serviceImagesModal" alt="Image" />`).join(' ')
  //       ? images.map(img =>`<div class="carousel-item {{#if first}}active{{/if}}" data-index="{{index}}"><img src="/${img}" class="d-block my-img w-100 modal-img" alt="Service Image"></div>`).join(' ')
  //       : '';

  //     return options.fn({ value, text, id, images: imageElements,desc });
  //   }).join('');
  // },

  ArrayFromComments: (array, textKey, dateKey, userKey, likesKey, options) => {
    if (!Array.isArray(array)) {
      return "";
    }

    return array
      .map((item) => {
        const text = item[textKey];
        const date = item[dateKey];
        const user = item[userKey];
        const likes = item[likesKey];
        // const id = item[idKey];
        // const images = item[imagesKey];
        // const desc=item[descKey]

        return options.fn({ text, date, user, likes });
      })
      .join("");
  },
  inc: (num) => {
    return parseInt(num) + 1;
  },

  eq: (v1, v2) => {
    return v1 == v2;
  },

  notEq: (v1, v2) => {
    return v1 != v2;
  },

  json: (data) => {
    return JSON.stringify(data);
  },

  jsonRemoveQuot: (data) => {
    return JSON.stringify(data).replace(/['"]+/g, "");
  },

  convertDate: (dat) => {
    // let t = 'DD-MM-YYYY HH:MM'
    // return moment(date).utc().format(t).toString()
    const date = new Date(dat);
    return (
      ("00" + date.getDate()).slice(-2) +
      "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      date.getFullYear() +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2)
    );
  },

  convertDateHours: (date) => {
    let t = "DD.MM.YYYY";
    return moment(date).utc().format(t).toString();
  },

  convertDateTime: (dat) => {
    const date = new Date(dat);
    return (
      date.getFullYear() +
      "-" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date.getDate()).slice(-2) +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2)
    );
    // let t = 'YYYY-MM-DDTHH:MM'
    // return moment(date).utc().format(t).toString()
  },

  lng: (data, l = "ru") => {
    return ts.translate(l, data);
  },

  param: (p) => {
    return p;
  },

  pathName: (p) => {
    return path.parse(p).name;
  },

  incl: (dat, p, k = null) => {
    if (dat && k && dat.length) {
      for (let i = 0; i < dat.length; i++) {
        if (dat[i][k] == p) {
          return 1;
        }
      }
      return 0;
    }
    return 0;
  },

  inclOne: (dat, p, k = null) => {
    if (dat && dat.length) {
      if (dat[0][k] == p && !dat[1]) {
        return 1;
      }
    }
    return 0;
  },

  eqArr: (dat, value) => {
    if (dat && dat.length && value) {
      for (let i = 0; i < dat.length; i++) {
        if (dat[i].equals(value)) {
          return 1;
        }
      }
      return 0;
    }
    return 0;
  },

  // eqArr2: (dat,value) => {
  //     if(dat && dat.length && value){
  //         for(let i=0;i<dat.length;i++){
  //             if(dat[i] == value){
  //                 return 1
  //             }
  //         }
  //         return 0
  //     }
  //     return 0
  // }
  // formatReport: async (datas, options) => {
  //   if (!datas || !Array.isArray(datas) || datas.length === 0) {
  //     return new Handlebars.SafeString(
  //       '<tr><td colspan="6">Нет данных</td></tr>'
  //     );
  //   }

  //   let output = "";

  //   datas.forEach((report, index) => {
  //     output += `
  //           <tr>
  //               <td class="td0">${index + 1}</td>
  //               <td class="td1">${report.name || "Нет имени"}</td>
  //               <td class="td2">${report.surname || "Нет фамилии"}</td>
  //               <td class="td3">${report.phone_number || "Нет номера"}</td>
  //               <td class="td4">${report.text || "Нет сообщения"}</td>
  //               <td class="td5">
  //                   ${generateLink(report.event, "event")}
  //                   ${generateLink(report.company, "company")}
  //                   ${generateLink(report.meeting, "meeting")}
  //                   ${generateLink(report.comment, "comment")}
  //                   ${generateLink(report.event_impression, "event_impression")}
  //                   ${generateLink(
  //                     report.company_impression,
  //                     "company_impression"
  //                   )}
  //                   ${generateLink(
  //                     report.meeting_impression,
  //                     "meeting_impression"
  //                   )}
  //               </td>
  //           </tr>
  //       `;
  //   });

  //   function generateLink(data, type) {
  //     if (!data) return "";

  //     let url = "";
  //     let name = "";

  //     switch (type) {
  //       case "event":
  //         url = `/admin/profile/event/single/${data._id}`;
  //         name = data.name || "Событие";
  //         break;
  //       case "company":
  //         url = `/admin/profile/company/single/${data._id}`;
  //         name = data.name || "Компания";
  //         break;
  //       case "meeting":
  //         url = `/admin/profile/meeting/single/${data._id}`;
  //         name = data.name || "Встреча";
  //         break;
  //       case "comment":
  //         url = `/admin/profile/event/single/${data.event}`;
  //         name = data.text || "Комментарий";
  //         break;
  //       case "event_impression":
  //         url = `/admin/profile/event/single/${data.event}`;
  //         name = "Впечатление о событии";
  //         break;
  //       case "company_impression":
  //         url = `/admin/profile/company/single/${data.company}`;
  //         name = "Впечатление о компании";
  //         break;
  //       case "meeting_impression":
  //         url = `/admin/profile/meeting/single/${data.meeting}`;
  //         name = "Впечатление о встрече";
  //         break;
  //       default:
  //         return "";
  //     }

  //     return `
  //         ${name} <br>
  //         <a href="${url}">
  //             <img src="/images/pics/Vector202.svg" style="cursor: pointer;">
  //         </a>
  //     `;
  //   }

  //   return output;
  // },
};

export default h;
