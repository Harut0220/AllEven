export const storeOne = async (req,res,next) => {
    if(req.files && req.files.file){
        next()
    }else{
        return res.status(412)
                .send({
                    success: false,
                    message: 'File is empty',
                });
    }

}


export const storeMulti = async (req,res,next) => {
    if(req.files && req.files.file && req.files.file.length){

        
        
        
        next()
    }else{
        console.log("req file chka");
        
        return res.status(412)
                .send({
                    success: false,
                    message: 'File must be an array',
                });
    }

}