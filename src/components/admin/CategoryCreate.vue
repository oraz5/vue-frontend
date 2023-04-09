<template>
    <div class="container">
      <div class="row">
        <div class="col-4">
        <form  ref="form" class="form-class" style="position: relative !important;
        top: 50px !important; display: inline-grid;" >
            <h3>Create Category</h3>
            <label for="category_name_tm">Category Name in TM language:</label>
            <input type="text" id="category_name_tm"  v-model="category_name_tm">
            <label for="category_name_ru">Category Name in RU language:</label>
            <input type="text" id="category_name_ru"  v-model="category_name_ru">
            <label for="category_name_en">Category Name in EN language:</label>
            <input type="text" id="category_name_en"  v-model="category_name_en">
            <label for="parent_category_id">Parent Category:</label>
            <!-- <input type="text" id="category_id"  v-model="category_id"> -->
            <select v-model="parent_category_id">
                <option v-for="category in parCat" v-bind:key="category.id" :value="category.id">{{category.category_name_tm}}</option>
            </select>
            <label for="image">Image:</label>
            <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()">
            <img v-if="files" :src="'http://localhost:8800/'+files" class="img-thumbnail" alt="">
            <input type="submit" class="btn btn-success"  style="margin-top:20px;" :value="buttonText" v-on:click.prevent="submitForm">
            <div class="form-group" style="margin-top: 10px;">
                <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
            </div>
        </form>
        </div>
          <div class="col-8">
            <h4>Options</h4>
            <table >
            <tr>
              <th>Option</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
            <tr class="orderId-text" v-for="(option, index) in catOptions" :key="index" style="width:100%; ">
              <td>{{ option }}</td>
              <td><input type="text"   id="category_option_descr" ></td>
              <td><input type="submit" class="btn btn-danger"  style="margin-top:20px;" value="Delete" v-on:click.prevent="removeOptionForm(option)"></td>
            </tr>
            </table>
            <!-- <div class="options">
            <p v-for="(option, index) in catOptions" :key="index">{{ option }}<span v-on:click.prevent="removeOptionForm(option)">x</span></p>
            </div> -->
            <div class="add-option">
                  <input type="text" id="add_option"  v-model="option_name">
                  <input type="submit" class="btn btn-success"  style="margin-top:20px;" value="Add" v-on:click.prevent="addOptionForm">
            </div>
          </div>
        </div>
      </div>
</template>

<script>
// import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
// import { EventBus } from '../../event-bus'
import UserService from '../../services/user.service'
import Navigation from '@/components/Navigation'

export default {
  name: 'categoryCreate',
  components: {
    Navigation
  },
  data () {
    return {
      category_name_tm: '',
      category_name_ru: '',
      category_name_en: '',
      parent_category_id: '',
      option_name: '',
      category_option_descr: '',
      files: '',
      categories: [],
      catOptions: [],
      parCat: [],
      message: '',
      buttonText: ''
    }
  },
  methods: {
    // getCategoryValues: function () {
    //   console.log('hi there')
    //   axios.get('http://127.0.0.1:8800/api/v1/category/value/' + this.$route.query.catID).then(response => {
    //     this.catOptions = response.data
    //     console.log(this.catOptions)
    //   }).catch((error) => {
    //     console.log(error)
    //   })
    // },
    getRegions: function () {
      UserService.getRegions().then((response) => {
        this.regions = response.data
        console.log(this.regions)
      }).catch((error) => {
        console.log(error)
      })
    },
    getBrands: function () {
      UserService.getBrands().then(response => {
        this.brands = response.data.brands
        console.log(this.brands)
      }).catch((error) => {
        console.log(error)
      })
    },
    getCategory: function () {
      console.log('this cat: ' + this.$route.query.category)
      UserService.getCategory().then(response => {
        this.categories = response.data
        const catID = this.categories.find(x => x.id == this.$route.query.category)
        this.parCat = this.categories.filter(x => x.parent_category === 0)
        if (this.$route.query.category) {
          this.category_name_tm = catID.category_name_tm
          this.category_name_ru = catID.category_name_ru
          this.category_name_en = catID.category_name_en
          this.parent_category_id = catID.parent_category
          this.files = catID.category_image
          this.catOptions = catID.options
        }
      })
    },
    submitForm () {
      const formData = new FormData()
      console.log(this.files)
      for (let i = 0; i < this.files.length; i++) {
        formData.append('image_file', this.files[i])
      }
      formData.append('category_name_tm', this.category_name_tm)
      formData.append('category_name_ru', this.category_name_ru)
      formData.append('category_name_en', this.category_name_en)
      formData.append('parent_category_id', this.parent_category_id)
      // for (const [key, value] of Object.entries(this.selectedValue)) {
      //   formData.append(key, value)
      // }
      console.log(formData)
      if (this.$route.path == '/admin/category-create') {
        this.buttonText = 'Add Category'
        UserService.addCategory(formData).then(
          response => {
            console.log(response.headers)
            this.getCategory()
            this.$router.push('/')
          },
          error => {
            console.log(error)
            this.message =
                  (error.response && error.response.data) ||
                  error.message ||
                  error.toString()
            if (error.response.data.message.includes('Token')) {
              this.logOut()
            }
          }
        )
      } else if (this.$route.path == '/admin/category-edit') {
        this.buttonText = 'Edit Category'
        UserService.editCategory(formData, this.$route.query.category).then(
          response => {
            console.log(response.headers)
            this.updateCategories()
            this.$router.push('/')
          },
          error => {
            console.log(error)
            this.message =
                  (error.response && error.response.data) ||
                  error.message ||
                  error.toString()
            if (error.response.data.message.includes('Token')) {
              this.logOut()
            }
          }
        )
      }
    },
    addOptionForm () {
      const option = [this.option_name]
      const jsonOption = JSON.stringify(option)
      UserService.addCategoryOption(jsonOption, this.$route.query.category).then(
        response => {
          console.log(response.headers)
          this.getCategory()
        },
        error => {
          console.log(error)
          this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString()
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        }
      )
    },
    removeOptionForm (optionName) {
      const option = [optionName]
      const jsonOption = JSON.stringify(option)
      UserService.delCategoryOption(jsonOption, this.$route.query.category).then(
        response => {
          console.log(response.headers)
          this.getCategory()
        },
        error => {
          console.log(error)
          this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString()
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        }
      )
    },
    handleFilesUpload () {
      this.files = this.$refs.files.files
    },
    ...mapActions(['updateCategories'])
  },
  computed: {
    ...mapGetters(['categoriesList'])
  },
  created () {
    if (this.$route.path == '/admin/category-create') {
      this.buttonText = 'Add Category'
    } else if (this.$route.path == '/admin/category-edit') {
      this.buttonText = 'Edit Category'
    }
    // if (this.$route.query.category){
    //   this.insertData()
    // }
    // this.getCategoryValues()
    this.getRegions()
    this.getBrands()
    this.getCategory()
  }
}
</script>
