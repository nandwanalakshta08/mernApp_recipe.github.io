import { Cuisine } from "../Models/Cuisine.js";

export const createCuisine = async (req, res) =>{
    try {
        const { name, description, type, isActive, isDeleted } = req.body;
        const newCuisine = new Cuisine({ name, description, type, isActive, isDeleted });
        const savedCuisine = await newCuisine.save();
        res.json(savedCuisine);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const getAllCuisines = async (req, res) => {
    try {
        const cuisines = await Cuisine.find({ isDeleted: false });
        res.json({ cuisines });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateCuisine = async (req, res) => {
    try {
        const { name, description, type, isActive, isDeleted } = req.body;
        const updatedCuisine = await Cuisine.findByIdAndUpdate(req.params.id, { name, description, type, isActive, isDeleted }, { new: true });
        if (!updatedCuisine || updatedCuisine.isDeleted) {
            return res.json({ message: 'Cuisine not found' });
        }
        res.json(updatedCuisine);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const deleteCuisine = async (req, res)=> {
    try {
        const cuisine = await Cuisine.findById(req.params.id);
        if (!cuisine || cuisine.isDeleted) {
            return res.status(404).json({ message: 'Cuisine not found' });
        }
        cuisine.isDeleted = true;
        await cuisine.save();
        res.json({ message: 'Cuisine deleted successfully' });
    } catch (error) {
        res.json({ message: error.message });
    }
};
