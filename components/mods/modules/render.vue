
<template>
	<templates class="markdown-body" :__style__="__data__.templateStyle" :__default_data__="__data__.templateData">
		<div v-for="(block, index) in blocks" :key="index" :ref="index">
			<component 
				:is="block.name" 
				:__mode__="mode"
				:__style__="block.style"
				:__key__="block.key"
				:__default_data__="block.data">
			</component>
		</div>
		<a href="#" class="quickToTop" v-if="showQuickToTop">
			<div class="toTopIcon"></div>
			<div class="topText">TOP</div>
			<div class="hoverWrap">
				<div class="hoverText">返回顶部</div>
			</div>
		</a>
	</templates>
</template>

<script>
import _ from "lodash";
import vue from "vue";

import {markdownEx} from "@/lib/markdown";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],
	data: function() {
		return {
			showQuickToTop: false,
			blocks: [],
			md: markdownEx(),

			defaultData: {
				text: "",
				template: false,
				templateStyle:"index",
				templateData:{},
				mode: "normal",
			}
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
				}
			}
		}
	},

	computed: {
		currentLine() {
			return this.getData("__current_line__") || 0;
		},
		mode() {
			return this.__data__.mode || "normal";
		},
		text() {
			return this.__data__.text || "";
		},
		template() {
			return this.__data__.template || false;
		},
	},

	watch: {
		text: function(val) {
			this.parseText(val);
		},
		currentLine: function(line) {
			this.scrollToView(line);
		}
	},

	methods: {
		scrollToView(line) {
			let index = _.findIndex(this.blocks, o => line < o.end);
			index = index < 0 ? this.blocks.length -1 : index;
			let block = this.blocks[index];
			let el = this.$refs[index] && this.$refs[index][0];
			if (!el) return;
			//console.log(this, this.$refs, this.$refs[index]);
			//console.log(block, el, el.scrollHeight, el.children);
			if (block.name != "markdowns" || el.scrollHeight < window.innerHeight - 100) return el.scrollIntoView(false);
			const tokens = this.md.md.parse(block.text);
			line = line - block.start;
			index = _.findIndex(tokens, o => line < o.end);
			index = index < 0 ? tokens.length -1 : index;
			
			const children = this.mode == "editor" ? el.children[0].children : el.children;
			el = index < children.length ? children[index] : children[children.length - 1];
			return el.scrollIntoView(false)
		},

		parseText(text = "") {
			const self = this;
			const mods = g_app.mods;
			const md = this.md;
			const blocklist = md.parse(text);
			const blocks = [];
			const modData = {};
			const blockData = {};

			_.each(blocklist, (block, index) => {
				const cmdName = _.camelCase(block.cmdName);
				const name = mods[cmdName] ? cmdName : "markdowns";
				const key = name + '-' + index;
				const style = block.styleName;
				const isExistMod = mods[cmdName] ? true : false;

				const tmp = {
					key: key,
					name: name,
					style: style,
					text: block.text,
					start: block.token.start,
					end: block.token.end,
					data: block.modParams,
				};

				if (!isExistMod) {
					tmp.name = "markdowns";
					tmp.style = "default";
				}

				if (tmp.name == "markdowns" && tmp.style == "default") tmp.key = undefined;

				blocks.push(tmp);
			
				modData[key] = tmp.data;
				blockData[key] = tmp;
			});
			self.setModsData(modData);

			self.blocks = blocks;
			//console.log(self.blocks);
			self.templateBlock = md.template;
			self.setShareData("blockData",_.cloneDeep(blockData));
			
			//console.log(blocklist);
		},
		currentPageYOffset(){
			this.showQuickToTop = window.pageYOffset > 2160 ? true : false;
		}
		
	},

	beforeDestroy(){
		window.removeEventListener('scroll',this.currentPageYOffset)
	},

	mounted() {
		window.addEventListener('scroll',this.currentPageYOffset)
		this.parseText(this.text);
	},
}
</script>

<style lang="scss" scoped>
.quickToTop {
  height: 56px;
  width: 56px;
  box-shadow: 0px 0px 2px #fff,0px 0px 2px #fff;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  text-align: center;
  background-color: #fff;
  text-decoration: none;
  color: #303133;

  .toTopIcon {
    width: 12px;
    height: 12px;
    border: 2px solid ;
    border-right-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(45deg);
    position: absolute;
    left: 20px;
    top: 8px;
  }

  .topText {
    margin-top: 28px;
  }
  .hoverWrap {
    display: none;

    .hoverText {
		width: 100%;
		height: 100%;
		color: #fff;
		position: absolute;
		left: 10px;
		width: 35px;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
  }

  &:hover{
    background-color: #0075b4;
    box-shadow: 0px 0px 2px #0075b4,0px 0px 2px #0075b4;
    .toTopIcon{
      display: none;
    }
    .topText{
      display: none;
    }
    .hoverWrap{
      display: block;
    }
  }
}
</style>
