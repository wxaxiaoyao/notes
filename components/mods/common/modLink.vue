
<template>
	<a @click="clickContainer($event)" :href="__data__.href" :target="__data__.target">{{__data__.text}}</a>
</template>

<script>

export default {
	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					text: "链接文本",
					href: "#",
					//target: "_blank",
					target: "_self",
				}
			}
		},
		__data_type__: {
			type:Number,
			//default: BASE_MOD_TYPE_LINK,
		},
	},

	computed: {
	},

	watch: {
	},

	methods: {
		clickContainer(e) {
			if (this.__isEditorMode__) 	e.preventDefault();
		}
	},

	mounted() {
	}
}
</script>
