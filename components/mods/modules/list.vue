
<template>
	<div class=modules-list-container>
		<el-tabs tab-position="left">
			<el-tab-pane v-for="(mod, index) in mods" :key="index" :label="mod.label">
				<el-card v-for="(style, index) in mod.styles" :key="index">
					<div slot="header">
						<span>{{mod.label + '-' + style.label}}</span>
						<span>预览</span>
					</div>
					<el-popover placement="right" trigger="hover" :width="style.width || 1200">
						<component :is="mod.modname" __mode__="preview" :__style__="style.stylename"></component>
						<div slot="reference" class="card-body">
							{{style.description || "默认样式"}}
						</div>
					</el-popover>
				</el-card>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import {
	Tabs,
	TabPane,
	Card,
	Popover,
} from "element-ui";
import _ from "lodash";

import common from "./common.js";

export default {
	mixins: [common], 

	components: {
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
		[Card.name]: Card,
		[Popover.name]: Popover,
	},

	data: function() {
		return {
		}
	},

	computed: {
	},

	methods: {
	},

	mounted() {
	}
}
</script>

<style lang="less" scoped>
.modules-list-container {
	width: 300px;
}
.card-body {
	cursor:pointer;
}
</style>
