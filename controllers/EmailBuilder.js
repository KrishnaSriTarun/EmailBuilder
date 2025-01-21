const EmailTemplate = require('../models/EmailBuilder');
const upload = require('../cloudConfig');
module.exports.getEmailLayout = async (req, res) => {
      // Fetch all templates from the database
      const templates = await EmailTemplate.find({});
      // Render the email builder page with all templates fetched from the database
      res.render('index', { templates });
}
module.exports.createEmailTemplate = async (req, res) => {
      // console.log(req.body);
      res.render('new');
}
module.exports.saveEmailTemplate = async (req, res) => {
      try {
            const imageUrls = req.files ? req.files.map(file => file.path) : [];
            const { templateName, title, content, footer } = req.body;
            const newTemplate = new EmailTemplate({
                  templateName,
                  configurations: {
                        title,
                        content,
                        footer,
                        imageUrls,
                  },
            });
            await newTemplate.save();
            console.log(newTemplate);
            res.redirect('/home');
      } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating the template.');
      }
}
module.exports.viewEmailTemplate = async (req, res) => {
      const template = await EmailTemplate.findById(req.params.id);
      res.render('template', { template });
}
module.exports.edit = async (req, res) => {
      const template = await EmailTemplate.findById(req.params.id);
      res.render('edit', { template });
}
module.exports.update = async (req, res) => {
      const id = req.params.id;
      const { title, content, footer } = req.body;
      const imageFiles = req.files; 
      await EmailTemplate.findByIdAndUpdate(id, {
            configurations: {
                  title,
                  content,
                  footer,
                  imageUrls: imageFiles ? imageFiles.map(file => file.path) : [],
            },
      });
      console.log({ title, content, footer, imageFiles });
      res.redirect('/templates');
}
module.exports.delete = async (req, res) => {
      await EmailTemplate.findByIdAndDelete(req.params.id);
      res.redirect('/templates');
}
module.exports.downloadPdf = async (req, res) => {
      const templateId = req.params.templateId;
      const template = await EmailTemplate.findById(templateId);
      const templatePath = path.join(__dirname, 'views', 'template.ejs');
      try {
            const htmlContent = await new Promise((resolve, reject) => {
                  ejs.renderFile(templatePath, {
                        template: template,
                  }, (err, str) => {
                        if (err) reject(err);
                        else resolve(str);
                  });
            });
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'load' });
            const pdfBuffer = await page.pdf({
                  format: 'A4',
                  printBackground: true,
            });
            await browser.close();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="EamilLayout.pdf"`);
            res.end(pdfBuffer);
      } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).send('Error generating PDF');
      }
}