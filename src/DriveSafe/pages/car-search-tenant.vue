<script>
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import InputText from "primevue/inputtext";
import VehiculoService from "@/DriveSafe/services/vehicle.service";
import { useRouter } from "vue-router";

export default {
  components: {
    Card,
    Carousel,
    InputText,
  },
  data() {
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/home" },
        { label: "Buscar Autos", to: "/car-search-tenant" },
        { label: "Mantenimiento", to: "/manteinance-tenant" },
        { label: "Alquiler", to: "/rent-tenant" },
      ],
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
    vehiculosDisponibles() {
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
    alquilarAuto(vehicle_id) {
      localStorage.setItem("vehicle_id", vehicle_id);
      this.router.push({ path: "/rent-car" });
    }
  },
  created() {
    VehiculoService.getAll()
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
            src="https://imgur.com/a/DWk9R7P"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
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
    <div class="search-card">
      <Card>
        <template #title></template>
        <template #content>
          <div class="search-fields">
            <div class="field">
              <p>Tiempo de alquiler</p>
              <InputText v-model="time_type" placeholder="Tiempo de alquiler" />
            </div>
            <div class="field">
              <p>Marca</p>
              <InputText v-model="brand" placeholder="Marca" />
            </div>
            <div class="field">
              <p>Modelo</p>
              <InputText v-model="model" placeholder="Modelo" />
            </div>
            <div class="field">
              <p>Clase</p>
              <InputText v-model="car_class" placeholder="Clase" />
            </div>
            <div class="field">
              <p>Transmisión</p>
              <InputText v-model="transmission" placeholder="Transmisión" />
            </div>
            <div class="field">
              <p>Precio</p>
              <InputText v-model="rental_cost" placeholder="Precio (S/.)" />
            </div>
          </div>
        </template>
      </Card>
    </div>
    <h1>Vehiculos</h1>
  </div>

  <div class="vehicle-list">
    <pv-card v-for="vehicle in vehiculosDisponibles" :key="vehicle.id" class="vehicle-card">
      <template #title>{{vehicle.brand}} {{vehicle.model}}</template>
      <template #content>
        <img :src="vehicle.url_image" alt="Vehicle image" class="product-image"/>
        <div class="vehicle-details">
          <p>Class: {{ vehicle.car_class }}</p>
          <p>Transmission: {{ vehicle.transmission }}</p>
          <p>Time type: {{ vehicle.time_type }}</p>
          <p>Rental cost: S/.{{ vehicle.rental_cost }}</p>
          <pv-button @click="alquilarAuto(vehicle.id)">Rent</pv-button>
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