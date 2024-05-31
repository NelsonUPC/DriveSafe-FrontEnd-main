<script>
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import VehiculoService from "@/DriveSafe/services/vehiculo.service";
import Swal from 'sweetalert2';

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
      options_car_class: [
        "Familiar",
        "Deportivo",
        "Cargo car",
        "SUV",
        "Sedan"
      ],
      options_transmission: [
        "Automático",
        "Manual"
      ],
      options_time_type: [
        "Diario",
        "Semanal",
        "Mensual"
      ],
      selected_time_type: null,
      selected_transmission: null,
      selected_car_class: null,
      brand: null,
      model: null,
      maximum_speed: null,
      consumption: null,
      dimensions: null,
      weight: null,
      rental_cost: null,
      pick_up_place: null,
      url_image: null,
    };
  },
  methods: {
    async registrarVehiculo() {
      // Validar campos obligatorios
      if (!this.brand || !this.model || !this.maximum_speed || !this.consumption || !this.dimensions || !this.weight || !this.selected_car_class || !this.selected_transmission || !this.selected_time_type || !this.rental_cost || !this.pick_up_place || !this.url_image) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Todos los campos deben estar llenos.',
        });
        return;
      }

      try {
        const data = {
          brand: this.brand,
          model: this.model,
          maximum_speed: parseInt(this.maximum_speed),
          consumption: parseInt(this.consumption),
          dimensions: this.dimensions,
          weight: parseInt(this.weight),
          car_class: this.selected_car_class,
          transmission: this.selected_transmission,
          time_type: this.selected_time_type,
          rental_cost: parseInt(this.rental_cost),
          pick_up_place: this.pick_up_place,
          url_image: this.url_image,
          rent_status: "Available",
          owner_id: parseInt(localStorage.getItem("usuarioId")),
        };

        await VehiculoService.create(data);

        // Limpiar los campos después de registrar
        this.brand = null;
        this.model = null;
        this.maximum_speed = null;
        this.consumption = null;
        this.dimensions = null;
        this.weight = null;
        this.rental_cost = null;
        this.pick_up_place = null;
        this.url_image = null;
        this.selected_time_type = null;
        this.selected_car_class = null;
        this.selected_transmission = null;

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El vehículo ha sido registrado correctamente.',
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un problema al registrar el vehículo.',
        });
      }
    }
  }
};
</script>

<template>
  <pv-toast/>
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
              <pv-input placeholder="Marca" v-model="brand" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Velocidad Max Km/Hr</strong></p>
              <pv-input placeholder="Velocidad Max Km/Hr" v-model="maximum_speed" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Dimensiones An-Lg-At</strong></p>
              <pv-input placeholder="Dimensiones An-Lg-At" v-model="dimensions" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Clase</strong></p>
              <Dropdown :options="options_car_class" placeholder="Selecciona una clase" v-model="selected_car_class" style="font-family: 'Poppins',sans-serif" />
              <p style="font-family: 'Poppins',sans-serif"><strong>Tipo de tiempo</strong></p>
              <Dropdown :options="options_time_type" placeholder="Selecciona un tipo de tiempo" v-model="selected_time_type" style="font-family: 'Poppins',sans-serif" />
              <p style="font-family: 'Poppins',sans-serif"><strong>Lugar de recojo del vehículo</strong></p>
              <pv-input placeholder="Lugar de recojo del vehículo" v-model="pick_up_place" style="font-family: 'Poppins',sans-serif"></pv-input>
            </div>
            <div class="input-column">
              <p style="font-family: 'Poppins',sans-serif"><strong>Modelo</strong></p>
              <pv-input placeholder="Modelo" v-model="model" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Consumo</strong></p>
              <pv-input placeholder="Consumo" v-model="consumption" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Peso</strong></p>
              <pv-input placeholder="Peso" v-model="weight" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>Transmisión</strong></p>
              <Dropdown :options="options_transmission" placeholder="Selecciona una transmisión" v-model="selected_transmission" style="font-family: 'Poppins',sans-serif" />
              <p style="font-family: 'Poppins',sans-serif"><strong>Costo de alquiler por tiempo</strong></p>
              <pv-input placeholder="Costo de alquiler por tiempo" v-model="rental_cost" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>URL de la imagen del vehículo</strong></p>
              <pv-input placeholder="URL de la imagen del vehículo" v-model="url_image" style="font-family: 'Poppins',sans-serif"></pv-input>
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
