<template>
  <footer class="pac-footer" :style="containerStyle">
    <div class="container">
      <ul>
        <li>
          <a href="http://wxaxiaoyao.cn/xiaoyao/note/about">关于我们</a>
        </li>
        <li>
          <a href="#">加入我们</a>
        </li>
        <li>
          <a href="#">网站统计</a>
        </li>
        <li>
          <a href="#">更新信息</a>
        </li>
        <li>
          <a href="https://github.com/wxaxiaoyao/note/issues">问题反馈</a>
        </li>
      </ul>
	  <p><a href="http://www.miitbeian.gov.cn/">粤ICP备18012006号-1</a></p>
    </div>
  </footer>
</template>
<script>
export default {
	data: function() {
		return {
			containerStyle: {
				backgroundColor:"white",


			}
		}
	},

	props: {
		data: {
			type:Object,
			default: function() {
				return {
					backgroundColor:"white",
				}
			}
		}
	},

	mounted() {
		this.containerStyle["backgroundColor"] = this.data.backgroundColor || this.containerStyle.backgroundColor;
	}
}
</script>
<style lang="scss">
.pac-footer {
  background-color: #18181a;
  ul {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 30px 0 22px;
    list-style: none;
    margin: 0;
  }
  a {
    color: #909399;
    text-decoration: none;
  }
  p {
    text-align: center;
    padding: 20px 0;
    color: #909399;
    margin: 0;
  }
  .container {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .pac-footer {
    a {
      font-size: 14px;
    }
    ul {
      padding: 10px 0;
      display: block;
    }
    li {
      display: inline-block;
      padding: 5px 15px;
    }
    p {
      padding: 15px 0;
    }
  }
}
</style>
