const multer = require('multer');
const uuid = require('uuid');

const FILE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

module.exports = (destination = "") => multer({
     storage: multer.diskStorage({
        destination: (req, file, callback) => {
            console.log(file);
            callback(null, process.env.STATIC_PATH_IMG + "/" + destination);
        },
        filename: (req, file, callback) => {
            const name = uuid.v4();
            const extension = FILE_TYPES[file.mimetype];
            callback(null, name + '.' + extension);
        }
    }) 
}).single('image');