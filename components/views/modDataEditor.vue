
<template>
	<objectEditor 
	__style__="vertical"
	:__data_type__="dataType"
	:__data__="data">
	</objectEditor>
</template>

<script>
import _ from "lodash";
import {mapGetters, mapActions, mapMutations} from "vuex";
import {
} from "element-ui";

import component from '@/components/component.js';

export default {
	mixins:[component],
	components: {
	},

	data: function() {
		return {
			dataType:{},
			data: {},
		}
	},

	computed: {
		...mapGetters({
			currentMod: "getCurrentMod",
			getModData: "getModData",
		}),
	},

	watch: {
		currentMod(mod) {
			mod = mod || {};
			const data = mod.__mod_key__ ? this.getModData(mod.__mod_key__) : {};
			if (this.modKey == mod.__mod_key__ && JSON.stringify(this.data) == JSON.stringify(data)) return;
			this.modKey = mod.__mod_key__;
			this.dataType = mod.__data_type__;
			this.data = data;
			//console.log(mod, this.modKey, this.dataType, this.data);
		},
		data: {
			handler: function(val, oldVal){
				if (!this.modKey) return;
				this.setModData({[this.modKey]: this.data});
			},
			deep: true,
		},
	},

	methods: {
		...mapMutations({
			setModData: "setModData",
		}),
	},

	mounted() {
	}
}
</script>

<style lang="scss">
.mod-editor  {
	padding:10px;

	.input-type  {
		.el-input__inner {
			border: none;
			border-bottom: 1px solid #e4e7ed;
			font-size: 16px;
			padding: 18px 0 0;
			border-radius: 0;
		}
	}

	.select-type {
		margin-top: 18px;
	}
}
</style>
