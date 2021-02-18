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

/**
 * Load character and append to req.
 */
const characterByID = async (req, res, next, id) => {
  try {
    let character = await Character.findById(id).populate('user', '_id name');
    if (!character)
      return res.status('400').json({
        error: 'Character not found',
      });
    req.character = character;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve character',
    });
  }
};

const read = (req, res) => {
  req.character.image = undefined;
  return res.json(req.character);
};

const list = async (req, res) => {
  try {
    let characters = await Character.find().select(
      'name email updated created'
    );
    res.json(characters);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded',
      });
    }
    let character = req.character;
    character = extend(character, fields);
    if (fields.missions) {
      character.missions = JSON.parse(fields.missions);
    }
    character.updated = Date.now();
    if (files.image) {
      character.image.data = fs.readFileSync(files.image.path);
      character.image.contentType = files.image.type;
    }
    try {
      await character.save();
      res.json(character);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    let character = req.character;
    let deleteCharacter = await character.remove();
    res.json(deleteCharacter);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByUser = (req, res) => {
  Character.find({ user: req.profile._id }, (err, characters) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(characters);
  }).populate('user', '_id name');
};

const photo = (req, res, next) => {
  if (req.character.image.data) {
    res.set('Content-Type', req.character.image.contentType);
    return res.send(req.character.image.data);
  }
  next();
};
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage);
};

export default {
  create,
  characterByID,
  read,
  list,
  remove,
  update,
  listByUser,
  photo,
  defaultPhoto,
};
