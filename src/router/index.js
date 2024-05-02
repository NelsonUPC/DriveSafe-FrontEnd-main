import { createRouter, createWebHistory } from 'vue-router'
import Inicio from "@/DriveSafe/pages/inicio-arrenda.vue"
import InitPropietario from "@/DriveSafe/pages/inicio-propie.vue"
import NotificacionesPropie from "@/DriveSafe/pages/notificaciones-propie.vue";
import CarRegistrationOwner from "@/DriveSafe/pages/car-registration-owner.vue";
import RentTenant from "@/DriveSafe/pages/rent-tenant.vue";
import Login from "@/DriveSafe/pages/login.vue";
import Register from "@/DriveSafe/pages/register.vue";
import Propietario from "@/DriveSafe/pages/propietario.vue";
import RequestsTenant from "@/DriveSafe/pages/requests-tenant.vue";
import ProfileTenant from "@/DriveSafe/pages/profile-tenant.vue";
import ProfileOwner from "@/DriveSafe/pages/profile-owner.vue";
import RentOwner from "@/DriveSafe/pages/rent-owner.vue";
import RentContractOwner from "@/DriveSafe/pages/rent-contract-owner.vue";
import CarSearchTenant from "@/DriveSafe/pages/car-search-tenant.vue";
import ManteinanceTenant from "@/DriveSafe/pages/manteinance-tenant.vue";
import UpdateOwner from "@/DriveSafe/pages/update-owner.vue";
import UpdateTenant from "@/DriveSafe/pages/update-tenant.vue";
import RentCar from "@/DriveSafe/pages/rent-car.vue";
import ReadRequest from "@/DriveSafe/pages/read-request.vue";
import RentPayment from "@/DriveSafe/pages/rent-payment.vue";
import RentPaymentConfirmation from "@/DriveSafe/pages/rent-payment-confirmation.vue";


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
      component: CarSearchTenant
    },
    {
      path: "/manteinance-tenant",
      name: "manteinance-tenant",
      component: ManteinanceTenant
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
    },
    {
      path: "/rent-payment",
      name: "rent-payment",
      component: RentPayment,
    },
    {
      path: "/rent-payment-confirmation",
      name: "rent-payment-confirmation",
      component: RentPaymentConfirmation
    }

  ]
})
export default router
