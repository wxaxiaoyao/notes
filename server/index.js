const Koa = require('koa');
const jwt = require("koa-jwt");
const { Nuxt, Builder } = require('nuxt');
const axios = require("axios");
const _ = require("lodash");
const shell = require("shelljs");

const nuxtConfig = require('../nuxt.config.js');
const config = require("./.config.js");

console.log(process.env.ENV, "-------server-----");

// 文件资源重定向
async function urlRedirect(ctx) {
	if (!g_app) return;

	const path = ctx.request.path;
	const result = await g_app.api.files.rawurl({key: path.substring(1)});
	if (result.isErr()) {
		console.log(result);
		return ctx.throw(404);
	}
	
	let url = result.data;
	const querystring = ctx.request.querystring;
	const index = url.indexOf("?");
	if (index == url.length) url += querystring; 
	else if (index < 0) url += "?" + querystring;
	else url += "&" + querystring;

	ctx.redirect(url);
}

async function pushCode() {
	const cmd_str = "git reset --hard HEAD; git pull origin master;npm install; npm run build; pm2 restart note";
	shell.exec(cmd_str);
}

async function pushServerCode() {
	const cmd_str = "cd ../notes-server; git reset --hard HEAD; git pull origin master; npm install; pm2 restart note-server";
	shell.exec(cmd_str);
}

async function pushNotesMobileCode() {
	const cmd_str = "cd ../notes-mobile; git reset --hard HEAD; git pull origin master";
	shell.exec(cmd_str);
}

async function pushMagicCubeCode() {
	const cmd_str = "cd ../magic-cube; git reset --hard HEAD; git pull origin master; npm install; npm run build; pm2 restart magic-cube";
	shell.exec(cmd_str);
}

async function start () {
	const app = new Koa();
	
	// Import and Set Nuxt.js options
	nuxtConfig.dev = !(app.env === 'production');
	
	// Instantiate nuxt.js
	const nuxt = new Nuxt(nuxtConfig);
	
	// Build in development
	if (nuxtConfig.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	}
	
	app
	.use(jwt({
		secret:config.secret, 
		passthrough:true, 
		cookie:"token", 
		tokenKey:"token"}));

	app.use(async (ctx, next) => {
		const path = ctx.request.path;
		const method = ctx.request.method;

		if (path == "/note/push_code") {
			ctx.status = 200;
			ctx.body = "OK";
			pushCode();
			return;
		} else if (path == "/note/push_server_code") {
			ctx.status = 200;
			ctx.body = "OK";
			pushServerCode();
			return;
		} else if (path == "/note/push_notes_mobile_code") {
			ctx.status = 200;
			ctx.body = "OK";
			pushNotesMobileCode();
			return;
		} else if (path == "/note/push_magic_cube_code") {
			ctx.status = 200;
			ctx.body = "OK";
			pushMagicCubeCode();
			return;
		}
		if (method.toUpperCase() != "GET" || _.startsWith(path, "/api/")) {
			ctx.status = 404;
			ctx.body = "Not Found";
			return;
		}

		const excludeList = [
			"/_",
			"/favicon.ico",
			"/_nuxt/",
			"/static/",
		];

		if (path.split("/").length < 3 || path.substring(path.lastIndexOf("/")).indexOf(".") < 0) {
			return await next();
		}

		for (let i = 0; i < excludeList.length; i++) {
			if (path.indexOf(excludeList[i]) == 0) {
				return await next();
			}
		}

		console.log("文件:", path);
		await urlRedirect(ctx);
	});

	app.use(async (ctx, next) => {
		await next();
		ctx.status = 200 // koa defaults to 404 when it sees that status is unset
		return new Promise((resolve, reject) => {
			ctx.res.on('close', resolve);
			ctx.res.on('finish', resolve);
			ctx.req.ctx = ctx;
			nuxt.render(ctx.req, ctx.res, promise => {
				// nuxt.render passes a rejected promise into callback on error.
				promise.then(resolve).catch(reject);
			});
		});
	});
	
	const host = config.host || '0.0.0.0';
	const port = config.port || 3000;

	app.listen(port, host);
	console.log('Server listening on ' + host + ':' + port);
}

start();
