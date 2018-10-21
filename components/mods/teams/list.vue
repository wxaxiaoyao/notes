
<template>
	<div>
		<div v-for="(x,i) in teams" :key="i" class="team-container">
			<div class="team-title-container">
				{{x.name}}
			</div>
			<div class="team-description-container">
				{{x.description}}
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			teams:[],
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
	},

	async mounted() {
		const {userId} = this.authenticated();
		const result = await this.api.teams.get();
		const teams = result.data || [];

		this.teams = teams;
	}
}
</script>

<style>
</style>

<style scoped>
.team-container {
	
}
.team-title-container {

}
.team-description-container {

}
</style>
