const mongoose = require('mongoose');
//connection logic
mongoose.connect(process.env.CONN_STRING);

const db = mongoose.connection;
db.on('connected', () => {
    console.log('DB Connected Successfully'); 

})
db.on('err',() => {
    console.group('DB Connection failed');
})

module.exports = db;