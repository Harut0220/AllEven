import multer from "multer";
import util from "util";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./storage");
    },
    filename: (req, file, cb) => {
      cb(null,`${uuidv4()}.${path.extname(file.originalname)}`);
    },
  });
  
  let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
  }).single("file");
  
  let uploadFileMiddleware = util.promisify(uploadFile);

  export default uploadFileMiddleware;


