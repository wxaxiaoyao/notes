const pkg = require('./package')
const path = require("path");
const webpack = require("webpack");
const config = require("./server/.config.js");

const baseDir = path.resolve(".");
//console.log(path.resolve(__dirname, "client/pages/note/userpage.vue"));
const pagepath = "pages/";

module.exports = {
	mode: 'universal',

	render: {
		resourceHints: false,
	},

	env: {
		ENV:config.ENV || process.env.NODE_ENV,
	},

	router: {
		extendRoutes(routes) {
			routes.push({
				name: "notfound",
				path:"/note/:path*",
				component: path.resolve(__dirname, pagepath + "note/notfound.vue"),
			});
			routes.push({
				name: "tagpage",
				path:"/tag/:username/:tagname*",
				component: path.resolve(__dirname, pagepath + "note/tagpage.vue"),
			});
			routes.push({
				name: "userpage",
				path:"/:username/:sitename/:pagepath+",
				component: path.resolve(__dirname, pagepath + "_user/userpage.vue"),
			});
		},
	},

	/*
  	** Headers of the page
  	*/
  	head: {
		title: 'note',
  	  	meta: [
			{ charset: 'utf-8' },
  	  	  	{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
  	  	  	{ hid: 'keywords', name: 'keywords', content: 'note, 笔记, 建站, site, 办公, 创作, 分享'},
  	  	  	{ hid: 'description', name: 'description', content: 'note是一个在线记笔记产品, 基于此原型扩展出的功能有多人编辑，协同办公和自助建站等, 我们可以用它记录生活各种感悟以及工作学习的总结, 并以网页的形式分享给它人.'},
  	  	],
		script: [
			
		],
  	  	link: [
			{ rel: "stylesheet", href: "http://at.alicdn.com/t/font_654450_aps05vwxpz.css"},
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  	  	],
  	},

	/*
	** Customize the progress-bar color
	*/
	loading: { color: '#fff' },

	/*
	** Global CSS
	*/
	css: [
	  '~assets/css/main.css',
	  '~assets/css/theme.scss',
	  'element-ui/lib/theme-chalk/index.css'
	],

	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
	  {src:"~/plugins/init"},
	  {src:"~/plugins/client", ssr: false},
	  {src:"~/plugins/authenticate", ssr: false},
	  {src:"~/plugins/element-ui"},
	],

	/*
	** Nuxt.js modules
	*/
	//modules: [
	  //// Doc: https://github.com/nuxt-community/axios-module#usage
	  //'@nuxtjs/axios'
	//],
	/*
	** Axios module configuration
	*/
	//axios: {
	  //// See https://github.com/nuxt-community/axios-module#options
	//},

	/*
	** Build configuration
	*/
	build: {
	  	/*
	  	** You can extend webpack config here
	  	*/
		babel: {
			//presets:[
				//"env",
			//],
			//plugins:[
				//"syntax-dynamic-import",
				//[
					//"component",
					//{
						//libraryName:"element-ui",
						//styleLibraryName:"theme-chalk",
					//},
					//'transform-async-to-generator',
					//'transform-runtime',
				//],
			//],
		},
	  	extend(config, ctx) {
			config.resolve.alias["vue$"] = "vue/dist/vue.esm.js";
	  	}
	}
}
