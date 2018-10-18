import vue from "vue";
import _ from "lodash";

const PAGE_TYPE_FILE = 0;
const PAGE_TYPE_FOLDER = 1;

import mod from "@/components/mods/common/mod.js";
export default {
	mixins:[mod],

	data: function() {
		const self = this;
		return {
			pagelist:[],
			pageSettingData:{
				tags:[], 
				visible: false,
				success: o => self.submitPageSetting(o),
			},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					mode: "normal",
				};
			}
		},
	},

	computed: {
		mode() {
			return this.__data__.mode;
		},
		pages() {
			return g_app.getData("pages", {});
		},
		currentPage() {
			if (!this.currentUrl) return {};
			return this.pages[this.currentUrl] || {};
		},
	},

	methods: {
		setPageOperate(data) {
			this.emit("__page_operate__", data);
		},

		isFolder(url) {
			return _.endsWith(url, "/");
		},

		pageToNode(file) {
			const self = this;
			const url = file.url;
			const urls = url.split("/");
			const page = self.pages[url] || {};

			page.id = file.id;
			page.url = file.url;
			page.hash = file.hash;
			page.type = file.type || 0;
			page.folder = file.folder || url.substring(0, url.lastIndexOf("/", url.length-2) + 1);
			page.label = _.endsWith(url, "/") ? urls[urls.length-2] : urls[urls.length-1];
			page.username = url.substring(0, url.indexOf("/"));
			page.label = page.label.replace(/\..*$/, "");
			page.isLeaf = !_.endsWith(url, "/");
			vue.set(page, "isRefresh", false);
			vue.set(page, "isModify", file.isModify || false);

			if (!this.pages[url]) this.pagelist.push(page);

			this.pages[page.url] = page;

			return page;
		},

		async loadPageTrees() {
			const self = this;
			const visibility = this.isPrivacyMode ? 1 : 0;
			const urlPrefix = this.user.username + "/";
			const result = await this.api.pages.get({visibility, urlPrefix});
			const files = result.data || [];
			const rootnode = self.pageToNode({url: urlPrefix});
			const trees = [rootnode];
			rootnode.children = [];
			rootnode.label = "我的站点";
			self.pages[rootnode.url] = rootnode;
			_.each(files, file => {
				let urls = file.url.split("/");
				let nodes = trees;
				_.each(urls, (t, i) => {
					if (!t) return;

					const url = urls.slice(0, i + 1).join("/") + (urls.length - 1 == i ? "" : "/");
					//console.log(urls, url, i);
					const index	= _.findIndex(nodes, o => o.url == url);
					if (index < 0) {
						const page = self.pageToNode(url == file.url ? file : {url});
						page.children = [];
						nodes.push(page);
						nodes = page.children;
					} else {
						nodes = nodes[index].children;
					}
				});
			});

			const sortNode = function(node) {
				if (!node.children && node.children.length == 0) return ;

				node.children = _.orderBy(node.children, ["type", "label"], ["desc", "asc"]);
				_.each(node.children, o => sortNode(o));
			}

			sortNode(rootnode);

			this.trees = trees;
			//console.log(trees);
		},

		async clickPageSettingBtn(page) {
			const result = await this.api.pages.getSetting({id:page.id});
			const data = result.getData() || {};
			const self = this;
			this.pageSettingData = {
				tags: data.tags || [], 
				key: data.key,
				title: data.title,
				description: data.description,
				keywords: data.keywords,
				id: data.id,
				visibility: data.visibility ? true : false,
				visible: true,
				url: data.url,
				success: (obj) => {
					if (obj.visibility == data.visibility) return;
					//self.$refs.tree && self.$refs.tree.remove(obj.url);
					self.setPageOperate({url:obj.url, operate:"hide", mode: self.mode});
					self.setPageOperate({url:obj.url, operate:"add", mode: self.isPrivacyMode ? "normal" : "privacy"});
					if (obj.url == self.currentUrl) {
						self.setCurrentUrl("");
					}
				}
			};
		},

		loadPage(page, cb, errcb) {
			const self = this;
			let _loadPageFromServer = async function() {
				console.log("服务器最新");
				let result = await self.api.pages.getById({id:page.id || page.url});
				let file = result.data;
				if (result.isErr()) {
					result = await self.api.pages.create(page);
					if (result.isErr()) return errcb && errcb();
					file = result.data;
				};
				page.id = file.id;
				page.hash = file.hash;
				page.folder = file.folder;
				vue.set(page, "content", file.content || "");
				cb && cb();
			}
			g_app.pageDB.getItem(page.url).then(function(data){
				if (!data) {
					_loadPageFromServer();
					return;
				}
				if (data.hash == page.hash || page.isModify || page.hash == "session") {
					if (page.hash == "session") {
						console.log("session");
					} else if (data.hash == page.hash) {
						console.log("本地最新");
					} else {
						console.log("冲突");
					}
					//console.log(data);
					_.merge(page, data);
					cb && cb();
					return;
				} 

				_loadPageFromServer();
			}, function() {
				_loadPageFromServer();
			})
		},

		clickSelectPage(data, finishCB) {
			console.log("click select page: ", data.url, data);
			const self = this;

			if (!data.url) {
				this.setCurrentUrl("");
				finishCB && finishCB();
				return;
			}
			if (this.isFolder(data.url) || !g_app.pageDB) {
				finishCB && finishCB();
				return;
			}

			// 添加打开列表
			let page = self.pages[data.url];
			if (!page && data.url) {
				page = self.pageToNode({url: data.url});
				//if (data.content) {
					//page.content = data.content;
					//page.loaded = true;
				//}
			}

			if (page.loading) {
				console.log("页面加载中...", page.url);
				finishCB && finishCB();
				return;
			} 

			console.log("开始加载页面:", page.url);

			const finish = function(succes) {
				page.isRefresh = false;
				page.loading = false;
				page.loaded = true; // 已加载

				finishCB && finishCB();
				if (!succes) {
					self.setCurrentUrl("");
					self.$message("页面加载失败");
					window.location.hash = ""; 
					return;
				}
				window.location.hash = "#" + page.url;
				console.log("成功加载页面url:", page.url);
				self.setCurrentUrl(page.url);
				self.setCurrentContent(page.content);
			}


			page.isRefresh = true;
			page.loading = true;
			if (!page.loaded) {
				this.loadPage(page, function() {
					finish(true);
				}, function(){
					finish(false);
				});
			} else {
				console.log("页面内容已存在:", page.url);
				finish(true);
			}
		},

		async savePage() {
			if (!this.currentPage || !this.currentPage.url || !this.currentPage.isModify){
				g_app.storage.localStorageSetItem("__page__", this.currentContent);
				return;
			}

			this.currentPage.hash = util.hash(this.currentPage.content);
			this.currentPage.isRefresh = true;
			const oper = this.currentPage.id ? "update" : "create";
			const result = await this.api.pages[oper](this.currentPage);
			if (!result) {
				Message("文件保存失败");
				return;
			}
			this.currentPage.isRefresh = false;
			this.currentPage.isModify = false;
			g_app.pageDB.setItem(this.currentPage);
		},

		clickOpenBtn(data) {
			window.open(window.location.origin + "/" + data.url.replace(/\/$/, ""));
		},
	},

	mounted() {
		const self = this;
		this.on("__page_operate__", ({url, operate, mode}) => {
			if (self.mode != mode) return;
			if (operate == "hide" || operate == "delete") {
				self.$refs.tree && self.$refs.tree.remove(url);
			} else if (operate == "add") {
				const page = self.pages[url];
				const folder = url.substring(0, url.lastIndexOf("/", url.length-2) + 1);
				if (!self.$refs.tree) return;
				const node = self.$refs.tree.getNode(folder);
				node && self.$refs.tree.append(page, folder);
			}
		});
	}
}
