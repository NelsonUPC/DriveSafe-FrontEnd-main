<script>
import AlquilerService from "@/DriveSafe/services/alquiler.service";
import VehiculoService from "@/DriveSafe/services/vehiculo.service";
import UserService from "@/DriveSafe/services/user.service";

import {useRouter} from "vue-router";
import ManteinanceService from "@/DriveSafe/services/manteinance.service";


export default {
  name: "NotificacionesPropie",
  data() {
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/init-propie" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
      alquileres: [],
      propietarioId: null,
      mantenimientos: [],
      router: useRouter()
    };
  },
  methods: {

    verSolicitud(alquilerId){
      localStorage.setItem("alquilerId", alquilerId);
      this.router.push('/read-request');
    },
    async loadMantenimientos() {
      try {
        const propietarioId = parseInt(localStorage.getItem("usuarioId"));
        const response = await ManteinanceService.getAll();
        const mantenimientosFiltrados = response.data.filter(mantenimiento => mantenimiento.propietario_id === propietarioId);

        // Crear un arreglo para almacenar todos los mantenimientos
        const mantenimientos = [];

        for (let mantenimiento of mantenimientosFiltrados) {
          // Obtener los datos del arrendatario
          const usuarioResponse = await UserService.getUserById(mantenimiento.arrendatario_id);
          const nombres = usuarioResponse.data.nombres;
          const apellidos = usuarioResponse.data.apellidos;

          // Obtener los datos del mantenimiento
          const descripcion = mantenimiento.descripcion;
          const titulo = mantenimiento.titulo;
          const tipoProblema = mantenimiento.tipo_problema;

          // Agregar los datos del mantenimiento al arreglo
          mantenimientos.push({
            nombres,
            apellidos,
            tipoProblema,
            titulo,
            descripcion
          });
        }

        // Asignar el arreglo de mantenimientos a la variable de datos mantenimientos
        this.mantenimientos = mantenimientos;
      } catch(error){
        console.error('Error al cargar los mantenimientos', error);
      }
    },

    async loadAlquileres() {
      try {
        const propietarioId = parseInt(localStorage.getItem("usuarioId"));
        const response = await AlquilerService.getAll();
        const alquileresFiltrados = response.data.filter(alquiler => alquiler.propietario_id === propietarioId);

        for (let alquiler of alquileresFiltrados) {
          const usuarioResponse = await UserService.getUserById(alquiler.arrendatario_id);
          console.log("Usuario", usuarioResponse);
          const vehiculoResponse = await VehiculoService.getById(alquiler.vehiculo_id);
          console.log("Vehiculo", vehiculoResponse);

          alquiler.arrendatarioNombre = `${usuarioResponse.data.nombres} ${usuarioResponse.data.apellidos}`;
          alquiler.vehiculoMarca = vehiculoResponse.data.marca;
          alquiler.vehiculoModelo = vehiculoResponse.data.modelo;
          alquiler.vehiculoImagen = vehiculoResponse.data.url_imagen;
        }

        this.alquileres = alquileresFiltrados;
      } catch (error) {
        console.error('Error al cargar los alquileres', error);
      }
    },
  },
  created() {
    // Obtener el ID del propietario del localStorage y convertirlo a un número entero
    const propietarioId = parseInt(localStorage.getItem("usuarioId"));

    // Verificar si el ID del propietario es válido antes de cargar los alquileres y los mantenimientos
    if (!isNaN(propietarioId)) {
      console.log('Propietario ID:', propietarioId);
      // Cargar los alquileres asociados al propietario
      this.loadAlquileres(propietarioId);
      // Cargar los mantenimientos asociados al propietario
      this.loadMantenimientos(propietarioId);
    } else {
      console.error('El ID del propietario no es válido.');
    }
  }
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
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-owner">
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
  <div class="notifications-section">
    <h2 class="section-title">Notificaciones</h2>
    <div v-if="alquileres.length === 0" class="notification-card">
      <p class="notification">No hay notificaciones disponibles.</p>
    </div>
    <div v-for="alquiler in alquileres" :key="alquiler.id" class="notification-card">
      <div class="notification-content">
        <div class="notification-text">
          <p>{{ alquiler.arrendatarioNombre }} envió una solicitud de alquiler del vehículo {{ alquiler.vehiculoMarca }} {{ alquiler.vehiculoModelo }}</p>
          <pv-button @click="verSolicitud(alquiler.id)" class="font-button">Alquilar</pv-button><br>
        </div>
        <div class="notification-actions">
          <img :src="alquiler.vehiculoImagen" alt="Imagen del vehículo" class="vehiculo-image" />
        </div>
      </div>
    </div>
    <div v-if="mantenimientos.length === 0" class="notification-card">
      <p class="notification">No hay mantenimientos disponibles.</p>
    </div>
    <div v-for="mantenimiento in mantenimientos" :key="mantenimiento.id" class="notification-card">
      <div class="notification-content">
        <div class="notification-text">
          <h1>{{ mantenimiento.nombres }} {{ mantenimiento.apellidos }}</h1>
          <h1>Tipo de problema: {{ mantenimiento.tipoProblema }}</h1>
          <h1>Título: {{ mantenimiento.titulo }}</h1>
          <h1>Descripción: {{ mantenimiento.descripcion }}</h1>
        </div>
      </div>
    </div>

  </div>
</template>


<style scoped>
.long-text {
  word-wrap: break-word;
}

.notifications-section {
  display: grid;
  grid-template-rows: 1fr;
  background-color: white;
  padding: 1px 30px 30px 30px;
  margin-top: 20px;
  font-family: 'Poppins', sans-serif;
}

.section-title {
  margin-top: 90px;
  font-size: 35px;
  font-weight: bold;
  color: #FF7A00;
}

.notification-card {
  padding: 20px;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
  margin-bottom: 5px;
}

.notification-card p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 130px); /* Ajusta el ancho máximo del texto y la imagen */
  font-weight: bold;
  padding-left: 30px;
  font-size: 18px; /* Ajusta el tamaño del texto */
}

.vehiculo-image {
  max-width: 100px; /* Ajusta el tamaño máximo de la imagen */
  height: auto; /* Hace que la altura de la imagen se ajuste automáticamente */
  margin-right: 20px; /* Espaciado derecho para separar la imagen del texto */
}

.view-request-button {
  background-color: #FF7A00;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px; /* Ajusta el tamaño del texto */
  cursor: pointer;
  transition: background-color 0.3s ease; /* Agrega una transición suave al cambio de color de fondo */
}

.view-request-button:hover {
  background-color: #FF6000; /* Cambia el color de fondo al pasar el mouse */
}

.notification-content {
  display: flex;
  align-items: center;
  flex-grow: 1; /* Permite que el texto ocupe todo el espacio restante */
  flex-wrap: wrap; /* Permite que los elementos se ajusten automáticamente en varias líneas */
}
</style>
