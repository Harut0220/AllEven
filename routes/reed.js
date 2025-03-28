import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reedRouter=Router()


reedRouter.get("/tinymce/:image", (req, res) => {
  try {
    const image = req.params.image;
    const imagePath = path.join(__dirname, "..", "node_modules", "tinymce", image);

    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error); 
  }
});
  

reedRouter.get("/document/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "storage", "docs", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/Publice/:json",(req,res)=>{
  try {
    const image = req.params.json;
    const imagePath = path.join(__dirname,"..", "views", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/icon/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "storage", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/admin/styles/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "views", "styles", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/public/js/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "public", "js", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})


reedRouter.get("/admin/profile/event/styles/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "views", "styles", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/api/styles/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "views", "styles", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/admin/profile/styles/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "views", "styles", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/companyCategory/:image", (req, res) => {
  const image = req.params.image;
  const imagePath = path.join(__dirname,"..", "storage", "companyCategory", image);

  // Check if the file exists
  if (image && imagePath) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
})

reedRouter.get("/fonts/:image", (req, res) => {
  const image = req.params.image;
  const imagePath = path.join(__dirname,"..", "public", "styles","fonts", image);

  // Check if the file exists
  if (image && imagePath) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
})


reedRouter.get("/public/images/pics/:image", (req, res) => {
  const image = req.params.image;
  const imagePath = path.join(__dirname,"..", "public", "images","pics", image);

  // Check if the file exists
  if (image && imagePath) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
})
reedRouter.get("/public/images/staticimg/:image", (req, res) => {
  const image = req.params.image;
  const imagePath = path.join(__dirname,"..", "public", "images","staticimg", image);

  // Check if the file exists
  if (image && imagePath) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
})

reedRouter.get("/categories/:imageCategory",async(req,res)=>{
  const imageCategory = req.params.imageCategory;

  const imagePath = path.join(__dirname,"..", "storage","categories", imageCategory);

  // Check if the file exists
  if (imageCategory && imagePath) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
})

reedRouter.get("/categories/map/:imageCategory",async(req,res)=>{
  const imageCategory = req.params.imageCategory;

  const imagePath = path.join(__dirname,"..", "storage","categories","map", imageCategory);

  // Check if the file exists
  if (imageCategory && imagePath) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
})

reedRouter.get("/docs/:filename",(req,res)=>{
  try {
    const imageCategory = req.params.filename;

    const imagePath = path.join(__dirname,"..", "storage","docs", imageCategory);
  
    // Check if the file exists
    if (imageCategory && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get('/uploads/:image',(req,res)=>{
  const imageCategory = req.params.image;
 
  
  const imagePath = path.join(__dirname,"..", "storage","uploads", imageCategory);
  // console.log(imagePath);
  // Check if the file exists
  if (imageCategory && imagePath) {
    res.status(200).sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
})

// reedRouter.get("/uploads/:image", (req, res) => {
//   const image = req.params.image;
//   const imagePath = path.join(__dirname,"..", "uploads", image);

//   // Check if the file exists
//   if (image && imagePath) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).send("Image not found");
//   }
// })

reedRouter.get("/admin/profile/company/styles/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "views", "styles", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})

reedRouter.get("/admin/profile/public/js/:cssFile",(req,res)=>{
  try {
    const image = req.params.cssFile;
    const imagePath = path.join(__dirname,"..", "public", "js", image);
  
    // Check if the file exists
    if (image && imagePath) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error)
  }
})



export default reedRouter