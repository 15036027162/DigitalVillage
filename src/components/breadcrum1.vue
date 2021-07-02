<template>
  <div>
    <div class="site-breadcrumb" v-if="!(this.breadcrumb.length>0&&this.breadcrumb[0].name=='home')">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">
        <span
                v-if="item.redirect==='noRedirect'||index==breadcrumb.length-1"
                class="no-redirect"
        >{{ item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import pathToRegexp from "path-to-regexp";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["breadcrumb"])
  },
  mounted() {
  },
  methods: {
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push({ path: redirect });
        return;
      }
      //   console.log(this.pathCompile(path))
      const { query } = this.$route;
      if (path == "/familyManage/familyView") {
        this.$router.push({
          path: path,
          query:{
            doorNum:query.doorNum
          } 
        });
      } else {
        this.$router.push(this.pathCompile(path));
      }
    },
    pathCompile(path) {
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    }
    // clickBread (i) {

    //   this.$router.push({name: breadcrumb.routeName, params: breadcrumb.params})
    // }
  }
};
</script>
<style >
</style>
