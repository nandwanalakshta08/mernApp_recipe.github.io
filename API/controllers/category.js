import { Category } from "../Models/Category.js";

export const createCategory = async(req,res)=>{
    try {
        const { name, description, type, isActive, isDeleted } = req.body;
        const newCategory = new Category({ name, description, type, isActive, isDeleted });
        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getAllCategories = async (req, res) =>{
    try {
        const categories = await Category.find({ isDeleted: false });
        res.json({ categories });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateCategory = async (req, res) =>{
    try {
        const { name, description, type, isActive, isDeleted } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name, description, type, isActive, isDeleted }, { new: true });
        if (!updatedCategory || updatedCategory.isDeleted) {
            return res.json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.json({ message: error.message });
    }
};


export const deleteCategory = async (req, res) =>{
    try {
        const category = await Category.findById(req.params.id);
        if (!category || category.isDeleted) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.isDeleted = true;
        await category.save();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.json({ message: error.message });
    }
};

//find and findOne