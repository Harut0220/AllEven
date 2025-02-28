class GenerateRand{
    pin = async (min = 1000,max = 9999) => {
        return ("0" + (Math.floor(Math.random() * (max - min + 1)) + min)).substr(-4);
    }

    string = async (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}


export default GenerateRand;