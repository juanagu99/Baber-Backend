const mongoose = require('mongoose');

exports.conect = async (route) => {
  await mongoose.connect(route, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
  })
  .then(resolve => {
    console.log('db connect');
  })
  .catch(reject => {
    console.log('db error');
  })
}