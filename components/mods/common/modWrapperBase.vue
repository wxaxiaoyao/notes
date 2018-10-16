
<template>
	<div v-if="__mode__=='editor'" @dblclick="dblclick($event)" @click="click" :class='{"actived": __isActived__}'>
		<div ref="editElem" @blur="blur" v-if="isTextEditor" style="
			-webkit-user-modify:read-write-plaintext-only;
			-webkit-line-break: normal;
			-webkit-tap-highlight-color:rgba(0,0,0,0);
			outline:none;">
		</div>
		<slot v-else></slot>
	</div>	
	<div v-else>
		<slot></slot>
	</div>
</template>

<script>
import modBase from "./modBase.js";

export default {
	mixins: [modBase],

	data: function() {
		return {
			isTextEditor: false,
		}
	},

	props: {
		__type__: {
			type:Number,
		}
	},

	methods: {
		dblclick() {
			const self = this;
			//if (self.__type__ != BASE_MOD_TYPE_TEXT || !this.__modId__ || !this.__key__) return;


			if (self.isTextEditor) return;
			self.isTextEditor = true;

			setTimeout(function() {
				self.$refs.editElem.innerHTML = self.__data__.text;
			});
		},
		blur() {
			this.isTextEditor = false;

			if (this.$refs.editElem.innerHTML == this.__data__.text) return;

			this.__data__.text = this.$refs.editElem.innerHTML;
			this.setCurrentModData(this.__data__);
		},
		click() {
			this.setCurrentMod(this.__type__);
		},
	},

	mounted() {
	}
}

</script>

<style scoped>
.actived {
	border: 1px solid gray;
}
</style>
