import mongoose from "mongoose";

const empObj = (req,res,next) => {
    if(Object.keys(req.body).length == 0)
    {
        res.status(412)
                .send({
                    success: false,
                    message: 'The given data is empty',
                });
    }
    next()
}

const empFiles = (req,res,next) => {
    if(!req.files)
    {
        res.status(412)
                .send({
                    success: false,
                    message: 'The file is empty',
                });
    }
    next()
}

const empAvatarFile = (req,res,next) => {
    
    if(!req.files.avatar)
    {
        res.status(412)
                .send({
                    success: false,
                    message: 'The avatar file is empty',
                });
    }
    next()
}

const isEmpObjId = (req,res,next) => {
    if(req.body.user_id){
        if (!mongoose.isValidObjectId(req.body.user_id)) {
            res.status(412)
            .send({
                success: false,
                message: 'Wrong format user_id',
            });
       }
    }

    if(req.body.user_id){
        if (!mongoose.isValidObjectId(req.body.user_id)) {
            res.status(412)
            .send({
                success: false,
                message: 'Wrong format user_id',
            });
       }
    }

    if(req.body.event_id){
        if (!mongoose.isValidObjectId(req.body.event_id)) {
            res.status(412)
            .send({
                success: false,
                message: 'Wrong format event_id',
            });
       }
    }
    
}

const isEmpParamObjId = (req,res,next) => {
    if(req.params.id){
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(412)
            .send({
                success: false,
                message: 'Wrong format id',
            });
       }
       next()
    }
    

}

export {empObj,empFiles,empAvatarFile,isEmpParamObjId}