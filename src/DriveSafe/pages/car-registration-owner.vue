<script>
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import VehiculoService from "@/DriveSafe/services/vehiculo.service";
export default {
  components: {
    Card,
    Dropdown,
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
      claseOptions: [
        "Familiar",
        "Deportivo",
        "Cargo car",
        "SUV",
        "Sedan"
      ],
      transmisionOptions: [
        "Automático",
        "Manual"
      ],
      tiempoOptions: [
          "Diario",
          "Semanal",
          "Mensual"
      ],
      selectedTiempo: null,
      selectedTransmision: null,
      selectedClase: null,
      marca: null,
      modelo: null,
      velocidad: null,
      consumo: null,
      dimensiones: null,
      peso: null,
      tiempo: 0,
      costoAlquiler: null,
      lugarRecojo: null,
      urlImagen: null,
      mostrarInputUrlImagen: false,
    };
  },
  methods: {
    async registrarVehiculo() {
      try {
        const data = {
          marca: this.marca,
          modelo: this.modelo,
          velocidadMax: parseInt(this.velocidad),
          consumo: parseInt(this.consumo),
          dimensiones: this.dimensiones,
          peso: parseInt(this.peso),
          clase: this.selectedClase,
          transmision: this.selectedTransmision,
          tiempo: parseInt(this.tiempo),
          tipoTiempo: this.selectedTiempo,
          costoAlquiler: parseInt(this.costoAlquiler),
          lugarRecojo: this.lugarRecojo,
          urlImagen: this.urlImagen,
          contratoAlquilerPdf: localStorage.getItem("urlContrato"),
          estadoRenta: "AVAILABLE",
          propietarioId: parseInt(localStorage.getItem("propietarioId")),
          arrendatarioId: null,
          alquilerId: null
        };

        await VehiculoService.create(data);

        this.marca = null;
        this.modelo = null;
        this.velocidad = null;
        this.consumo = null;
        this.dimensiones = null;
        this.peso = null;
        this.tiempo = 0;
        this.costoAlquiler = null;
        this.lugarRecojo = null;
        this.urlImagen = null;
        localStorage.setItem("urlVehiculo", null);
        localStorage.setItem("urlContrato", null);
        this.selectedTiempo = null;
        this.selectedClase = null;
        this.selectedTransmision = null;

        console.log('Vehículo registrado exitosamente.');
        this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo registrado exitosamente.' });
      } catch (error) {
        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al registrar el vehículo.' });
        console.error('Error al registrar el vehículo', error);
      }
    },
    subirImagen() {
      this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Imagen subida exitosamente.' });
      localStorage.setItem("urlVehiculo", this.urlImagen);
    },
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
                aria-label="Navigate"
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

  <div class="container">
    <div class="half-width-card">
      <Card>
        <template #title>
        </template>
        <template #content>
          <h1 style="font-family: 'Poppins',sans-serif; color:#FF7A00">REGISTRO DE VEHÍCULO</h1>
          <div class="input-grid">
            <div class="input-column">
              <p style="font-family: 'Poppins',sans-serif"><strong>Marca</strong></p>
              <pv-input placeholder="Marca" v-model="marca" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Velocidad Max Km/Hr</strong></p>
              <pv-input placeholder="Velocidad Max Km/Hr" v-model="velocidad" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Dimensiones An-Lg-At</strong></p>
              <pv-input placeholder="Dimensiones An-Lg-At" v-model="dimensiones" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Clase</strong></p>
              <Dropdown :options="claseOptions" placeholder="Selecciona una clase" v-model="selectedClase" style="font-family: 'Poppins',sans-serif" />
              <p style="font-family: 'Poppins',sans-serif"><strong>Tipo de tiempo</strong></p>
              <Dropdown :options="tiempoOptions" placeholder="Selecciona un tipo de tiempo" v-model="selectedTiempo" style="font-family: 'Poppins',sans-serif" />
              <p style="font-family: 'Poppins',sans-serif"><strong>Lugar de recojo del vehículo</strong></p>
              <pv-input placeholder="Lugar de recojo del vehículo" v-model="lugarRecojo" style="font-family: 'Poppins',sans-serif"></pv-input>
            </div>
            <div class="input-column">
              <p style="font-family: 'Poppins',sans-serif"><strong>Modelo</strong></p>
              <pv-input placeholder="Modelo" v-model="modelo" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Consumo</strong></p>
              <pv-input placeholder="Consumo" v-model="consumo" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Peso</strong></p>
              <pv-input placeholder="Peso" v-model="peso" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Transmisión</strong></p>
              <Dropdown :options="transmisionOptions" placeholder="Selecciona una transmisión" v-model="selectedTransmision" style="font-family: 'Poppins',sans-serif" />
              <p style="font-family: 'Poppins',sans-serif"><strong>Costo de alquiler por tiempo</strong></p>
              <pv-input placeholder="Costo de alquiler por tiempo" v-model="costoAlquiler" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>URL de la imagen del vehículo</strong></p>
              <pv-input placeholder="URL de la imagen del vehículo" v-model="urlImagen" style="font-family: 'Poppins',sans-serif"></pv-input>
              <pv-button style="width: auto;" class="custom-button2" @click="subirImagen">SUBIR IMAGEN</pv-button>
            </div>
          </div>
          <div class="input-column">
            <Button label="REGISTRAR" class="custom-button2" @click="registrarVehiculo">REGISTRAR</Button>
          </div>
        </template>
      </Card>
    </div>
    <div class="half-width-card">
      <Card>
        <template #title></template>
        <template #content>
          <div class="button-container">
            <router-link to="/rent-contract-owner">
              <Button label="CREAR CONTRATO DE ALQUILER" class="custom-button3">CREAR CONTRATO DE ALQUILER</Button>
            </router-link>
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

@media (max-width: 50vmin) {
  .half-width-card {
    max-width: 100%;
  }

  .input-grid {
    flex-direction: column;
  }
}
</style>
