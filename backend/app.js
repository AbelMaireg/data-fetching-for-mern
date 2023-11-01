const express = require('express');
const app = express();
app.use(express.json());

const { router1 } = require('./routes/route');
app.use('/q&a/api', router1);

const RouterUser = require('./routes/userRoutes');
app.use('/app/user', RouterUser);

const RouterQuestion = require('./routes/questionRoutes');
app.use('/app/question', RouterQuestion);

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});