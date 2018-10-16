<template>
	<div class="pagenavs-container container">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="userRoute">{{username}}</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(path, index) in paths" :key="index" v-if="index != 0">
				<el-popover trigger="hover" @show="showPathItems(index)" v-loading="itemsLoading && pathIndex == index" v-model="isShowPopover[index]">
					<ul class="path-items-container">
						<li class="path-item-container" v-for="(x, i) in items[index]" :key="i" @click="clickPathItem(x, index)">{{x.name}}</li>
					</ul>
					<span slot="reference" style="cursor:pointer">{{path || "+"}}</span>
				</el-popover>
			</el-breadcrumb-item>
		</el-breadcrumb>
		<a v-if="url != '/临时页'"class="iconfont icon-open open-url" :href="url" style="cursor:pointer" target="_blank"></a>
	</div>
</template>

<script>
import {
	Breadcrumb,
	BreadcrumbItem,
	Popover,
} from "element-ui";
import _ from "lodash";
import common from "./common.js";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod, common],
	components: {
		[Breadcrumb.name]:Breadcrumb,
		[BreadcrumbItem.name]:BreadcrumbItem,
		[Popover.name]: Popover,
	},
	props: {
		__data_type__: {
			type:Object, 
			default: function() {
				return {
				}
			}
		},
		__default_data__: {
			type: Object,
			default: function() {
				return {
					path:"临时页",
				}
			}
		},
	},

	data: function() {
		return {
			userRoute: {name:"user", params:{user:"",}},
			username:"",
			pathIndex:-1,
			paths:[],
			items:[],
			isShowPopover:[],
			itemsLoading:false,
			pages:{},
			url:null,
		}
	},
	
	methods: {
		parsePath(path) {
			const self = this;
			path = path || decodeURIComponent(self.$route.path.substring(1));
			self.paths = path.split("/");
			self.username = self.paths[0];
			self.userRoute.params.user = self.username;
			self.items = _.fill(Array(self.paths.length), undefined);
			self.isShowPopover = _.fill(Array(self.paths.length), false);
			self.__data__.path = path;

			if (_.endsWith(path, "/")) self.url = undefined;
			else self.url = "/" + path;
		},

		async showPathItems(index) {
			if (index == 0) return;
			if (this.items[index]) return;

			const paths = this.paths.slice(0, index);
			const url = paths.join("/") + "/";

			if (this.pages[url]) return this.items.splice(index, 1, this.pages[url]);

			this.itemsLoading = true;
			this.pathIndex = index;
			let pages = await this.api.pages.get({folder:url});
			pages = pages.data || [];
			if (pages.length == 0) return;
			_.each(pages, page => {
				const urls = page.url.split("/");
				const name = urls[urls.length-1] || urls[urls.length-2];
				page.name = name;
			});
			this.pages[url] = pages;
			//this.items[index] = pages;
			this.items.splice(index, 1, pages);
			//console.log(this.items, index);
			this.itemsLoading = false;
		},

		clickPathItem(page, index){
			const paths = _.slice(this.paths, 0, index+1);

			paths[index] = page.name;
			if (_.endsWith(page.url, "/")) {
				this.parsePath(paths.join("/") + "/");
				this.showPathItems(index);
			} else {
				const url =  paths.join("/");
				//console.log(url);
				this.setData("__currentUrl__", url);
			}
			this.isShowPopover[index] = false;
		}
	},

	mounted() {
		this.parsePath(this.__data__.path);
	}
}
</script>

<style scoped>
.el-breadcrumb__item {
	cursor:pointer;
}
.pagenavs-container {
	padding: 10px 0px;
	display:flex;
}
.open-url {
	cursor:pointer;
	padding-left:10px;
	text-decoration: none;
}
.path-items-container {
	list-style-type: none;
	max-height: 200px;
	overflow-y: auto;
	margin:0px;
	padding:0px;
}
.path-items-container::-webkit-scrollbar {
	width:10px;
	height:1px;
}
.path-items-container::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0.2);
	background-color: #535353;
}
.path-items-container::-webkit-scrollbar-track {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0.2);
	background-color: #EDEDED;
}
.path-item-container {
    list-style: none;
    height: 36px;
    line-height: 36px;
    color: #909399;
    cursor: pointer;
    font-size: 14px;
    text-overflow: ellipsis;
	text-align:center;
}
.path-item-container:hover {
    background-color: #e5f2f8;
    color: #0081ba;
}
</style>
