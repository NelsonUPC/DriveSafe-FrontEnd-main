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
    <div class="half-width-card">
      <Card>
        <template #title></template>
        <template #content>
          <h1 style="font-family: 'Poppins', sans-serif; color:#FF7A00">Busca un auto</h1>
          <p style="font-family: 'Poppins', sans-serif">Tiempo de alquiler</p>
          <InputText v-model="filtro.tiempoAlquiler" placeholder="Tiempo de alquiler" style="font-family: 'Poppins', sans-serif"/>
          <p style="font-family: 'Poppins', sans-serif">Marca</p>
          <InputText v-model="filtro.marca" placeholder="Marca" style="font-family: 'Poppins', sans-serif"/>
          <p style="font-family: 'Poppins', sans-serif">Modelo</p>
          <InputText v-model="filtro.modelo" placeholder="Modelo" style="font-family: 'Poppins', sans-serif"/>
          <p style="font-family: 'Poppins', sans-serif">Clase</p>
          <InputText v-model="filtro.clase" placeholder="Clase" style="font-family: 'Poppins', sans-serif"/>
          <p style="font-family: 'Poppins', sans-serif">Transmisión</p>
          <InputText v-model="filtro.transmision" placeholder="Transmisión" style="font-family: 'Poppins', sans-serif"/>

          <!-- Agrega el botón de búsqueda -->
          <pv-button class="search-button" @click="buscarAutos" aria-label="search-button">Buscar</pv-button>
        </template>
      </Card>
    </div>
    <div class="half-width-card">
      <h1 style="font-family: 'Poppins',sans-serif; color: #FF7A00; text-align: center;">Vehiculos</h1>

      <div v-if="vehiculosDisponibles.length === 0" style="text-align: center; margin-top: 20px;">
        <h2 style="font-family: 'Poppins',sans-serif">No hay vehículos disponibles para alquilar por el momento.</h2>
      </div>

      <Carousel v-else :value="vehiculosDisponibles" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplayInterval="5000">
        <template #item="slotProps">
          <div class="border-1 surface-border border-round m-2 text-center py-5 px-3">
            <div class="mb-3">
              <img :src="slotProps.data.urlImagen" alt="Imagen de vehículo" class="w-6 shadow-2" />
              <div>
                <h1 style="font-family: 'Poppins',sans-serif">Marca: {{ slotProps.data.marca }}</h1>
                <h2 style="font-family: 'Poppins',sans-serif">Modelo: {{ slotProps.data.modelo }}</h2>
                <h2 style="font-family: 'Poppins',sans-serif">Clase: {{ slotProps.data.clase }}</h2>
                <h2 style="font-family: 'Poppins',sans-serif">Transmisión: {{ slotProps.data.transmision }}</h2>
                <h2 style="font-family: 'Poppins',sans-serif">Tipo de alquiler: {{ slotProps.data.tipoTiempo }}</h2>
                <h2 style="font-family: 'Poppins',sans-serif">Costo de alquiler: {{ slotProps.data.costoAlquiler }}</h2>
                <pv-button @click="alquilarAuto(slotProps.data.id)" class="font-button">Alquilar</pv-button><br>
              </div>
            </div>
          </div>
        </template>
      </Carousel>

    </div>
  </div>

</template>

<script>
import Card from "primevue/card"
import Carousel from "primevue/carousel";
import InputText from "primevue/inputtext";
import VehiculoService from "@/DriveSafe/services/vehiculo.service";
import {useRouter} from "vue-router";
export default{
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
      value1: null,
      cardCount: 4,
      vehiculos: [],
      vehiculos2: [],
      filtro: {
        tiempoAlquiler: null,
        marca: null,
        modelo: null,
        clase: null,
        transmision: null,
      },
    };
  },
  computed: {
    vehiculosDisponibles() {
      return this.vehiculos.filter(vehiculo => vehiculo.estadoRenta === "Disponible");
    },
  },
  methods: {
    alquilarAuto(vehiculoId) {
      localStorage.setItem("vehiculoId", vehiculoId);
      this.router.push({path:"/rent-car"});
    },
    buscarAutos() {
      this.vehiculosDisponibles = this.vehiculos.filter(vehiculo => {
        return (
            (!this.filtro.tiempoAlquiler || vehiculo.tiempoAlquiler.includes(this.filtro.tiempoAlquiler)) &&
            (!this.filtro.marca || vehiculo.marca.toLowerCase().includes(this.filtro.marca.toLowerCase())) &&
            (!this.filtro.modelo || vehiculo.modelo.toLowerCase().includes(this.filtro.modelo.toLowerCase())) &&
            (!this.filtro.clase || vehiculo.clase.toLowerCase().includes(this.filtro.clase.toLowerCase())) &&
            (!this.filtro.transmision || vehiculo.transmision.toLowerCase().includes(this.filtro.transmision.toLowerCase()))
        );
      });
    },
  },
  created() {
    // Obtiene la lista de vehículos al cargar el componente
    VehiculoService.getAll()
        .then((response) => {
          this.vehiculos = response.data;
          console.log("Vehiculos: ", this.vehiculos);
          console.log("Response data: ", response.data);
        })
        .catch((error) => {
          console.error("Error al obtener la lista de vehículos:", error);
        });
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

</style>