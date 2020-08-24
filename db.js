require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    dbName: 'heroku_2r3svjw0'
});
mongoose.set('useCreateIndex', true);
