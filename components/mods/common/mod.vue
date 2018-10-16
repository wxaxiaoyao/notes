
<template>
	<component 
		ref="self"
		v-if="__mode__ == 'editor'"
		@click.native.stop="click"
		class="mod-container"
		:class='{"actived": __isActived__}'
		:__default_data__="__default_data__"
		:__mode__="__mode__"
		:__style__="__style__"
		:__key__="__key__"
		:is="comp">
		<slot></slot>
	</component>
	<component 
		v-else
		:__default_data__="__default_data__"
		:__mode__="__mode__"
		:__style__="__style__"
		:__key__="__key__"
		:is="comp">
		<slot></slot>
	</component>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

//const async = () => import("@/components/async.vue");

export default {
	inheritAttrs: false,
	mixins: [mod],
	components: {
	},

	data: function() {
		return {
			styles: {},
		}
	},

	computed: {
		comp() {
			const style = this.__style__ || this.__data__.style  || "index";
			const styleComp = this.styles[style] || this.styles["index"];

			return styleComp;
			//if (_.isFunction(styleComp)) {
				////return async;
				//return styleComp;
				//// 异步组件不支持下面这种mixins方式
				////return (resolve, reject) => {
					////styleComp().then(function(comp){
						////console.log(comp);
						////return resolve({
							////mixins:[mod, comp],
						////});
					////}, reject);
				////}
			//} else {
				//return {
					//mixins: [mod, styleComp],
				//};
			//}
		}
	},

	methods: {
		click() {
			const self = this.$refs.self;
			console.log(self.__key__);
			if (!self.__key__) return;
			self.setCurrentMod();
			self.setData("editorActiveTab", "baseCompEditor");
		}
	},

	mounted() {
		//console.log(this);
	},
}
</script>

<style scoped>
.mod-container {
	cursor: pointer;
}
.actived {
	border: 1px solid gray;
}
</style>
