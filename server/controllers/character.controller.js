import Character from '../models/character.model';
import errorHandler from '../helpers/dbErrorHandler';

const create = async (req, res) => {
  const character = new Character(req.body);
  try {
    await character.save();
    return res.status(200).json({
      message: 'Character created successfully!',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
};
