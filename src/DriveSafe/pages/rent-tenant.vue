<script>
import Card from "primevue/card";
import VehiculoService from "@/DriveSafe/services/vehicle.service";
import AlquilerService from "@/DriveSafe/services/rental.service";
import UserService from "@/DriveSafe/services/user.service";
import router from "@/router";

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
      alquileres: [],
    };
  },
  methods: {
    async cargarAlquileres() {
      try {
        const usuarioId = parseInt(localStorage.getItem("usuarioId"));
        console.log("Usuario ID:", usuarioId);
        const response = await AlquilerService.getByUserId(usuarioId);
        console.log("Response:", response);
        this.alquileres = response.data;

        // Obtener detalles del vehículo y del propietario para cada alquiler
        for (const alquiler of this.alquileres) {
          const vehiculoResponse = await VehiculoService.getById(alquiler.vehiculo_id);
          console.log("Vehículo Response:", vehiculoResponse);
          alquiler.vehiculo = vehiculoResponse.data;

          const propietarioResponse = await UserService.getUserById(alquiler.propietario_id);
          console.log("Propietario Response:", propietarioResponse);
          alquiler.propietario = propietarioResponse.data;
        }

        console.log("Alquileres:", this.alquileres);
      } catch (error) {
        console.error("Error al cargar los alquileres:", error);
      }
    },
    irAPagar(alquiler) {
      localStorage.setItem("alquilerId", alquiler.id)
      localStorage.setItem("vehiculoId", alquiler.vehiculo.id)
      localStorage.setItem("vehiculoPrecio", alquiler.vehiculo.costo_alquiler)
      localStorage.setItem("vehiculoTiempo", alquiler.vehiculo.tipo_tiempo)
      localStorage.setItem("vehiculoFi", alquiler.fecha_inicio)
      localStorage.setItem("vehiculoFf", alquiler.fecha_fin)
      localStorage.setItem("vehiculoLugar", alquiler.vehiculo.lugar_recojo)
      localStorage.setItem("vehiculoFoto", alquiler.vehiculo.url_imagen)
      console.log("Ir a pagar por el alquiler:", alquiler);



      router.push({path: "/rent-payment"});
    }
  },
  created() {
    this.cargarAlquileres();
  },
};
</script>

<template>
  <div>
    <header>
      <pv-toolbar class="custom-bg custom-toolbar">
        <template #start>
          <img src="https://imgur.com/a/DWk9R7P" alt="Logo" style="height: 40px; margin-right: 20px;" />
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
      <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">Alquileres solicitados por el usuario</h1>
      <div v-if="alquileres.length === 0">
        <p>No se encontraron alquileres solicitados.</p>
      </div>
      <div v-else>
        <div v-for="alquiler in alquileres" :key="alquiler.id">
          <Card class="custom-card">
            <template #title>
              <h2>Detalles del alquiler </h2>
            </template>
            <template #content>
              <p>Marca: {{ alquiler.vehiculo ? alquiler.vehiculo.marca : 'No disponible' }}</p>
              <p>Modelo: {{ alquiler.vehiculo ? alquiler.vehiculo.modelo : 'No disponible' }}</p>
              <p>Propietario: {{ alquiler.propietario ? alquiler.propietario.nombres + " " + alquiler.propietario.apellidos : 'No disponible' }}</p>
              <p>Telefono: {{ alquiler.propietario ? alquiler.propietario.telefono : 'No disponible' }}</p>
              <p>Fecha de inicio: {{ alquiler.fecha_inicio }}</p>
              <p>Fecha de fin: {{ alquiler.fecha_fin }}</p>
              <p>Lugar de recojo: {{ alquiler.vehiculo ? alquiler.vehiculo.lugar_recojo : 'No disponible'}}</p>

              <!-- Agregar botón para ir a pagar si el estado del alquiler es 'Aceptado' -->
              <div v-if="alquiler.estado === 'Aceptado'"> <h3>Solicitud aceptada</h3></div>
              <button v-if="alquiler.estado === 'Aceptado'" @click="irAPagar(alquiler)" class="custom-button">Ir a Pagar</button>
              <div v-if="alquiler.estado === 'Pendiente'"> <h3>Solicitud en espera</h3></div>
              <div v-if="alquiler.estado === 'Rechazado'"> <h3>Solicitud rechazada</h3></div>
              <div v-if="alquiler.estado === 'Pagado'"><h3>Pagado</h3></div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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

.custom-card {
  border: 2px solid #92C9ED;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}
</style>