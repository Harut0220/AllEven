import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { fileTypeFromFile } from "file-type";
import sharp from "sharp";
import fetch from "node-fetch";

class UploadService {
  store = (file, dir = null, genNmae = true) => {
    if (dir) {
      fs.mkdirSync(`storage/${dir}`, { recursive: true });
    }

    let p = dir ? `${dir}/` : "";

    if (genNmae) {
      p += `${uuidv4()}${path.extname(file.name)}`;
    } else {
      p += file.name;
    }

    file.mv("storage/" + p, function (err) {
      if (err) return console.log(0);
    });

    return p;
  };

  destroy = (path) => {
    if (fs.existsSync(`storage/${path}`)) {
      fs.unlinkSync(`storage/${path}`);
    }
  };

  storeSync = async (file, dir = null, genNmae = true) => {
    return new Promise((res, rej) => {
      if (dir) {
        fs.mkdirSync(`storage/${dir}`, { recursive: true });
      }

      let p = dir ? `${dir}/` : "docs";

      if (genNmae) {
        p += `${uuidv4()}${path.extname(file.name)}`;
      } else {
        p += file.name;
      }

      file.mv("storage/" + p, function (err) {
        if (err) return console.log(0);
        res(p);
      });
    }).then(async (d) => {
      if (!path.extname(`storage/${d}`)) {
        const savedFileMim = await fileTypeFromFile(`storage/${d}`);
        const newFileName = d + "." + savedFileMim.ext;
        fs.rename(`storage/${d}`, `storage/${newFileName}`, function (err) {
          if (err) console.log("ERROR: " + err);
        });
        d = newFileName;
      }
      return d;
    });
  };

  storeLowResImage = async (data, quality = 15) => {
    const ref = `${uuidv4()}.jpeg`;
    await sharp(data)
      .jpeg({ quality })
      .toFile("storage/uploads/" + ref);

    return `uploads/${ref}`;
  };

  GoUploadService = async (form) => {
    let er = false;
    const resp = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: form,
    })
      .then(async (r) => {})
      .catch((e) => {
        er = true;
      });

    if (er) {
      return 0;
    }

    return 1;
  };

  checkFileExt = async (d) => {
    if (!path.extname(`storage/${d}`)) {
      const savedFileMim = await fileTypeFromFile(`storage/${d}`);
      const newFileName = d + "." + savedFileMim.ext;
      fs.rename(`storage/${d}`, `storage/${newFileName}`, function (err) {
        if (err) console.log("ERROR: " + err);
      });
      return newFileName;
    }
    return false;
  };
}

export default UploadService;
