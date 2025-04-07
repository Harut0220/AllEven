import path from "path";
import fs from "fs";

const deleteImage =async (dirname,filePathArg) => {
    const filePath = filePathArg.split("/")[1];
    console.log(dirname,filePathArg,"dirname,filePathArg");

    
    if (!filePath) {
      return res.status(400).json({ error: "File path is required." });
    }

    try {
      const fullPath = path.join(
        dirname,
        "storage",
        "uploads",
        path.basename(filePath)
      );
      console.log(fullPath, "fullPath");
      

      if (!fs.existsSync(fullPath)) {
        return { error: "File not found.", success: false };
      }

      fs.unlinkSync(fullPath);

      return { message: "File deleted successfully.", success: true };
    } catch (err) {
      return {
        error: "Error deleting file.",
        details: err.message,
        success: false,
      };
    }
  };

  export default deleteImage;