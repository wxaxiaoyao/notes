<template>
	<div class="dailies-smIndex-container">
		<mt-header title="日报">
			<mt-button slot="left" icon="back" @click="$router.go(-1)"></mt-button>
			<mt-button slot="right" @click="push('/note/dailies/smUpsert')">新增</mt-button>
		</mt-header>
		<div v-for="(x, i) in list" :key="i" class="item-container">
			<mt-cell is-link :to="`/note/dailies/smUpsert?id=${x.id}`">
				<div slot="title" class="item-container">
					<div class="item-header-container">
						<div class="date-container">
							{{x.date}}
						</div>
						<div class="tag-container">
							<tags __style__="show" :__default_data__="x.tagsData"></tags>
						</div>
					</div>
					<div class="item-body-container">
						{{x.content}}
					</div>
				</div>
			</mt-cell>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data:function() {
		return {
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
	},

	mounted() {
		this.loadDatas();
	}
}
</script>

<style scoped>
.dailies-smIndex-container {
	
}
.item-container {
	margin:5px 0px;
}
.item-header-container {
	font-size:16px;
	display: flex;
    justify-content: space-between;
	align-items: center;
}
.item-body-container {
	font-size:14px;
}
</style>
