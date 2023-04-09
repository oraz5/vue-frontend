import Vue from 'vue'
import Router from 'vue-router'
import AllProducts from '@/components/AllProducts'
import Categories from '@/components/Categories'
import singleProduct from '@/components/singleProduct'
import userCart from '@/components/userCart'
import orderCart from '@/components/orderCart'
import Login from '@/components/Login'
import PageNotFound from '@/components/PageNotFound'
import AllProductsAdmin from '@/components/admin/AllProductsAdmin'
import ProductCreate from '@/components/admin/ProductCreate'
import AdminOrders from '@/components/admin/AdminOrders'
import ProductVariantCreate from '@/components/admin/ProductVariantCreate'
import CategoryCreate from '@/components/admin/CategoryCreate'
import UserProfile from '@/components/Profile'
import store from './../store'
Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ProductCategories',
      component: Categories
    },
    {
      path: '/products/',
      name: 'AllProducts',
      component: AllProducts
    },
    {
      path: '/product/:id',
      name: 'singleProduct',
      component: singleProduct
    },
    {
      path: '/cart',
      name: 'userCart',
      component: userCart,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'UserProfile',
      component: UserProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/order',
      name: 'orderCart',
      component: orderCart,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'UserLogin',
      component: Login
    },
    {
      path: '/admin/products/',
      name: 'AllProductsAdmin',
      component: AllProductsAdmin,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/admin/product/create',
      name: 'ProductCreate',
      component: ProductCreate,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/admin/category-create',
      name: 'categoryCreate',
      component: CategoryCreate,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/admin/category-edit',
      name: 'categoryEdit',
      component: CategoryCreate,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/admin/product/variant/create',
      name: 'ProductVariantCreate',
      component: ProductVariantCreate,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/admin/orders',
      name: 'AdminOrders',
      component: AdminOrders,
      meta: {
        requiresAuth: true,
        requiresAdminRole: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: PageNotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth.status.loggedIn) {
      next({ name: 'UserLogin' })
    } else {
      const user = JSON.parse(localStorage.getItem('user'))
      console.log('loggedIN: ' + user.userRole)
      if (to.matched.some(record => record.meta.requiresAdminRole)) {
        console.log('require ADMIN')
        if (user.userRole == 'superadmin' || user.userRole == 'admin') {
          next()
        } else {
          next({ path: '/404-not-found', component: PageNotFound })
        }
      }
      next()
    }
  } else {
    next()
  }
})
