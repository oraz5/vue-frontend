<template>
    <div class="container">
        <form  ref="form" class="form-class" style="position: relative !important;
        top: 50px !important; display: inline-grid;" >
            <h3>Product</h3>
            <label for="product_name">Product Name:</label>
            <input type="text" id="product_name"  v-model="product_name">
            <label for="description_tm">Description in TM language:</label>
            <textarea id="description_tm"  rows="5"  v-model="description_tm"></textarea>
            <label for="description_ru">Description in RU language:</label>
            <textarea id="description_ru"  rows="5"  v-model="description_ru"></textarea>
            <label for="description_en">Description in EN language:</label>
            <textarea id="description_en"  rows="5"  v-model="description_en"></textarea>
            <label for="category_id">Category:</label>
            <!-- <input type="text" id="category_id"  v-model="category_id"> -->
            <select v-model="category_id" @change="onChangeCategory($event)">
                <optgroup v-for="(category, index) in categoriesList" v-bind:key="index" v-if="category.parent_category == 0" :label="category.category_name_tm" >
                <option v-for="subcategory in categoriesList" v-bind:key="subcategory.id" v-if="subcategory.parent_category == category.id" :value="subcategory.id">{{subcategory.category_name_tm}}</option>
                </optgroup>
            </select>
            <label for="region_id">Region:</label>
            <!-- <input type="text" id="region_id"  v-model="region_id"> -->
            <select v-model="region_id">
                <optgroup v-for="(regionm, index) in regions" v-bind:key="index" v-if="regionm.main_region == 0" :label="regionm.name" >
                <option v-for="region in regions" v-bind:key="region.id" v-if="region.main_region == regionm.id" :value="region.id">{{region.name}}</option>
                </optgroup>
            </select>
            <label for="brand_id">Brand:</label>
            <!-- <input type="text" id="brand_id" list="brandList" v-model="brand_id">
            <datalist id="brandList">
                <option v-for="brand in brands" v-bind:key="brand.id" :value="brand.id" :label="brand.name">{{brand.name}}</option>
            </datalist> -->
            <v-select :options="brands" label="name" v-model="brand_id" :reduce="brand_id => brand_id.id">
            <template slot="option" slot-scope="option">
                <img :src="'http://localhost:8800/'+option.icon" style="width:20px; height:auto">
                {{ option.name }}
            </template>
            </v-select>
            <label for="codename">Codename:</label>
            <input type="text" id="codename"  v-model="codename">
            <label for="quantity">Quantity:</label>
            <input type="text" id="quantity"  v-model="quantity">
            <label for="price">Price:</label>
            <input type="text" id="price"  v-model="price">
            <label for="image">Image:</label>
            <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()">
            <h4>Options</h4>
            <div v-if="selectedCategory == 5">
              <label for="processors">Processors</label><br>
              <v-select :options="processors" v-model="processor_model" label="model"  :reduce="processor_model => processor_model.model" @input="changeProcessor">
              <template slot="option" slot-scope="option">
                  {{option.processor}} - {{ option.model }}
              </template>
              </v-select>
            </div>
            <div  v-for="(val, key, index) in catOptions" v-bind:key="index" >
                <label v-bind:for="key">{{key}}</label><br>
                <input type="text" v-bind:name="key" v-bind:id="key"  v-bind:list="'variantOption'+index" v-model="selectedValue[key]"/>
                  <datalist v-bind:id="'variantOption'+index" >
                      <option v-for="valuName in val" v-bind:key="valuName" v-bind:value="valuName">{{valuName}}</option>
                  </datalist>
            </div>
            <input type="submit" class="btn btn-success"  style="margin-top:20px;" value="Add Product" v-on:click.prevent="submitForm">
            <div class="form-group" style="margin-top: 10px;">
                <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
            </div>
        </form>
      </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
// import { EventBus } from '../../event-bus'
import UserService from '../../services/user.service'
import Navigation from '@/components/Navigation'

export default {
  name: 'createProduct',
  components: {
    Navigation
  },
  data () {
    return {
      product_name: '',
      description_tm: '',
      description_ru: '',
      description_en: '',
      category_id: '',
      region_id: '',
      brand_id: '',
      codename: '',
      files: '',
      price: null,
      quantity: null,
      selectedCategory: '',
      processor_model: '',
      catOptions: [],
      regions: [],
      brands: [],
      processors: [],
      selectedValue: {},
      message: ''
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
      console.log(this.categoriesList)
      const catID = this.categoriesList.find(x => x.id == this.$route.query.category)
      const parCatID = this.categoriesList.find(x => x.id == catID.parent_category)
      this.currentCat = this.$route.query.category
      this.categoryNameTM = catID.category_name_tm
      this.categoryNameRU = catID.category_name_ru
      this.parentCatNameTM = parCatID.category_name_tm
      this.parentCatNameRU = parCatID.category_name_ru
    },
    submitForm () {
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append('image_file', this.files[i])
      }
      formData.append('product_name', this.product_name)
      formData.append('description_tm', this.description_tm)
      formData.append('description_ru', this.description_ru)
      formData.append('description_en', this.description_en)
      formData.append('category_id', this.category_id)
      formData.append('region_id', this.region_id)
      formData.append('brand_id', this.brand_id)
      formData.append('codename', this.codename)
      formData.append('price', this.price)
      formData.append('quantity', this.quantity)
      for (const [key, value] of Object.entries(this.selectedValue)) {
        formData.append(key, value)
      }
      console.log(formData)
      UserService.addProduct(formData).then(
        response => {
          console.log(response.headers)
          this.$router.push('/admin/products')
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
    onChangeCategory (event) {
      this.selectedCategory = event.target.value
      axios.get('http://127.0.0.1:8800/api/v1/category/value/' + event.target.value).then(response => {
        this.catOptions = response.data
        console.log(this.catOptions)
      }).catch((error) => {
        console.log(error)
      })
      console.log(this.catOptions)
      if (this.selectedCategory == 5) {
        console.log('yeee gg')
        UserService.getProcessors().then(response => {
          this.processors = response.data.processor.Intel
          console.log(this.processors)
        })
      }
    },
    handleFilesUpload () {
      this.files = this.$refs.files.files
    },
    changeProcessor (value) {
      console.log(value)
      const currentProc = this.processors.find(x => x.model == value)
      this.selectedValue['Processor Model'] = currentProc.model
      this.selectedValue['Processor Codename'] = currentProc.codename
      this.selectedValue['Processor cores'] = currentProc.cores
      this.selectedValue['Processor threads'] = currentProc.threads
      this.selectedValue['Processor freq'] = currentProc.freq
      this.selectedValue['Processsor turbo freq'] = currentProc.turboFreq
      this.selectedValue['Processor l3 cache'] = currentProc.L3cache
      console.log(currentProc)
      console.log(this.selectedValue[0])
      // if ('Processor Model' in this.selectedValue) {
      //   console.log('consist')
      //   this.selectedValue['Processor Model'] = currentProc.model
      // }
    }
  },
  computed: {
    ...mapGetters(['categoriesList'])
  },
  created () {
    // this.getCategoryValues()
    this.getRegions()
    this.getBrands()
  }
}
</script>
