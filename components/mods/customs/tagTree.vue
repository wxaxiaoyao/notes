<template>
	<el-tree :data="tagtree" @node-click="clickSelectTag"></el-tree>
</template>

<script>

import {
	Tree,
} from "element-ui";

import _ from "lodash";
import component from '@/components/component.js';
import tagtree from "@/lib/tags/tagtree.js";
import {tags} from "@/lib/tags";

export default {
	mixins:[component],
	components: {
		[Tree.name]: Tree,
	},

	data:function() {
		return {
			tagtree: tagtree,
		}
	},

	props: {
	},

	computed: {
		tagId() {
			return this.getData("__TAG_ID__");
		},
	},

	watch:{
		tagId: function(tagId) {
			const rootTag = g_app.getData("__ROOT_TAG__");
			this.tag = rootTag.findById(tagId);
		}
	},

	methods: {
		setTagId(tagId) {
			this.setData("__TAG_ID__", tagId);
		},

		clickSelectTag(tag) {
			if (!tag.type || !this.tag) return;

			const containerTag = this.tag.getContainerTag();
			if (!containerTag) return;

			let subtag = tags.getTag(tag.type, tag.data);
			containerTag.addTag(subtag);
			this.setTagId(subtag.tagId);
		},

		async loadSelfTag() {
			if (this.tagtree[this.tagtree.length-1].label == "自定义组件") return;
			const result = await this.api.modules.get({type:0});
			if (result.isErr()) return;

			const taglist = result.getData();

			const tree = {label:"自定义组件", children:[]};

			_.each(taglist, tag => {
				tree.children.push({
					label: tag.tagName,
					type: "tag",
					data: tag.tag,
				});
			});

			this.tagtree.push(tree);
		}
	},

	async mounted() {
		await this.loadSelfTag();
	}
}
</script>
