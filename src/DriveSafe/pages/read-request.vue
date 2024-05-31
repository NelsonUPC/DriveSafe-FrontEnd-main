<script>
import Card from 'primevue/card';
import VehiculoService from "@/DriveSafe/services/vehiculo.service";
import AlquilerService from "@/DriveSafe/services/alquiler.service";
import UserService from "@/DriveSafe/services/user.service";
import { useRouter } from "vue-router";

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
      alquiler: null,
      arrendatario: null,
      vehiculo: null,
      router: useRouter(),
    };
  },
  methods: {
    async cargarInformacion() {
      try {
        const alquilerId = parseInt(localStorage.getItem("alquilerId"));

        const response = await AlquilerService.getById(alquilerId);
        this.alquiler = response.data;

        const arrendatarioResponse = await UserService.getUserById(this.alquiler.arrendatario_id);
        this.arrendatario = arrendatarioResponse.data;

        const vehiculoResponse = await VehiculoService.getById(this.alquiler.vehiculo_id);
        this.vehiculo = vehiculoResponse.data;
      } catch (error) {
        console.error("Error al cargar la información del alquiler:", error);
      }
    },
    abrirAntecedentesPenales() {
      const arrendatarioAntecedentes = this.arrendatario.antecedentesPenalesPdf;
      if (arrendatarioAntecedentes) {
        window.open(arrendatarioAntecedentes, "_blank");
      }
    },
    async aceptarAlquiler() {
      try {
        const response = await AlquilerService.getById(this.alquiler.id);
        const alquilerCompleto = response.data;

        let fechaFormateada = " ";
        let fechaFormateadaF = " ";
        alquilerCompleto.estado = "Aceptado";

        const today = new Date();
        const dia = today.getDate().toString().padStart(2, '0');
        const mes = (today.getMonth() + 1).toString().padStart(2, '0');
        const anio = today.getFullYear();

        fechaFormateada = `${anio}-${mes}-${dia}`;

        let diasAdicionales = 0;
        if (this.vehiculo.tipo_tiempo === "Diario") {
          diasAdicionales = 1;
        } else if (this.vehiculo.tipo_tiempo === "Semanal") {
          diasAdicionales = 7;
        } else if (this.vehiculo.tipo_tiempo === "Mensual") {
          diasAdicionales = 30;
        }

        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + diasAdicionales);
        const diaf = futureDate.getDate().toString().padStart(2, '0');
        const mesf = (futureDate.getMonth() + 1).toString().padStart(2, '0');
        const aniof = futureDate.getFullYear();

        fechaFormateadaF = `${aniof}-${mesf}-${diaf}`;

        alquilerCompleto.fecha_inicio = fechaFormateada;
        alquilerCompleto.fecha_fin = fechaFormateadaF;

        await AlquilerService.update(this.alquiler.id, alquilerCompleto);
        this.alquiler.estado = "Aceptado";
      } catch (error) {
        console.error("Error al aceptar el alquiler:", error);
      }
    },
    async declinarAlquiler() {
      try {
        const response = await AlquilerService.getById(this.alquiler.id);
        const alquilerCompleto = response.data;

        alquilerCompleto.estado = "Rechazado";
        await AlquilerService.update(this.alquiler.id, alquilerCompleto);
        this.alquiler.estado = "Rechazado";
      } catch (error) {
        console.error("Error al declinar el alquiler:", error);
      }
    },
  },
  created() {
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
            src="https://imgur.com/a/DWk9R7P"
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
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-owner" aria-label="Perfil de usuario">
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
      <Card v-if="arrendatario">
        <template #title>
          <h1 style="font-family: 'Poppins', sans-serif">Alquiler</h1>
        </template>
        <template #content>
          <div>
            <h2>Nombres: {{ arrendatario.nombres }}</h2>
            <h2>Apellidos: {{ arrendatario.apellidos }}</h2>
            <h2>Celular: {{ arrendatario.telefono }}</h2>
            <h2>Correo: {{ arrendatario.correo }}</h2>
          </div>
          <div>
          </div>
        </template>
      </Card>
    </div>

    <div class="half-width-card">
      <Card>
        <template #title>

        </template>
        <template #content>
          <Button @click="abrirAntecedentesPenales" style="font-family: 'Poppins', sans-serif" class="custom-button2" aria-label="Ver antecedentes penales del arrendatario">Ver antecedentes penales del arrendatario</Button>
          <h2 style="font-family: 'Poppins', sans-serif">Opciones de alquiler:</h2>

          <div v-if="alquiler">
            <div v-if="alquiler.estado === 'Aceptado'">
              <p>La solicitud ha sido aceptada.</p>
            </div>
            <div v-if="alquiler.estado === 'Pagado'">
              <p>La solicitud ha sido pagada.</p>
            </div>
            <div v-if="alquiler.estado === 'Pendiente'">
              <Button @click="aceptarAlquiler" class="accept-button" aria-label="Aceptar">Aceptar</Button>
              <Button @click="declinarAlquiler" class="decline-button" aria-label="Declinar">Declinar</Button>
            </div>
            <div v-if="alquiler.estado === 'Rechazado'">
              <p>La solicitud ha sido rechazada.</p>
            </div>
          </div>

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
  flex-wrap: wrap;
  gap: 10px;
}

.card-item {
  width: calc(33.33% - 10px);
  margin-bottom: 10px;
}

.accept-button {
  font-family: 'Poppins', sans-serif;
  background-color: #FF7A00;
  color: white;
  border: none;
  padding: 15px 30px;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.decline-button {
  font-family: 'Poppins', sans-serif;
  background-color: #1A2C63;
  color: white;
  border: none;
  padding: 15px 30px;
  transition: background-color 0.3s;
}

.accept-button:hover {
  background-color: black;
}

.decline-button:hover {
  background-color: black;
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
