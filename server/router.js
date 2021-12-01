const Router = require('express');
const roomController = require('./controllers/roomController');
const userController = require('./controllers/userController');

const router = new Router();

router.post('/join', roomController.createRoom);
router.post('/registration', userController.registration);
router.get('/getuser', userController.getUser);

module.exports = router;