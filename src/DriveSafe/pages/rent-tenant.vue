<script>
import Card from "primevue/card";
import VehicleService from "@/DriveSafe/services/vehicle.service";
import RentService from "@/DriveSafe/services/rent.service";
import UserService from "@/DriveSafe/services/user.service";
import router from "@/router";

export default {
  components: {
    Card
  },
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home" },
        { label: this.$t('Menu.search'), to: "/car-search-tenant" },
        { label: this.$t('Menu.maintenance'), to: "/maintenance-tenant" },
        { label: this.$t('Menu.rent'), to: "/rent-tenant" },
      ];
    }
  },
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      rents: [],
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async loadRents() {
      try {
        const user_id = parseInt(localStorage.getItem("usuarioId"));
        console.log("Usuario ID:", user_id);
        const response = await RentService.getByUserId(user_id);
        console.log("Response:", response);
        this.rents = response.data;

        for (const rent of this.rents) {
          const vehicleResponse = await VehicleService.getById(rent.vehicle_id);
          console.log("Vehículo Response:", vehicleResponse);
          rent.vehicle = vehicleResponse.data;
          const ownerResponse = await UserService.getUserById(rent.owner_id);
          console.log("Propietario Response:", ownerResponse);
          rent.owner = ownerResponse.data;
        }

        console.log("Alquileres:", this.rents);
      } catch (error) {
        console.error("Error al cargar los rents:", error);
      }
    },
    irAPagar(rent) {
      localStorage.setItem("alquilerId", rent.id)
      localStorage.setItem("vehiculoId", rent.vehicle.id)
      localStorage.setItem("vehiculoPrecio", rent.vehicle.rental_cost)
      localStorage.setItem("vehiculoTiempo", rent.vehicle.time_type)
      localStorage.setItem("vehiculoFi", rent.start_date)
      localStorage.setItem("vehiculoFf", rent.end_date)
      localStorage.setItem("vehiculoLugar", rent.vehicle.pick_up_place)
      localStorage.setItem("vehiculoFoto", rent.vehicle.url_image)
      console.log("Ir a pagar por el alquiler:", rent);
      router.push({path: "/rent-payment"});
    }
  },
  created() {
    this.loadRents();
  },
};
</script>

<template>
  <div>
    <header>
      <pv-toolbar class="custom-bg custom-toolbar">
        <template #start>
          <img src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png" alt="Logo" style="height: 40px; margin-right: 20px;" />
          <div class="language-buttons">
            <button class="language-button" @click="switchLanguage" aria-label="Switch Language">
              {{ selectedLanguage === 'en' ? 'ES' : 'EN' }}
            </button>
          </div>
        </template>
        <template #end>
          <div class="flex-column">
            <router-link
                v-for="item in items"
                :to="item.to"
                custom
                v-slot="{ navigate, href }"
                :key="item.label"
            >
              <pv-button class="custom-button" :href="href" @click="navigate">{{ item.label }}</pv-button>
            </router-link>
            <router-link to="/profile-tenant">
              <img src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png" alt="Usuario" style="height: 30px; margin-left: 20px; cursor: pointer;" />
            </router-link>
          </div>
        </template>
      </pv-toolbar>
    </header>

    <div class="p-grid">
      <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">{{ $t('RentTenant.title') }}</h1>
      <div v-if="rents.length === 0">
        <p>{{ $t('RentTenant.no_rents') }}</p>
      </div>
      <div v-else>
        <pv-card v-for="rent in rents" :key="rent.id" class="vehicle-card">
          <template #title>
            <h2>{{ $t('RentTenant.rent_details') }}</h2>
          </template>
          <template #content>
            <p>{{ $t('RentTenant.brand') }}  {{ rent.vehicle ? rent.vehicle.brand : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.model') }}  {{ rent.vehicle ? rent.vehicle.model : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.owner') }} {{ rent.owner ? rent.owner.name + " " + rent.owner.last_name : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.phone') }} {{ rent.owner ? rent.owner.cellphone : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.start_date') }} {{ rent.start_date }}</p>
            <p>{{ $t('RentTenant.end_date') }} {{ rent.end_date }}</p>
            <p>{{ $t('RentTenant.pick_up_place') }} {{ rent.vehicle ? rent.vehicle.pick_up_place : 'No disponible'}}</p>
            <div v-if="rent.status.toLowerCase() === 'accepted'"> <h3>{{ $t('RentTenant.status_accepted') }}</h3></div>
            <div v-if="rent.status === 'Pending'"> <h3>{{ $t('RentTenant.status_pending') }}</h3></div>
            <button v-if="rent.status === 'Accepted'" @click="irAPagar(rent)" class="pay-button">{{ $t('RentTenant.pay_button') }}</button>
            <div v-if="rent.status === 'Refused'"> <h3>{{ $t('RentTenant.status_refused') }}</h3></div>
            <div v-if="rent.status === 'Paid'"><h3>{{ $t('RentTenant.status_paid') }}</h3></div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style>
.pay-button {
  background-color: #1A2C63;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.pay-button:hover {
  background-color: #FF7A00; /* Cambiar el color de fondo cuando se pasa el mouse sobre el botón */
}
.custom-bg {
  background-color: #FFFFFF;
}
.custom-button {
  background-color: #FFFFFF;
  color: #000000;
}
.custom-button:hover,
.custom-button:focus {
  background-color: #FF7A00 !important;
  color: #FFFFFF !important;
}
</style>