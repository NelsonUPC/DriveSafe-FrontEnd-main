<script>
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import InputText from "primevue/inputtext";
import VehicleService from "@/DriveSafe/services/vehicle.service";
import { useRouter } from "vue-router";

export default {
  components: {
    Card,
    Carousel,
    InputText,
  },
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      router: useRouter(),
      cardCount: 6,
      vehicles: [],
      time_type: null,
      brand: null,
      model: null,
      car_class: null,
      transmission: null,
      rental_cost: null,
    };
  },
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home" },
        { label: this.$t('Menu.search'), to: "/car-search-tenant" },
        { label: this.$t('Menu.maintenance'), to: "/maintenance-tenant" },
        { label: this.$t('Menu.rent'), to: "/rent-tenant" },
      ];
    },
    availableVehicles() {
      if (
          !this.time_type &&
          !this.brand &&
          !this.model &&
          !this.car_class &&
          !this.transmission &&
          !this.rental_cost
      ) {
        return this.vehicles.filter(
            (v) => v.rent_status.toLowerCase() === "available"
        );
      } else {
        return this.vehicles.filter((v) => {
          return (
              (!this.time_type ||
                  v.time_type.toLowerCase().includes(this.time_type.toLowerCase())) &&
              (!this.brand ||
                  v.brand.toLowerCase().includes(this.brand.toLowerCase())) &&
              (!this.model ||
                  v.model.toLowerCase().includes(this.model.toLowerCase())) &&
              (!this.car_class ||
                  v.car_class.toLowerCase().includes(this.car_class.toLowerCase())) &&
              (!this.transmission ||
                  v.transmission.toLowerCase().includes(this.transmission.toLowerCase())) &&
              (!this.rental_cost || v.rental_cost === parseFloat(this.rental_cost))
          );
        });
      }
    },
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    rentVehicle(vehicle_id) {
      localStorage.setItem("vehicle_id", vehicle_id);
      this.router.push({ path: "/rent-car" });
    }
  },
  created() {
    VehicleService.getAll()
        .then((response) => {
          this.vehicles = response.data;
          console.log("Vehiculos: ", this.vehicles);
          console.log("Response data: ", response.data);
        })
        .catch((error) => {
          console.error("Error al obtener la lista de vehículos:", error);
        });
  },
};
</script>

<template>
  <pv-toast />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
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
            <pv-button
                class="custom-button"
                :href="href"
                @click="navigate"
                aria-label="Navigate"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-tenant">
            <img
                src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png"
                alt="Usuario"
                style="height: 30px; margin-left: 20px; cursor: pointer;"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>

  <div class="container">
    <h2 class="section-title">{{ $t('CarSearchTenant.title') }}</h2>
    <div class="search-card">
      <Card>
        <template #title></template>
        <template #content>
          <div class="search-fields">
            <div class="field">
              <p>{{ $t('CarSearchTenant.time_type') }}</p>
              <InputText v-model="time_type" :placeholder="$t('CarSearchTenant.time_type')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.brand') }}</p>
              <InputText v-model="brand" :placeholder="$t('CarSearchTenant.brand')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.model') }}</p>
              <InputText v-model="model" :placeholder="$t('CarSearchTenant.model')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.car_class') }}</p>
              <InputText v-model="car_class" :placeholder="$t('CarSearchTenant.car_class')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.transmission') }}</p>
              <InputText v-model="transmission" :placeholder="$t('CarSearchTenant.transmission')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.rental_cost') }}</p>
              <InputText v-model="rental_cost" :placeholder="$t('CarSearchTenant.rental_cost')" />
            </div>
          </div>
        </template>
      </Card>
    </div>
    <h1>{{ $t('CarSearchTenant.title2') }}</h1>
  </div>

  <div class="vehicle-list">
    <pv-card v-for="vehicle in availableVehicles" :key="vehicle.id" class="vehicle-card">
      <template #title>{{vehicle.brand}} {{vehicle.model}}</template>
      <template #content>
        <img :src="vehicle.url_image" alt="Vehicle image" class="product-image"/>
        <div class="vehicle-details">
          <p>{{ $t('CarSearchTenant.car_class') }}: {{ vehicle.car_class }}</p>
          <p>{{ $t('CarSearchTenant.transmission') }}: {{ vehicle.transmission }}</p>
          <p>{{ $t('CarSearchTenant.time_type') }}: {{ $t('TimeType.' + vehicle.time_type) }}</p>
          <p>{{ $t('CarSearchTenant.rental_cost') }}: S/.{{ vehicle.rental_cost }}</p>
          <pv-button @click="rentVehicle(vehicle.id)">{{ $t('ReadRequest.rent') }}</pv-button>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-card {
  width: 100%;
  margin-bottom: 20px;
}

.search-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.field {
  flex: 1;
  min-width: 200px;
}

.vehicle-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.vehicle-card{
  width: 300px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}

.vehicle-details{
  margin-top: 10px;
}

.vehicle-card img {
  max-width: 80%;
  border-radius: 10px;
}
</style>