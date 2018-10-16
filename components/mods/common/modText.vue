

<template>
	<div style="white-space:pre-wrap" v-text="__data__.text"></div>
</template>

<script>

export default {

	data: function() {
		return {
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					text: "这是文本",
				}
			}
		},
		__data_type__: {
			type:Number,
			//default: BASE_MOD_TYPE_TEXT,
		},
	},

	computed: {
	},

	watch: {
	},

	methods: {
	},

	mounted() {
		//console.log(this.__data__);
	}
}
</script>
