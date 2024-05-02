<script>
import Card from "primevue/card";
import VehiculoService from "@/DriveSafe/services/vehiculo.service";

export default {
  components: {
    Card,
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
      vehiculos: [],
      vehiculosFiltrados: [],
    };
  },
  methods: {
    async cargarVehiculos() {
      try {
        const response = await VehiculoService.getAll();
        this.vehiculos = response.data;
        this.vehiculosFiltrados = this.vehiculos.filter(vehiculo => vehiculo.arrendatario && vehiculo.arrendatario.id === parseInt(localStorage.getItem("arrendatarioId")));
      } catch (error) {
        console.error("Error al cargar los vehículos:", error);
      }
    },
  },
  created() {
    this.cargarVehiculos();
  }
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header role="banner">
    <pv-toolbar class="custom-bg custom-toolbar" role="navigation">
      <template #start>
        <img
            src="https://i.imgur.com/hIAgH3Z.png"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
      </template>
      <template #end>
        <div class="flex-column" role="menubar">
          <router-link
              v-for="item in items"
              :to="item.to"
              custom
              v-slot="{ navigate, href }"
              :key="item.label"
              role="menuitem"
          >
            <pv-button
                class="custom-button"
                :href="href"
                @click="navigate"
                role="button"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-tenant" role="menuitem">
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

  <div class="p-grid" role="main">
    <h1 id="vehiclesTitle" style="font-family: 'Poppins', sans-serif; color: #FF7A00">Vehículos alquilados</h1>
    <div class="card-container" role="region" aria-labelledby="vehiclesTitle">
      <div v-if="vehiculosFiltrados.length > 0" class="card-container">
        <div class="card-item" v-for="vehiculo in vehiculosFiltrados" :key="vehiculo.id">
          <Card role="region" aria-labelledby="cardTitle{{vehiculo.id}}">
            <template #title></template>
            <template #content>
              <img :src="vehiculo.urlImagen" alt="Imagen del vehículo" style="max-width: 100%; height: auto;" />
              <p id="cardTitle{{vehiculo.id}}" style="font-family: 'Poppins', sans-serif">Id: {{ vehiculo.id }}</p>
              <p style="font-family: 'Poppins', sans-serif">Marca/Modelo: {{ vehiculo.marca }}/{{ vehiculo.modelo }}</p>
              <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">Estado: {{ vehiculo.estadoRenta }}</h1>
            </template>
          </Card>
        </div>
      </div>
      <h2 v-else style="font-family: 'Poppins', sans-serif; color: black;" >No tiene vehículos alquilados actualmente.</h2>
    </div>
  </div>

</template>


<style>
.custom-bg {
  background-color: white;
}

.custom-button {
  background-color: white;
  color: #14131B;
}

.custom-button:hover,
.custom-button:focus {
  background-color: #FF7A00 !important;
  color: white !important;
}

.custom-button3 {
  height: 30px;
  margin: 20px;
  background-color: black;
  color: white;
  font-family: 'Poppins', sans-serif;
  border: none;
  min-width: auto;
}

.custom-toolbar {
  border-bottom: 2px solid #ddd;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
