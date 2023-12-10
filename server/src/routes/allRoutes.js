const { Router } = require('express');

const tasks = require('./tasks/router');
const root = require('./root/router');
const users = require('./users/router');

const allRouters = new Router();

allRouters.use('/', root);
allRouters.use('/users', users);
allRouters.use('/tasks', tasks);

module.exports = allRouters;
