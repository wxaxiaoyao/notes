
<template>
	<div>
		<div v-for="(header, index) in headers" :key="index" v-if="isShow(header)" class="headerContainer" :class="classes(header, index)">
			<a @click="clickHeaderBtn(header, index)" :href='"#" + header.text'>{{header.text}}</a>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import md from "@/lib/markdown";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],
	data: function() {
		return {
			headers:[],
			index:null, // 当前激活项
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					text: "",
					startLevel:1,
					endLevel:6,
					list: [
					{
						text:"标题",
						level:2,
					},
					{
						text:"子标题",
						level:3,
					},
					],
				}
			}
		},
	},

	computed: {
		text() {
			return this.getData("__currentContent__") || this.__data__.text || "";
		}
	},

	//watch: {
		//text: function() {
			//this.headersFunc();
		//}
	//},

	methods: {
		headersFunc() {
			const text = this.text;
			if (!text) {
				this.headers = this.__data__.list;
				return ;
			} 

			const tokens = md.md.parse(text);
			const headers = tokens.filter(token => /^[hH][1-6]$/.test(token.tag));
			//console.log(tokens, headers);;
			const navlist = [];
			_.each(headers, header => {
				navlist.push({
					level: _.toNumber(header.tag.substring(1)),
					text: header.content,
				});
			})
			//console.log(navlist);
			this.headers = navlist;
			return ;
		},

		isShow(header) {
			const level = header.level;
			const startLevel = this.__data__.startLevel;
			const endLevel = this.__data__.endLevel;
			if (startLevel <= level && level <= endLevel) {
				return true;
			}
			return false;
		},
		classes(header, index) {
			return "h" + header.level + (this.index == index ? " active" : "");
		},
		clickHeaderBtn(header, index) {
			this.index = index
		},
	},

	mounted() {
		const self = this;
		self.headersFunc();
	},

	created() {
	},
}

</script>

<style scoped>
.headerContainer {
	font-size:14px;
}
.headerContainer a {
	color: #3977AD;
	text-decoration:none;
}
.headerContainer a:hover {
	color: #64ADEC;
}
.headerContainer.active {
	font-weight: bold;
}
.h1 {
	padding-left:4px;
	font-size:20px;
}
.h2 {
	padding-left:24px;
	font-size:18px;
}
.h3 {
	padding-left:44px;
	font-size:16px;
}
.h4 {
	padding-left:64px;
}
.h5 {
	padding-left:84px;
}
.h6 {
	padding-left:104px;
}
</style>
