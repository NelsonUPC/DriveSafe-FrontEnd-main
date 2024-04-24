<script>
import Card from "primevue/card";
import VehiculoService from "@/AutoYa/services/vehiculo.service";

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
        // Filtrar vehículos por el id del arrendatario almacenado en localStorage
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
  <pv-toast />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://i.postimg.cc/vmZh3LGv/logotransparent-26-06.png"
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
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-tenant">
            <!-- Agrega la imagen a la derecha -->
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

  <div class="p-grid">
    <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">Vehículos alquilados</h1>
    <div class="card-container">
      <div v-if="vehiculosFiltrados.length > 0" class="card-container">
      <!-- Itera sobre los vehículos y muestra un card por cada uno -->
        <div class="card-item" v-for="vehiculo in vehiculosFiltrados" :key="vehiculo.id">
          <Card>
            <template #title></template>
            <template #content>
              <!-- Contenido del card con la información del vehículo -->
              <img :src="vehiculo.urlImagen" alt="Imagen del vehículo" style="max-width: 100%; height: auto;" />
              <p style="font-family: 'Poppins', sans-serif">Id: {{ vehiculo.id }}</p>
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
  flex-wrap: wrap; /* Permite que los items se muevan a la siguiente línea cuando no hay suficiente espacio */
  gap: 10px; /* Espacio entre los items */
}
</style>