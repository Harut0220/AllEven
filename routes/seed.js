import { Router } from "express";
import categoryCompany from "../public/categoryCompany.js";
import companyCategory from "../models/company/companyCategory.js";
import eventCategory from "../public/eventCategory.js";
import EventCategory from "../models/event/EventCategory.js";
import commissionPrice from "../public/commission.js";
import Role from "../models/Role.js";
import roles from "../public/role.js";
import commission from "../models/commission.js";


const seedRouter=Router()


seedRouter.post("/companyCategory", async (req, res) => {
    try {
      await companyCategory.deleteMany();
      await companyCategory.insertMany(categoryCompany)
  
     const dbResult=await companyCategory.find()
   
    res.status(200).send(dbResult);
    } catch (error) {
      console.error(error)
      res.status(500).send({message:"Server Error"})

    }
  
})

seedRouter.post("/eventCategory",async(req,res)=>{
    try {
      await EventCategory.deleteMany()
      await EventCategory.insertMany(eventCategory)
  
      const dbResult=await EventCategory.find()
      res.status(200).send(dbResult)
    } catch (error) {
      console.error(error)
      res.status(500).send({message:"Server Error"})

    }
  })

seedRouter.post("/price",async(req,res)=>{
  try {
    await commission.deleteMany()
    await commission.insertMany(commissionPrice)
    const price=await commission.find()
    res.status(200).send(price)
  } catch (error) {
    console.error(error)
    res.status(500).send({message:"Server Error"})
  }
})

seedRouter.post("/roles",async(req,res)=>{
  try {
    await Role.deleteMany()
    await Role.insertMany(roles)
    const role=await Role.find()
    res.status(200).send(role)
  } catch (error) {
    console.error(error)
    res.status(500).send({message:"Server Error"})
  }
})




export default seedRouter