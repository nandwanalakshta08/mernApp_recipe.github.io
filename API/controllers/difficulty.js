import { Difficulty } from "../Models/Difficulty.js";

export const createDifficulty = async (req,res)=>{
    try {
        const{name, description, type,isActive, isDeleted}=req.body;
        const newDifficulty = new Difficulty({name,description,type,isActive,isDeleted});
        const savedDifficulty = await newDifficulty.save();
        res.json(savedDifficulty);
    } catch (error) {
        res.json({message:error.message});
    }
}

export const getAllDifficulties = async(req,res)=>{
    try {
        const difficulties= await Difficulty.find({isDeleted:false});
        res.json({difficulties});
    } catch (error) {
        res.json({mesage:error.message})
    }
};

export const updateDifficulty = async(req,res)=>{
    try {
        const { name, description, type, isActive, isDeleted } = req.body;
        const updateDifficulty = await Difficulty.findByIdAndUpdate(req.params.id, {name, description, type, isActive, isDeleted },{new:true});
        if (!updateDifficulty || updateDifficulty.isDeleted) {
            return res.json({ message: 'Difficulty not found' });
          }
          res.json({updateDifficulty});
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteDifficulty = async(req, res) =>{
    try {
      const difficulty = await Difficulty.findById(req.params.id);
      if (!difficulty || difficulty.isDeleted) {
        return res.status(404).json({ message: 'Difficulty not found' });
      }
      difficulty.isDeleted = true;
      await difficulty.save();
      res.json({ message: 'Difficulty deleted successfully' });
    } catch (error) {
      res.json({ message: error.message });
    }
  };