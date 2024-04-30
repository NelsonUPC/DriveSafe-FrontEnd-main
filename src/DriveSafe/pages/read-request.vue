<script>
import Card from 'primevue/card';
import VehiculoService from "@/AutoYa/services/vehiculo.service";
import {useRouter} from "vue-router";
import AlquilerService from "@/AutoYa/services/alquiler.service";
import ArrendatarioService from "@/AutoYa/services/arrendatario.service";
import NotificacionService from "@/AutoYa/services/notificacion.service";
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
      alquileres: [],
      alquileresFiltrados: [],
      vehiculo: null,
      nuevoVehiculo: null,
      vehiculos: [],
      vehiculoId: 0,
      vehiculosFiltrados: [],
      router: useRouter(),
    };
  },
  methods: {
    async cargarInformacion() {
      try {
        const response = await AlquilerService.getAll();
        // Filtrar alquileres por el id del vehiculo almacenado en localStorage
        this.alquileres = response.data;
        this.alquileresFiltrados = this.alquileres.filter(alquiler => alquiler.vehiculoId === parseInt(localStorage.getItem("vehiculoAlquiladoId")));

        const response2 = await VehiculoService.getAll();
        // Filtrar vehículos por el id del vehiculo almacenado en localStorage
        this.vehiculos = response2.data;
        this.vehiculosFiltrados = this.vehiculos.filter(vehiculo => vehiculo.id === parseInt(localStorage.getItem("vehiculoAlquiladoId")));

        this.vehiculoId = localStorage.getItem("vehiculoAlquiladoId");

        if (this.vehiculoId) {
          // Obtener información del vehículo por ID
          VehiculoService.getAll()
              .then((response) => {
                const vehiculoEncontrado = response.data.find(
                    (vehiculo) => vehiculo.id === parseInt(this.vehiculoId)
                );

                if (vehiculoEncontrado) {
                  this.vehiculo = vehiculoEncontrado;
                } else {
                  console.error("No se encontró el vehículo con ID:", this.vehiculoId);
                }

                console.log("ve", this.vehiculo);

                this.nuevoVehiculo = this.vehiculo;
                console.log("nv", this.nuevoVehiculo);
              })
              .catch((error) => {
                console.error("Error al obtener la lista de vehículos:", error);
              });
        } else {
          console.error("ID de vehículo no encontrado en el localStorage.");
        }
      } catch (error) {
        console.error("Error al cargar los alquileres:", error);
      }
    },
    abrirAntecedentesPenales() {
      const arrendatarioAntecedentes = this.vehiculosFiltrados[0].arrendatario.antecedentesPenalesPdf;
      if (arrendatarioAntecedentes) {
        window.open(arrendatarioAntecedentes, "_blank");
      }
    },
    aceptarAlquiler() {
      this.nuevoVehiculo.estadoRenta = "Aceptado";
      this.nuevoVehiculo.arrendatarioId = this.vehiculo.arrendatario.id;
      this.nuevoVehiculo.alquilerId = this.vehiculo.alquiler.id;
      console.log("nv", this.nuevoVehiculo);

      VehiculoService.update(this.vehiculo.id, this.nuevoVehiculo)
          .catch((error) => {
            console.error('Error al actualizar el vehículo:', error);
          });

      this.router.push({path:"/rent-owner"});
    },
    declinarAlquiler() {
      this.nuevoVehiculo.estadoRenta = "Disponible";
      this.nuevoVehiculo.arrendatarioId = null;
      this.nuevoVehiculo.alquilerId = null;

      VehiculoService.update(this.vehiculo.id, this.nuevoVehiculo)
          .catch((error) => {
            console.error('Error al actualizar el vehículo:', error);
          });

      this.router.push({path:"/rent-owner"});
    },
  },
  created() {
    // Cargar los vehículos al montar el componente
    this.cargarInformacion();
  },
};
</script>

<template>
  <pv-toast />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://github.com/AppWeb-Grupo3/DriveSafe-Project-report/blob/main/imagenes/logo.png?raw=true"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
            aria-label="Logo de la aplicación DriveSafe"
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
                style="background-color: white; color: #14131B;"
                :aria-label="`Ir a ${item.label}`"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-owner" aria-label="Perfil de usuario">
            <!-- Agrega la imagen a la derecha -->
            <img
                src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png"
                alt="Usuario"
                style="height: 30px; margin-left: 20px; cursor: pointer;"
                aria-label="Perfil de usuario"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>

  <div class="container">
    <div class="half-width-card">
      <Card>
        <template #title>

        </template>
        <template #content>
          <div v-for="vehiculo in vehiculosFiltrados" :key="vehiculo.id">
            <!-- Contenido del card con la información del vehículo -->
            <img :src="vehiculo.urlImagen" alt="Imagen del vehículo" style="max-width: 100%; height: auto;" />
            <h2 style="font-family: 'Poppins', sans-serif">Marca: {{ vehiculo.marca }}</h2>
            <h2 style="font-family: 'Poppins', sans-serif">Modelo: {{ vehiculo.modelo }}</h2>
            <h2 style="font-family: 'Poppins', sans-serif;">Arrendatario: {{ vehiculo.arrendatario.nombres }} {{vehiculo.arrendatario.apellidos}}</h2>

            <div v-for="alquiler in alquileresFiltrados" :key="alquiler.id">
              <h2 style="font-family: 'Poppins', sans-serif;">Precio del alquiler: S/. {{ alquiler.costo_total }}</h2>
            </div>

            <h2 style="font-family: 'Poppins', sans-serif; color: #FF7A00">Estado: {{ vehiculo.estadoRenta }}</h2>
          </div>
        </template>
      </Card>
    </div>

    <div class="half-width-card">
      <Card>
        <template #title>

        </template>
        <template #content>
          <Button @click="abrirAntecedentesPenales" style="font-family: 'Poppins',sans-serif" class="custom-button2" aria-label="Ver antecedentes penales del arrendatario">Ver antecedentes penales del arendatario</Button>
          <h2 style="font-family: 'Poppins', sans-serif">Opciones de alquiler:</h2>
          <Button @click="aceptarAlquiler" class="accept-button" aria-label="Aceptar">Aceptar</Button>
          <Button @click="declinarAlquiler" class="decline-button" aria-label="Declinar">Declinar</Button>

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
  background-color: #1A2C63 !important;
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
  width: auto;
  height: 30px;
  margin: 20px;
  background-color: #1A2C63;
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
  background-color: #1A2C63;
}

.custom-button3:hover {
  background-color: #CCCCCC;
  color: black
}

/* Estilo para el hover de los router-link */
.custom-button:hover,
.custom-button:focus {
  background-color: #1A2C63 !important;
  color: white !important;
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
  flex-wrap: wrap; /* Permite que los items se muevan a la siguiente línea cuando no hay suficiente espacio */
  gap: 10px; /* Espacio entre los items */
}

.card-item {
  width: calc(33.33% - 10px); /* Asegura que haya espacio entre los items */
  margin-bottom: 10px;
}

.accept-button {
  font-family: 'Poppins', sans-serif;
  background-color: #FF7A00; /* Cambiado a naranja */
  color: white;
  border: none;
  padding: 15px 30px;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.decline-button {
  font-family: 'Poppins', sans-serif;
  background-color: #1A2C63; /* Cambiado a azul */
  color: white;
  border: none;
  padding: 15px 30px;
  transition: background-color 0.3s;
}

.accept-button:hover {
  background-color: black; /* Hover negro */
}

.decline-button:hover {
  background-color: black; /* Hover negro */
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
