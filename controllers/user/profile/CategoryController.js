class CategoryController{
    index = async (req,res) => {
        res.render('profile/category',{ layout: 'profile', title: "Categories", user:req.user})
    }
}


export default new CategoryController();