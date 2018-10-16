
<template>
	<div class="mediaContainer">
		<img class="image" :src="src" v-if="isImage"/>
		<video class="video" :src="src" v-else-if="isVedio"></video>
		<audio class="audio" :src="src" v-else-if="isAudio"></audio>
		<div v-else></div>
	</div>
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
					src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1532366951796&di=ec6218089c8e9c93b3d2fa161a322384&imgtype=0&src=http%3A%2F%2Fpic2.nipic.com%2F20090402%2F2318669_090145088_2.jpg",
				}
			}
		},

		__data_type__: {
			type:Number,
			//default: BASE_MOD_TYPE_MEDIA,
		},

		type: {
			type: String,
		},
	},

	computed: {
		src() {
			return this.__data__.src;
		},
		isImage() {
			if (this.type == "image") return true;

			const src = this.src.split("?")[0];
			const types = [".jpg", ".jpeg", ".png", ".svg"];

			if (!src) return false;

			if (types.findIndex(el => _.endsWith(src.toLowerCase(), el)) !== -1) return true;

			let type = src.split(',')[0] ? src.split(',')[0] : ''
			if (type === 'data:image/png;base64' || type === 'data:image/jpeg;base64' || type === 'data:image/gif;base64') {
				return true;
			}
			return false;
		},
		isVedio() {
			if (this.type == "vedio") return true;

			const src = this.src.split("?")[0];
			const types = [".mp4", ".webm"];

			if (!src) return false;
			
			return types.findIndex(el => _.endsWith(src.toLowerCase(), el)) !== -1;
		},
		isAudio() {
			if (this.type == "audio") return true;

			const src = this.src.split("?")[0];
			const types = [".mp3", ".ogg", ".wav"];
			
			if (!src) return false;

			return types.findIndex(el => _.endsWith(src.toLowerCase(), el)) !== -1;
		},
	},

	watch: {
	},

	methods: {
	},

	mounted() {
	}
}
</script>

<style scoped>
.mediaContainer>.image {
	height: 100%;
	width: 100%;
}

.mediaContainer>.video {

}
.mediaContainer>.audio {

}
</style>
