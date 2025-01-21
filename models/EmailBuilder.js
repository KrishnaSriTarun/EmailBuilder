const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailBuilderSchema = new Schema({
      templateName: {
            type: String, 
            required: true,
            trim: true,
      },
      configurations: {
            title: {
                  type: String,
                  default: '',
            },
            content: {
                  type: String,
                  default: '',
            },
            footer: {
                  type: String,
                  default: '',
            },
            imageUrls: {
                  type: [String],
                  default: [],
            },
      },
});


module.exports = mongoose.model('EmailTemplate', emailBuilderSchema);
