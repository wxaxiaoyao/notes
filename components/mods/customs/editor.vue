<template>
	<div class="flex-container">
		<el-container>
			<el-aside>
				<taglist></taglist>
			</el-aside>
			<el-container direction="vertical">
				<el-main class="border clearPadding" style="cursor:pointer;">
					<tag :tag="rootTag" mode="editor"></tag>
				</el-main>
				<el-container style="height:400px; flex:none">
					<el-aside class="border">
						<tagNav></tagNav>
					</el-aside>
					<el-container>
						<tagEdit></tagEdit>
					</el-container>
				</el-container>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import {
	Button,
	Container,
	Header,
	Aside,
	Main,
	Footer,
	Form,
	FormItem,
	Input,
	Tabs,
	TabPane,
	Message,
} from "element-ui";

import {mapActions, mapGetters} from "vuex";
import {tags} from "@/lib/tags";
import tag from "./tag.js";
import tagNav from "./tagNav.vue";
import tagEdit from "./tagEdit.vue";
import tagTree from "./tagTree.vue";
import taglist from "./taglist.vue";
import component from '@/components/component.js';

export default {
	mixins:[component],
	components: {
		[Button.name]: Button,
		[Container.name]:Container,
		[Header.name]:Header,
		[Aside.name]:Aside,
		[Main.name]:Main,
		[Footer.name]:Footer,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Input.name]: Input,
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,

		tagNav,
		tagEdit,
		tagTree,
		tag,
		taglist,
	},

	data: function() {
		return {
			rootTag: g_app.getData("__ROOT_TAG__"),
		}
	},

	props: {
		tag: {
			type: Object,
			default: function() {
				return tags.getTag();
			}
		}
	},

	computed: {
		rootTagId() {
			return this.getData("__ROOT_TAG_ID__");
		},
	},

	watch: {
		rootTagId: function() {
			this.rootTag = g_app.getData("__ROOT_TAG__");
		},
	},

	methods: {
		...mapActions({
		}),
		setTagId(tagId) {
			this.setData("__TAG_ID__", tagId);
		},
		setRootTagId(tagId) {
			this.setData("__ROOT_TAG_ID__", tagId);
		}
	},

	mounted() {
		this.rootTag = this.tag;
		g_app.setData("__ROOT_TAG__", this.tag);
		this.setTagId(this.rootTag.tagId);
		this.setRootTagId(this.rootTag.tagId);
	}
}
</script>

<style scoped>
html, body {
	height:100%;
	width:100%;
	margin: 0px;
	padding: 0px;
}
.flex-container {
	height:100%;
	width:100%;
	display: flex;
}
.mainContainer {
	display: flex;
	height: 100%;
	flex-direction: column;
}
.clearPadding {
	padding: 0px;
}
.border {
	border: 4px solid gray;
}
</style>
