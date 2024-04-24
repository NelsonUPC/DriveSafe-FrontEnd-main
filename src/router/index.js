import { createRouter, createWebHistory } from 'vue-router'
import Inicio from "@/AutoYa/pages/inicio-arrenda.vue"
import InitPropietario from "@/AutoYa/pages/inicio-propie.vue"
import NotificacionesPropie from "@/AutoYa/pages/notificaciones-propie.vue";
import CarRegistrationOwner from "@/AutoYa/pages/car-registration-owner.vue";
import RentTenant from "@/AutoYa/pages/rent-tenant.vue";
import Login from "@/AutoYa/pages/login.vue";
import Register from "@/AutoYa/pages/register.vue";
import Propietario from "@/AutoYa/pages/propietario.vue";
import RequestsTenant from "@/AutoYa/pages/requests-tenant.vue";
import ProfileTenant from "@/AutoYa/pages/profile-tenant.vue";
import ProfileOwner from "@/AutoYa/pages/profile-owner.vue";
import RentOwner from "@/AutoYa/pages/rent-owner.vue";
import RentContractOwner from "@/AutoYa/pages/rent-contract-owner.vue";
import CarSearchTenant from "@/AutoYa/pages/car-search-tenant.vue";
import ManteinanceTenant from "@/AutoYa/pages/manteinance-tenant.vue";
import UpdateOwner from "@/AutoYa/pages/update-owner.vue";
import UpdateTenant from "@/AutoYa/pages/update-tenant.vue";
import RentCar from "@/AutoYa/pages/rent-car.vue";
import ReadRequest from "@/AutoYa/pages/read-request.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/home',
      name: 'home',
      component: Inicio,
    },
    {
      path: "/notifications",
      name: "Notificaciones",
      component: NotificacionesPropie,
    },
    {
      path: "/car-registration-owner",
      name: "car-registration-owner",
      component: CarRegistrationOwner,
    },
    {
      path: "/rent-contract-owner",
      name: "rent-contract-owner",
      component: RentContractOwner,
    },
    {
      path: "/rent-tenant",
      name: "rent-tenant",
      component: RentTenant,
    },
    {
      path: "/rent-owner",
      name: "rent-owner",
      component: RentOwner,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/propietario",
      name: "propietario",
      component: Propietario,
    },
    {
      path: "/init-propie",
      name: "init-propie",
      component: InitPropietario,
    },
    {
      path: "/requests-tenant",
      name: "requests-tenant",
      component: RequestsTenant,
    },
    {
      path: "/profile-tenant",
      name: "profile-tenant",
      component: ProfileTenant,
    },
    {
      path: "/profile-owner",
      name: "profile-owner",
      component: ProfileOwner,
    },
    {
      path: "/car-search-tenant",
      name: "car-search-tenant",
      component: CarSearchTenant,
    },
    {
      path: "/manteinance-tenant",
      name: "manteinance-tenant",
      component: ManteinanceTenant,
    },
    {
      path: "/update-owner",
      name: "update-owner",
      component: UpdateOwner,
    },
    {
      path: "/update-tenant",
      name: "update-tenant",
      component: UpdateTenant,
    },
    {
      path: "/rent-car",
      name: "rent-car",
      component: RentCar,
    }
    ,
    {
      path: "/read-request",
      name: "read-request",
      component: ReadRequest,
    }
  ]
})
export default router