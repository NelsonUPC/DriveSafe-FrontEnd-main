<template>
  <pv-toast aria-live="polite" />
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
</template>
<pv-toast aria-live="polite" />
  <div class="container">
    <div class="half-width-card">
       <Card role="region" aria-labelledby="card1Title">
        <template #title>
          <h2 id="card1Title" style="font-family: 'Poppins',sans-serif; text-align: center; color: #FF7A00;">Alquilar vehículo</h2>
        </template>
        <template #content>
          <div v-if="vehiculo" class="center-content">
            <img
                :src="vehiculo.urlImagen"
                alt="Imagen de vehículo"
                style="max-width: 100%; max-height: 300px;"
            />
            <div class="card-title">{{ vehiculo.marca }} {{ vehiculo.modelo }}</div>
            <div style="font-family: 'Poppins',sans-serif">Velocidad Máxima: {{ vehiculo.velocidadMax }}</div>
            <div style="font-family: 'Poppins',sans-serif">Consumo: {{ vehiculo.consumo }}</div>
            <div style="font-family: 'Poppins',sans-serif">Dimensiones: {{ vehiculo.dimensiones }}</div>
            <div style="font-family: 'Poppins',sans-serif">Peso: {{ vehiculo.peso }}</div>
            <div style="font-family: 'Poppins',sans-serif">Clase: {{ vehiculo.clase }}</div>
            <div style="font-family: 'Poppins',sans-serif">Transmisión: {{ vehiculo.transmision }}</div>
            <div style="font-family: 'Poppins',sans-serif">Tipo de Alquiler: {{ vehiculo.tipoTiempo }}</div>
            <div style="font-family: 'Poppins',sans-serif">Costo de Alquiler: {{ vehiculo.costoAlquiler }}</div>
            <div style="font-family: 'Poppins',sans-serif">Lugar de Recojo: {{ vehiculo.lugarRecojo }}</div>
            <div style="font-family: 'Poppins',sans-serif">Propietario: {{ vehiculo.propietario.nombres }} {{vehiculo.propietario.apellidos}}</div><br>
            <Button @click="abrirContratoAlquiler" style="font-family: 'Poppins',sans-serif" class="font-button">Ver Contrato de Alquiler</Button>
          </div>
          <div v-else>
            <p>Cargando información del vehículo...</p>
          </div>
        </template>
      </Card>
    </div>
    <div class="half-width-card">
      <Card role="form" aria-labelledby="card2Title">
        <template #title>
          <div style="text-align: center;">
            <h1 id="card2Title" style="font-family: 'Poppins', sans-serif; color: #FF7A00;">Calcular Costo de Alquiler</h1>
          </div>
        </template>
        <template #content>
          <div>
            <h2 style="text-align: center;">Ingrese el tiempo de alquiler</h2>
            <div class="p-inputgroup input-container">
              <InputText type="number" style="text-align: center;" v-model="tiempoAlquiler" placeholder="Ingrese el tiempo de alquiler" role="spinbutton" />
            </div><br>
            <div style="text-align: center;">
              <Button @click="calcularCosto" class="font-button" role="button">Calcular</Button>
            </div><br>
            <h2 style="text-align: center;">Resultado del cálculo:</h2>
            <div v-if="resultadoCosto !== null" class="orange-text-body">
              S/. {{ resultadoCosto }}<br><br>
              El pago deberá realizarse en efectivo<br><br>
              <Button @click="solicitarAlquiler" class="font-button">Solicitar Alquiler</Button>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>

</template>

<script>
import Card from "primevue/card"
import Carousel from "primevue/carousel";
import InputText from "primevue/inputtext";
import VehiculoService from "@/DriveSafe/services/vehiculo.service";
import NotificacionService from "@/DriveSafe/services/notificacion.service";
import AlquilerService from "@/DriveSafe/services/alquiler.service";
import {useRouter} from "vue-router";
export default{
  components: {
    Card,
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
      value1: null,
      cardCount: 4,
      vehiculo: null,
      tiempoAlquiler: null,
      resultadoCosto: null,
      nuevoVehiculo: null,
      router: useRouter(),
    };
  },
  methods: {
    abrirContratoAlquiler() {
      if (this.vehiculo && this.vehiculo.contratoAlquilerPdf) {
        window.open(this.vehiculo.contratoAlquilerPdf, "_blank");
      }
    },
    calcularCosto() {
      if (this.tiempoAlquiler !== null && !isNaN(this.tiempoAlquiler) && this.vehiculo) {
        this.resultadoCosto = this.tiempoAlquiler * this.vehiculo.costoAlquiler;
      } else {
        this.resultadoCosto = null;
      }
    },
    solicitarAlquiler() {
      this.nuevoVehiculo = this.vehiculo;
      this.nuevoVehiculo.estadoRenta = "Solicitado";
      this.nuevoVehiculo.arrendatarioId = localStorage.getItem("arrendatarioId");
      this.nuevoVehiculo.tiempo = parseInt(this.tiempoAlquiler);
      VehiculoService.update(this.vehiculo.id, this.nuevoVehiculo)
          .then(() => {
            const notificacionData = {
              body: `${localStorage.getItem("arrendatarioNombres")} ${localStorage.getItem("arrendatarioApellidos")} ha solicitado alquilar el vehículo ${this.nuevoVehiculo.marca} ${this.nuevoVehiculo.modelo}, el pago total será de S/. ${this.resultadoCosto}.`,
              propietarioId: parseInt(this.nuevoVehiculo.propietario.id),
              arrendatarioId: parseInt(localStorage.getItem("arrendatarioId")),
            };

            const fechaActual = new Date();
            const dia = fechaActual.getDate().toString().padStart(2, '0'); 
            const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
            const anio = fechaActual.getFullYear();

            const fechaFormateada = `${dia}-${mes}-${anio}`;

            const alquilerData = {
              estado: "Solicitado",
              fecha_inicio: fechaFormateada,
              fecha_fin: "fechaFin",
              costo_total: this.resultadoCosto,
              vehiculoId: this.nuevoVehiculo.id,
              propietarioId: parseInt(this.nuevoVehiculo.propietario.id),
              arrendatarioId: parseInt(localStorage.getItem("arrendatarioId")),
            };

            AlquilerService.create(alquilerData)

            NotificacionService.create(notificacionData)
                .then(() => {
                  console.log("Notificación creada con éxito.");
                })
                .catch((error) => {
                  console.error("Error al crear notificación:", error);
                });
          })
          .catch((error) => {
            console.error('Error al solicitar alquiler:', error);
          });
      this.router.push({path:"/rent-tenant"});
    },
  },
  
  created() {
    const vehiculoId = localStorage.getItem("vehiculoId");

    if (vehiculoId) {
      VehiculoService.getAll()
          .then((response) => {
            const vehiculoEncontrado = response.data.find(
                (vehiculo) => vehiculo.id === parseInt(vehiculoId)
            );

            if (vehiculoEncontrado) {
              this.vehiculo = vehiculoEncontrado;
            } else {
              console.error("No se encontró el vehículo con ID:", vehiculoId);
            }
          })
          .catch((error) => {
            console.error("Error al obtener la lista de vehículos:", error);
          });
    } else {
      console.error("ID de vehículo no encontrado en el localStorage.");
    }
  },
};
</script>

<style scoped>
.body-container {
  margin: 20px;
  position: relative;
  height: 500px;
}
.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.9;
}
.floating-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  background-color: white;
  padding: 20px 50px 20px 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  border-radius: 15px;

}
.orange-text {
  color: #FF7A00;
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
}
.black-text {
  color: black;
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
}
.input-button-container {
  display: flex;
  align-items: center;
}
.input-container {
  display: flex;
  grid-gap: 40px;
  margin-top: 40px;
}
input {
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px rgba(0, 0, 0, 0.1);
}
.search-button {
  background-color: black;
  color: white;
  padding: 10px 70px 20px 70px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;
}
.black-text-body{
  color: black;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  text-align: center;
  padding: 10px;
}
.orange-text-body{
  color: #FF7A00;
  font-size: 18px;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  text-align: center;
  padding: 10px;
}

.card-carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-right: 50px;
  padding-left: 50px;
}
.card-carousel {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.hidden-card{
  display: none;
}
.left-arrow {
  margin-right: 10px;
}
.right-arrow {
  margin-left: 10px;
}
.carousel-cards {
  display: flex;
  overflow-x: hidden;
}
.card {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  flex: 1;
  max-width: 300px;
  margin:10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.card img {
  max-height: 70%;
  object-fit: contain;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 20px;
}
.card-title {
  font-size: 16px;
  margin-top: 10px;
  color: black;

}
.card-link {
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
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

.font-button {
  margin: 2px 0;
  background-color: black !important;
  color: white !important;
}

.font-button:hover,
.font-button:focus{
  background-color: #14131B !important;
  color: white !important;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
