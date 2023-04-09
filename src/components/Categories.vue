<template>
<div class="row">
  <div class="col-8">
  <div >
      <h3 class="title">
        Categories
      </h3>
  <div class="title-container">
    <div class="filters" v-for="(category, index) in categoriesList" :key="index" v-if="category.parent_category===0">
      <div class="filter"   v-bind:class="{ active: activeItem === category.id}" v-on:click="clickHandler(category.id)">
        <img v-bind:src="api_url + category.category_icon" />
        {{category.category_name_tm}}
      </div>
    </div>
  </div>
  <transition-group class="projects" name="projects" >
    <div class="project" v-if="activeItem === subcategory.parent_category" v-bind:key="subcategory.category_name_tm" v-for="subcategory in categoriesList" >
      <router-link :to="{ name: 'AllProducts', query: { category: subcategory.id } }">
      <div class="project-image-wrapper">
        <img class="project-image" v-bind:src="api_url+subcategory.category_icon">
        <div class="gradient-overlay"></div>
          <span class="project-title">{{subcategory.category_name_tm}}</span>
          <div v-if="currentUser">
            <router-link :to="{ name: 'categoryEdit', query: { category: subcategory.id } }">
              <input v-if="currentUser.userRole == 'superadmin'" type="button" class="btn add-cat btn-success" value="edit">
            </router-link>
          </div>
      </div>
      </router-link>
    </div>
  </transition-group>
</div>
</div>
<div v-if="currentUser" class="col-4">
  <router-link :to="{ name: 'categoryCreate' }">
    <input v-if="currentUser.userRole == 'superadmin'" type="button" class="btn add-cat btn-success" value="Add category">
  </router-link>
</div>
</div>
</template>
<script>

import { mapGetters } from 'vuex'

export default {
  name: 'ProductCategories',
  data () {
    return {
      isActive: false,
      tabIndex: 0,
      categories: [],
      activeItem: 1,
      api_url: this.$api_url
    }
  },
  methods: {
    clickHandler (index) {
      this.activeItem = index
      console.log(this.activeItem)
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },
    ...mapGetters(['categoriesList'])
  },
  created () {
    document.title = 'Categories'
    // this.getData()
  }
}
</script>
