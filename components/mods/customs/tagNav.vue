<template>
	<el-tree
		ref="tree"
	   	:data="navtress" 
		draggable
		:allow-drag="allowDrag"
		:allow-drop="allowDrop"
		:props="treeProps" 
		:expand-on-click-node="false" 
		:highlight-current="true" 
		node-key="tagId" 
		@node-click="clickSelectTag" 
		:default-expand-all="true">
		<span :style="customTreeNodeStyle" slot-scope="{ node, data }">
			<span @click="clickSelectTag(data, node)">{{data.aliasname || data.name || data.key || data.tagName}}</span>
			<span v-show="!isRootNode(data)" class="node-btn-container">
				<i @click.stop="clickAddTag(data)" class="el-icon-plus" data-toggle="tooltip" title="添加"></i>
				<i @click.stop="clickDeleteTag(data)" class="el-icon-minus" data-toggle="tooltip" title="删除"></i>
			</span>
		</span>
	</el-tree>
</template>

<script>
import {
	Tree,
} from "element-ui";
import vue from "vue";
import component from '@/components/component.js';
import {mapActions, mapGetters} from "vuex";
import tags from "@/lib/tags";

export default {
	mixins:[component],
	components: {
		[Tree.name]: Tree,
	},

	data: function() {
		return {
			navtress:[],
			rootTag: g_app.getData("__ROOT_TAG__"),
			treeProps: {
				label:function(data, node) {
					return data.name || data.tagName;
				},
				children:"children",
			},
			customTreeNodeStyle : {
				"flex": "1",
				"display": "flex",
				"align-items": "center",
				"justify-content": "space-between",
				"font-size": "14px",
				"padding-right": "8px",
			}
		}
	},
	props: {
	},
	computed: {
		tagId() {
			return this.getData("__TAG_ID__");
		},
		rootTagId() {
			return this.getData("__ROOT_TAG_ID__");
		},
	},
	watch:{
		rootTagId: function() {
			this.rootTag = g_app.getData("__ROOT_TAG__");
			if (this.rootTag) this.navtress = [this.rootTag];
		},
		tagId: function(tagId) {
			const self = this;
			setTimeout(function() {
				self.$refs.tree.setCurrentKey(tagId);
			}, 100);
			self.tag = self.rootTag.findById(tagId);
		}
	},
	methods: {
		setTagId(tagId) {
			this.setData("__TAG_ID__", tagId);
		},
		allowDrag(draggingNode) {
			return true;
		},
		allowDrop(draggingNode, dropNode) {
			return dropNode.data.isContainerTag();
		},
		clickSelectTag(tag, node) {
			this.setTagId(tag.tagId);
		},
		isRootNode(tag) {
			if (!this.rootTag || this.rootTag.tagId == tag.tagId) {
				return true;
			}

			return false;
		},
		clickAddTag(tag) {
			const cloneTag = tags.getTagByTag(tag);
			const parentTag = tag.parentTag;
			const index = parentTag.children.findIndex(t => t.tagId === tag.tagId);			
			parentTag.children.splice(index,0, cloneTag);
		},
		clickDeleteTag(tag) {
			var parentTag = tag.parentTag;
			var index = parentTag.children.findIndex(t => t.tagId === tag.tagId);			
			parentTag.children.splice(index,1);

			let currentTag = null;
			if (index == parentTag.children.length) {
				currentTag = index > 0 ? parentTag.children[index-1] : parentTag;
			} else {
				currentTag = parentTag.children[index];
			}
			this.setTagId(currentTag.tagId);
		},
  	},

	mounted() {
		const self = this;
		self.tag = self.rootTag;
	},
}
</script>

<style scoped>
</style>
