const express = require('express');
const router = express.Router();
const { add, index, view, update, deleteData, deleteMany } = require('./meeting');
const auth = require('../../middelwares/auth');

router.use(auth);

// Routes for meetings 
router.post('/', add);
router.get('/', index);
router.get('/:id', view);
router.put('/:id', update);
router.delete('/:id', deleteData);
router.post('/deleteMany', deleteMany);

module.exports = router;