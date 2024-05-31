<script>
import Card from 'primevue/card';
import VehiculoService from "@/DriveSafe/services/vehiculo.service";
import {useRouter} from "vue-router";
import Swal from "sweetalert2";
export default {
  components: {
    Card,
  },
  data() {
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/init-propie" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
      vehicles_filtered: [],
      router: useRouter(),
    };
  },
  methods: {
    async cargarVehiculos() {
      try {
        const response = await VehiculoService.getByUserId(parseInt(localStorage.getItem("usuarioId")));
        this.vehicles_filtered = response.data;
        console.log("Vehiculos Filtrados", this.vehicles_filtered);
      } catch (error) {
        console.error("Error al cargar los vehículos:", error);
      }
    },
    async eliminarPublicacion(idVehiculo) {
      try {
        await VehiculoService.delete(idVehiculo);
        this.cargarVehiculos();
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Publicación eliminada correctamente.'
        });
      } catch (error) {
        console.error("Error al eliminar la publicación:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar la publicación.'
        });
      }
    },
    verSolicitud(vehiculoId) {
      localStorage.setItem("vehiculoAlquiladoId", vehiculoId);
      this.router.push({path:"/read-request"});
    }
  },
  created() {
    this.cargarVehiculos();
  },
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar" role="navigation">
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
          <router-link to="/profile-owner" role="menuitem">
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
  <h1 id="vehiclesTitle" style="font-family: 'Poppins', sans-serif; color: #FF7A00">Vehiculos registrados</h1>
  <div class="card-container" role="region" aria-labelledby="vehiclesTitle">
    <div class="card-item" v-for="vehicle in vehicles_filtered" :key="vehicle.id">
      <Card role="region" aria-labelledby="cardTitle{{vehicle.id}}">
        <template #title></template>
        <template #content>
          <img :src="vehicle.url_image" alt="Imagen del vehículo" style="max-width: 100%; height: auto;" />
          <p id="cardTitle{{vehicle.id}}" style="font-family: 'Poppins', sans-serif"></p>
          <p style="font-family: 'Poppins', sans-serif">Marca/Modelo: {{ vehicle.brand }}/{{ vehicle.model }}</p>
          <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">Estado: {{ vehicle.rent_status }}</h1>
          <button class="custom-button3" @click="eliminarPublicacion(vehicle.id)" role="button">Eliminar publicación</button>
          <button v-if="vehicle.rent_status === 'Required'" class="custom-button3" @click="verSolicitud(vehicle.id)" role="button">Ver solicitud</button>
        </template>
      </Card>
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

.custom-toolbar {
  border-bottom: 2px solid #ddd;
}

.container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.half-width-card {
  flex: 1;
  width: calc(50% - 1rem);
  margin: 0.5rem;
  box-sizing: border-box;
  max-width: 50%;
}

.half-width-card p,
.half-width-card pv-input,
.half-width-card Button {
  font-size: 1rem;
}

.input-grid {
  display: flex;
  justify-content: space-between;
}

.input-column {
  flex: 1;
  padding: 0 1rem;
  box-sizing: border-box;
}

.custom-button2 {
  width: 30%;
  height: 30px;
  margin: 20px;
  background-color: #FF7A00;
  color: white;
  font-family: 'Poppins', sans-serif;
  border: none;
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

.custom-button2:hover {
  background-color: rgba(255, 122, 0, 0.9);
}

.custom-button3:hover {
  background-color: #CCCCCC;
  color: black
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-space {
  height: 20px;
}

.card-container {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px; 
}

.card-item {
  width: calc(33.33% - 10px);
  margin-bottom: 10px;
}

@media (max-width: 50vmin) {
  .half-width-card {
    max-width: 100%;
  }

  .input-grid {
    flex-direction: column;
  }
}
</style>
