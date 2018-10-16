<template>
	<div class='commentContainer'>
		<h3>评论</h3>
		<div class="comment-box">
			<div class="comment-item" v-for='(comment,index) in comments' :key='index'>
				<div class="header">
					<h4>{{ comment.nickname || comment.username}}</h4>
					<div class="headerRight">
						<span class="date">{{ comment.createdAt | datetime}}</span>
						<a class="delete-btn" @click="deleteComment(comment, index)">删除</a>
					</div>
				</div>
				<div class="body">
					<p>{{ comment.content }}</p>
				</div>
			</div>
		</div>
		<div class="comment-input-container">
			<h3>我要评论</h3>
			<div class="comment-input">
				<textarea rows="3" v-model="comment.content" placeholder="请输入评论内容..."></textarea>
				<el-button @click="submitComment">提交</el-button>
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
			comments: [
			//{
				//commenterUsername:"xiaoyao",
				//commenterNickname:"逍遥",
				//createdAt: "2018-007-01",
				//content: "hello world",
			//},
			//{
				//commenterUsername:"xiaoyao",
				//commenterNickname:"逍遥",
				//createdAt: "2018-007-01",
				//content: "hello world",
			//},
			],
			comment: {

			},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					objectId:null,
					objectType:null,
				}
			}
		},
	},

	filters: {
		datetime(datestr) {
			return datestr.replace(/T/, " ").replace(/\..*$/, "");
		}
	},

	computed:{
		currentPage() {
			return this.getData("__currentPage__") || {};
		}
	},

	methods: {
		async parseData() {
			this.getComments(true);
		},
		async getComments(cache) {
			const {objectId, objectType} = this.__data__;
			if (!_.isNumber(objectId) || !_.isNumber(objectType)) return;
			let comments = await this.api.comments.get({objectId, objectType}, {cache});
			comments = comments.data || [];

			this.comments = comments;
		},

		async deleteComment(comment, index) {
			this.comments.splice(index,1);
			
			await this.api.comments.delete(comment);
		},

		async submitComment() {
			this.comment.objectId = this.__data__.objectId;
			this.comment.objectType = this.__data__.objectType;
			
			await this.api.comments.create(this.comment);

			await this.getComments();

			this.comment.content = "";
		}
	},

	mounted() {
		this.parseData();
	}
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
