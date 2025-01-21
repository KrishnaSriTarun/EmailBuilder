const express = require('express');

const router = express.Router();
const upload = require('../cloudConfig');
const EmailTemplate = require('../models/EmailBuilder');
const EmailBuilder = require('../controllers/EmailBuilder');

router.get('/getEmailLayout', EmailBuilder.getEmailLayout);
router.get('/uploadImage', EmailBuilder.createEmailTemplate);
router.post('/template/create',upload.array('imageUrls'), EmailBuilder.saveEmailTemplate);
router.get('/uploadEmailConfig/:id', EmailBuilder.viewEmailTemplate);
router.get('/template/edit/:id', EmailBuilder.edit);
router.post('/template/update/:id', upload.array('images'), EmailBuilder.update);
router.post('/template/delete/:id', EmailBuilder.delete);
router.get('/renderAndDownloadTemplate/:templateId', EmailBuilder.downloadPdf);
module.exports = router;
