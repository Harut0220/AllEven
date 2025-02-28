import moment from "moment";
import Translator from "json-translation";
import path from "path";
import handlebars from "handlebars";
let ts = new Translator();
ts.setPath("languages")
ts.init()
ts.separator = ";"

const h = {
  participantsArray:(array, userKey,options)=> {
    // const urlPoint = options.hash.urlPoint;  // Get urlPoint from options
    // let out = '';
    // const linkArray=urlPoint.split(":/").join("://")
   
    

   return array.map(item => {
        const user = item[userKey];
    
 
        return options.fn({ user});
    }).join('');
},
  and: (a, b) =>{
    return a && b;
  },
  eventCategoryArraysOne:(array,idKey,nameKey,descriptionKey, avatarKey,map_avatarKey,statusKey, options)=> {
    if (!Array.isArray(array)) {
      return '';
  }
  
    // Generate <option> elements
    return array.map((item) => {
      const id = item[idKey];
        const name = item[nameKey];
        const description = item[descriptionKey];
        const avatar=item[avatarKey]
        const map_avatar=item[map_avatarKey]
        const status=item[statusKey]
        return options.fn({ id, name,description,avatar,map_avatar,status });
    }).join('');
  },
  limit:(array, limit, options)=> {
    if (!array || !array.length) return '';
  
    let result = '';
    for (let i = 0; i < Math.min(limit, array.length); i++) {
      result += options.fn(array[i]); // Call the block with each item
    }
    
    return result;
},
  or:(arg1, arg2, options)=> {
    return (arg1 || arg2) ? options.fn(this) : options.inverse(this);
},
  companyCategoryArrays:(array, idKey, nameKey,iamgeKey, options)=> {
    if (!Array.isArray(array)) {
        return '';
    }
  
    // Generate <option> elements
    return array.map(item => {
        const id = item[idKey];
        const name = item[nameKey];
        const image=item[iamgeKey]
        return options.fn({ id, name,image });
    }).join('');
  },
  optionsFromArraysy:(array, idKey, pathKey, options)=> {
    // const urlPoint = options.hash.urlPoint;  // Get urlPoint from options
    // let out = '';
    // const linkArray=urlPoint.split(":/").join("://")
   
    

   return array.map(item => {
        const id = item[idKey];
        const path = item[pathKey];
        // const url = `${path}`;
        return options.fn({ id, path });
    }).join('');
},
  getValueCategory:(obj, key)=>{
    return obj[key];
  },
  getValueOwner:(obj, key)=> {
    return obj[key];
  },
  // getValueMeet:(obj, key)=> {
  //   return obj[key];
  // },
  optionsCompanyArrays: (array, valueKey, textKey,ownerKey,startKey,endKey,ratingKey,categoryKey,placeKey,likesKey,statusKey,onlineKey,servicesKey, options) => {
    if (!Array.isArray(array)) {
        return '';
    }
  
    // Generate <option> elements
    return array.map(item => {
        const id = item[valueKey];
        const name = item[textKey];
        const owner=item[ownerKey]
        const startHour=item[startKey]
        const endHour=item[endKey]
        const rating=item[ratingKey]
        const category=item[categoryKey]
        const address=item[placeKey]
        const likes=item[likesKey]
        const status=item[statusKey]
        const onlinePay=item[onlineKey]
        const services=item[servicesKey]
        return options.fn({ id, name, owner, startHour,endHour,rating,category,address,likes,status,onlinePay,services  });
    }).join('');
  }, 


  optionsServicePays: (array, valueKey, userKey,serviceKey,registerKey,prepaymentKey,prepaymentPriceKey,paymentKey,paymentPriceKey,dateKey, options) => {
    if (!Array.isArray(array)) {
        return '';
    }
  
    // Generate <option> elements
    return array.map(item => {
        const id = item[valueKey];
        const user = item[userKey];
        const service=item[serviceKey]
        const register=item[registerKey]
        const prepayment=item[prepaymentKey]
        const prepaymentPrice=item[prepaymentPriceKey]
        const payment=item[paymentKey]
        const paymentPrice=item[paymentPriceKey]
        const date=item[dateKey]

        return options.fn({ id, user, service, register,prepayment,prepaymentPrice,payment,paymentPrice,date  });
    }).join('');
  },
  
  getServicesArrays: (array, typeKey, options) => {
    return array.map(item => {
      const type = item[typeKey];

      return options.fn({ type });
  }).join('');
    
  },
  optionsMeetingArrays:(array, valueKey, purposeKey,ownerKey,addressKey,openDateKey,openTimeKey,startDateKey,statusKey,likesKey,sitKey, options)=>{
    if (!Array.isArray(array)) {
      return '';
  }

  // Generate <option> elements
  return array.map(item => {
      const id = item[valueKey];
      const purpose = item[purposeKey];
      const owner=item[ownerKey]
      const address=item[addressKey]
      const openDate=item[openDateKey]
      const openTime=item[openTimeKey]
      const startDate=item[startDateKey]
      const status=item[statusKey]
      const likes=item[likesKey]
      const situation=item[sitKey]
      
      return options.fn({ id, purpose, owner,address,openDate,openTime,startDate,status,likes,situation  });
  }).join('');
  },
  optionsMeetingParticipants:(array,  idKey,nameKey,surnameKey,emailKey,genderKey,  options)=> {
   
  
    if (!Array.isArray(array)) {
      return '';
    }
  
    return array.map(item => {
      // const value = item[valueKey];
      const name = item[nameKey];
      const id = item[idKey];
      const surname=item[surnameKey]
      const email=item[emailKey]
      const gender=item[genderKey]
   
  
      return options.fn({ id,name,surname,email,gender });
    }).join('');},
  optionsPhoneArrays:(array, phoneKey, telegramKey,whatsKey, options)=> {
    if (!Array.isArray(array)) {
        return '';
    }
  
    // Generate <option> elements
    return array.map(item => {
        const phone = item[phoneKey];
        const telegram = item[telegramKey];
        const whats=item[whatsKey]
        return options.fn({ phone, telegram,whats });
    }).join('');
  },
    getImageUrls:(images)=> {
  if (Array.isArray(images)) {
    return images.map(image => image.url).join(', ');
  }
  return 'No images available';
},
    getNestedValue:(obj, keyPath)=> {
  if (!obj || !keyPath) {
    return '';
  }

  // Split the keyPath by dots to traverse the object
  const keys = keyPath.split('.');
  let value = obj;

  // Traverse the object
  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      return '';
    }
  }

  return value;
},
    ifEquals:(a, b, options)=> {
  return a === b ? options.fn(this) : options.inverse(this);
},
    json:(context)=> {
  return JSON.stringify(context, null, 2);
},
getValueOwnerCompany:(obj, key)=> {
  return obj[key];
},
getValue:(obj, key)=> {
  return obj[key];
},
getValueUrl:(obj, key)=> {
  return obj[key];
},
    getNames:(array, options)=> {
  // Check if the input is an array
  if (!Array.isArray(array)) {
      return '';
  }
  // Iterate over the array and build a result string
  return array.map(item => options.fn(item)).join('');
},
    list:(context, options)=> {
  return (
    "<ul>" +
    context
      .map(function(item) {
        return "<li>" + options.fn(item) + "</li>";
      })
      .join("\n") +
    "</ul>"
  );
},
    optionsFromArrays:(array, valueKey, textKey, options)=> {
  if (!Array.isArray(array)) {
      return '';
  }

  // Generate <option> elements
  return array.map(item => {
      const value = item[valueKey];
      const url = item[textKey];
      return options.fn({ value, url });
  }).join('');
},
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
imagesFromMeeting:(array, valueKey, textKey, options)=> {
  if (!Array.isArray(array)) {
      return '';
  }

  // Generate <option> elements
  return array.map(item => {
      const id = item[valueKey];
      const path = item[textKey];
      return options.fn({ id, path });
  }).join('');
},
    optionsFromArray:(array, valueKey, textKey, idKey, imagesKey,descKey, options)=> {
  

  if (!Array.isArray(array)) {
    return '';
  }

  return array.map(item => {
    const value = item[valueKey];
    const text = item[textKey];
    const id = item[idKey];
    const images = item[imagesKey];
    const desc=item[descKey]
    
  

    const imageElements = Array.isArray(images) 
      ? images.map(img => `<img class="img_service" src="/${img}" alt="Image" />`).join(' ')
      : '';

    return options.fn({ value, text, id, images: imageElements,desc });
  }).join('');
},
ArrayFromComments:(array,textKey, dateKey,userKey,likesKey, options)=> {


  if (!Array.isArray(array)) {
    return '';
  }

  return array.map(item => {
    const text = item[textKey];
    const date = item[dateKey];
    const user=item[userKey]
    const likes=item[likesKey]
    // const id = item[idKey];
    // const images = item[imagesKey];
    // const desc=item[descKey]

    return options.fn({ text,date,user,likes});
  }).join('');
},
    inc : (num) => {
        return parseInt(num) + 1;
    },

    eq : (v1,v2) => {
        return v1 == v2
    },

    notEq : (v1,v2) => {
        return v1 != v2
    },

    json : (data) => {
        return JSON.stringify(data);
    },
    
    jsonRemoveQuot : (data) => {
        return JSON.stringify(data).replace(/['"]+/g, '');
    },

    convertDate : (dat) => {
        // let t = 'DD-MM-YYYY HH:MM'
        // return moment(date).utc().format(t).toString()
        const date = new Date(dat);
        return ("00" + date.getDate()).slice(-2)  + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        date.getFullYear() + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);
    },

    convertDateHours : (date) => {
        let t = 'DD.MM.YYYY'
        return moment(date).utc().format(t).toString()
    },

    convertDateTime : (dat) => {
        const date = new Date(dat);
        return date.getFullYear()  + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);
        // let t = 'YYYY-MM-DDTHH:MM'
        // return moment(date).utc().format(t).toString()
    },

    lng : (data,l = "ru") => {
        return ts.translate(l, data)
    },

    param : (p) => {
        return p
    },

    pathName : (p) => {
        return path.parse(p).name
    },

    incl: (dat,p,k = null) => {
        if(dat && k && dat.length){
            for(let i=0;i<dat.length;i++){
                if(dat[i][k] == p){
                    return 1
                }
            }
            return 0
        }
        return 0
    },

    inclOne: (dat,p,k = null) => {
        if(dat && dat.length){

            if(dat[0][k] == p && !dat[1]){
                return 1
            }
        }
        return 0
    },

    eqArr: (dat,value) => {
        if(dat && dat.length && value){
            for(let i=0;i<dat.length;i++){
                if(dat[i].equals(value)){
                    return 1
                }
            }
            return 0
        }
        return 0
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

    
}


export default h;