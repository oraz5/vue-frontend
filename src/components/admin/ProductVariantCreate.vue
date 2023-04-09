<template>
    <div class="container">
        <form  ref="form" class="form-class" style="position: relative !important;
        top: 50px !important; display: inline-grid;" >
            <label for="codename">Codename:</label>
            <input type="text" id="codename"  v-model="codename">
            <label for="quantity">Quantity:</label>
            <input type="text" id="quantity"  v-model="quantity">
            <label for="price">Price:</label>
            <input type="text" id="price"  v-model="price">
            <label for="image">Image:</label>
            <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()">
            <h4>Options</h4>
            <div  v-for="(val, key, index) in catOptions" v-bind:key="index" >
                <label v-bind:for="key">{{key}}</label><br>
                <input type="text" v-bind:name="key" v-bind:id="key"  v-bind:list="'variantOption'+index" v-model="selectedValue[key]"/>
                  <datalist v-bind:id="'variantOption'+index" >
                      <option v-for="valuName in val" v-bind:key="valuName" v-bind:value="valuName">{{valuName}}</option>
                  </datalist>
            </div>
            <input type="submit" class="btn btn-success"  style="margin-top:20px;" value="Add to Variant" v-on:click.prevent="submitForm">
        </form>

      </div>
</template>

<script>
import axios from 'axios'
// import { mapGetters } from 'vuex'
// import { EventBus } from '../../event-bus'
import UserService from '../../services/user.service'
import Navigation from '@/components/Navigation'

export default {
  name: 'createProductVariant',
  components: {
    Navigation
  },
  data () {
    return {
      codename: '',
      files: '',
      price: null,
      quantity: null,
      catOptions: [],
      selectedValue: {}
    }
  },
  methods: {
    getCategoryValues: function () {
      console.log('hi there')
      axios.get('http://127.0.0.1:8800/api/v1/category/value/' + this.$route.query.catID).then(response => {
        this.catOptions = response.data
        console.log(this.catOptions)
      }).catch((error) => {
        console.log(error)
      })
    },
    submitForm () {
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append('image_file', this.files[i])
      }
      formData.append('codename', this.codename)
      formData.append('price', this.price)
      formData.append('quantity', this.quantity)
      for (const [key, value] of Object.entries(this.selectedValue)) {
        formData.append(key, value)
      }
      console.log(formData)
      UserService.addProductVariant(this.$route.query.product_id, formData).then(
        response => {
          console.log(response.headers)
          this.$router.push('/admin/products')
        },
        error => {
          console.log(error)
          if (error.response.data.message.includes('Token')) {
            this.logOut()
          }
        }
      )
    },
    handleFilesUpload () {
      this.files = this.$refs.files.files
    }
  },
  created () {
    this.getCategoryValues()
  }
}
</script>
