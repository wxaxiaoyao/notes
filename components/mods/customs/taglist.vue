<template>
	<el-tabs class="taglistContainer" type="border-card" style="height:100%; border:none">
		<el-tab-pane label="组件">
			<tagTree></tagTree>
		</el-tab-pane>
		<el-tab-pane label="页面">
			<el-tree :data="pagetrees" :props="pagetreeOptions">
				<span class="tagpage-item" slot-scope="{node, data}">
					<span>{{data.label}}</span>
					<span class="tagpage-item__btn-group" v-if="data.root">
						<i @click.stop="clickRefreshBtn()" class="iconfont icon-refresh" aria-hidden="true" data-toggle="tooltip" title="刷新"></i>
					</span>
					<span class="tagpage-item__btn-group" v-if="node.level>1">
						<i @click.stop="clickOpenBtn(data)" class="iconfont icon-open" aria-hidden="true" data-toggle="tooltip" title="访问"></i>
						<i @click.stop="clickEditBtn(data)" class="iconfont icon-edit" aria-hidden="true" data-toggle="tooltip" title="编辑"></i>
						<i @click.stop="clickDeleteBtn(data)" class="iconfont icon-delete" aria-hidden="true" data-toggle="tooltip" title="删除"></i>
					</span>
				</span>
			</el-tree>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
import {
	Tabs,
	TabPane,
	Tree,
} from "element-ui";

import component from '@/components/component.js';
import {tags} from "@/lib/tags";
import tagTree from "./tagTree.vue";

export default {
	mixins:[component],
	components: {
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
		[Tree.name]: Tree,

		tagTree,
	},

	data: function() {
		return {
			tagpages: [],
			pagetrees: [],
			pagetreeOptions: {
			}
		}
	},

	methods: {
		setTagId(tagId) {
			this.setData("__TAG_ID__", tagId);
		},
		async loadTagPages() {
			const result = await this.api.tags.get({type:1});
			if (result.isErr()) return;
			const list = result.getData();
			const pagetrees  = [];
			_.each(list, val =>{
				pagetrees.push({
					label: val.tagName,
					tag: val.tag,
				});
			});

			this.pagetrees = [
			{
				label: "我的页面",
				root: true,
				children: pagetrees,
			},
			{
				label: "回收站",
			}
			];
		},

		clickRefreshBtn() {
			this.loadTagPages();
		},

		clickOpenBtn(tag) {
			const username = this.user.username;
			window.open(window.location.origin + "/tag/" + username + "/" + tag.tagName);
		},

		clickEditBtn(tag) {
			const roottag = tags.getTagByTag(tag.tag);
			g_app.setData("__ROOT_TAG__", roottag);
			const tagId = roottag.tagId;
			this.setData("__TAG_ID__", tagId);
			this.setData("__ROOT_TAG_ID__", tagId);
		},

		async clickDeleteBtn(tag, index) {
			await this.api.tags.delete({id:tag.id});
			this.tagpages.splice(index,1);
		}
	},

	mounted() {
		//this.loadTagPages();
	}
	
}
</script>

<style>
.tagpage-item {
	flex:1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}

.tagpage-item:hover {
	cursor:pointer;
	background-color:rgb(247,245,250);
}

.tagpage-item__btn-group {
	display:none;
}

.tagpage-item:hover .tagpage-item__btn-group {
	display: inline;
}
</style>
