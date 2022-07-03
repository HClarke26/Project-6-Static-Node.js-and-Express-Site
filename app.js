const express = require('express');
const { projects } = require('./data.json');
const app = express();


app.use(express.json());


app.set('view engine', 'pug');
app.use('/static', express.static('public'));


app.get('/', (req, res, next) => {
    res.render('index', { projects });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/projects/:id', (req, res, next) => {
    const id = req.params.id;
    const project = projects[id];
        if (project) {
            res.render('project', { project });
    } else {
            const err = new Error;
            err.status = 404
            err.message = `Project ${id} does not exist`;
            next(err);
        }
});

app.get('/error', (req, res, next) => {
    const err = new Error();
    err.message = 'Custom 500 error thrown'
    err.status = 500;
    throw err;
});


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) =>{

 
    if(err.status === 404) {
        console.log("The 404 Error Handler Has Been Called");
        res.status(404).render('page-not-found', { err });
    } else {
        console.log("The 500 Error Handler Has Been Called");
        res.status(err.status || 500).render('error', { err });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Application is now running on local host port: ${port}`)
});