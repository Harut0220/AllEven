import axios from "axios";

class SmsProstoService{

    sendMessage = async (recipient,messgae,sender = 'Sobytiya') => {

      console.log(process.env.PR_SMS_LOG,"process.env.PR_SMS_LOG")
      console.log(process.env.PR_SMS_PASS,"process.env.PR_SMS_PASS");
        return axios.get(`http://api.sms-prosto.ru/?method=push_msg&format=json&email=${process.env.PR_SMS_LOG}&password=${process.env.PR_SMS_PASS}&text=${messgae}&phone=${recipient}&sender_name=${sender}`)
        .then(async function (r) {
            return r.data.response.msg.err_code;
          }).catch(err => {
            console.log('Error: sendMessage: ', err);
          })
    }
}

export default SmsProstoService;
  