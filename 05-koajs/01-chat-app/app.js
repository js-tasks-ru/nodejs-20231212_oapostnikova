const path = require('path');
const Koa = require('koa');
const EventEmitter = require('events').EventEmitter;

const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let messages = [];
const ee = new EventEmitter();

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await new Promise((resolve) => {
        ee.on('push', (message) => {
            resolve(message);
        });
    });

    ctx.response.status = 200;
    next();
});

router.post('/publish', async (ctx, next) => {
    if ('message' in ctx.request.body && ctx.request.body.message.length !== 0) {
        messages.push(ctx.request.body.message);
        ee.emit('push', ctx.request.body.message);
    }

    ctx.response.status = 200;
    next();
});

app.use(router.routes());

module.exports = app;
