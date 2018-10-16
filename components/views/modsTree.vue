
<template>
	<div class=modsTreeContainer>
		<el-tabs v-model="modname" tab-position="left" @tab-click="clickTabBtn">
			<el-tab-pane v-for="(mod,index) in mods" :key="index" :label="mod.label" :name="mod.modname">
				<el-card v-for="(style, index) in mod.styles" :key="index">
					<div slot="header">
						<span>应用</span>
					</div>
					<div class="modContainer" ref="modContainer">
						<component ref="mod" :is="mod.modname" __mode__="preview" :__style__="style"></component>
					</div>
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
} from "element-ui";
import _ from "lodash";
import {mapActions, mapGetters} from "vuex";

import mods from "@/components/mods/index.js";


export default {
	components: {
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
		[Card.name]: Card,
	},

	data: function() {
		return {
			modname: "headers",
			mods: [
			//{
				//label:"头部",
				//modname: "headers",
				//styles: _.keys(mods["headers"] || {}),
			//},
			{
				label: "轮播",
				modname: "carousels",
				styles: _.keys(mods["carousels"] || {}),
			},
			{
				label: "评论",
				modname: "comments",
				styles: _.keys(mods["comments"] || {}),
			},
			],
		}
	},

	computed: {
	},

	methods: {
		modsScale() {
			const self = this;
			setTimeout(function() {
				_.each(self.$refs.modContainer, (container, index) => {
					//const scrollWidth = container.scrollWidth < 1200 ? 1200 : container.scrollWidth;
					const scrollWidth = container.scrollWidth;
					const scrollHeight = container.scrollHeight;
					const clientWidth = container.clientWidth;
					const clientHeight = container.clientHeight;
					//console.log(clientWidth, clientHeight, scrollWidth, scrollHeight);
					//if (!scrollWidth || !scrollHeight) return;

					const el = self.$refs.mod[index].$el;
					const scaleX = clientWidth / scrollWidth;
					const scaleY = clientHeight / scrollHeight;
					//console.log(el, el.style);
					el.style.transform = `scale(${scaleX}, ${scaleY})`;
					el.style.transformOrigin = "left top";
					//console.log(el.style.transform, scaleX, scaleY);
				}, 10);
			});
		},
		clickTabBtn() {
			this.modsScale();
		}
	},

	mounted() {
		//this.modsScale();
	}
}
</script>

<style lang="less" scoped>
.modContainer {
	height: 120px;
}

.modsNavContainer {
	width: 100px;
	padding-left: 0px !important;
	text-align: center;
	border-right: 1px solid gray;

	li {
		list-style-type: none;
		cursor: pointer;
	}

	li:hover {
		background-color: gray;
	}
}
</style>
