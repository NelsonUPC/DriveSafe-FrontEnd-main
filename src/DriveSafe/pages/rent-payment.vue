<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import AlquilerService from '@/DriveSafe/services/rental.service';

const vehiculoFoto = ref(localStorage.getItem('vehiculoFoto'));
const vehiculoPrecio = ref(localStorage.getItem('vehiculoPrecio'));
const vehiculoTiempo = ref(localStorage.getItem('vehiculoTiempo'));
const fechaInicio = ref(localStorage.getItem('vehiculoFi'));
const fechaFin = ref(localStorage.getItem('vehiculoFf'));
const lugarRecojo = ref(localStorage.getItem('vehiculoLugar'));

const pagoProcesado = ref(false);

const items = [
  { label: "Inicio", to: "/home" },
  { label: "Buscar Autos", to: "/car-search-tenant" },
  { label: "Mantenimiento", to: "/manteinance-tenant" },
  { label: "Alquiler", to: "/rent-tenant" },
];

const pagarEfectivo = async () => {
  try {
    // Realizar el pago
    await pagar();
    // Mostrar el mensaje de pago procesado
    pagoProcesado.value = true;
  } catch (error) {
    console.error('Error al procesar el pago:', error);
  }
};

const pagar = async () => {
  try {
    // Obtener el ID de alquiler almacenado
    const alquilerId = parseInt(localStorage.getItem('alquilerId'));
    // Verificar si el ID de alquiler es válido
    if (!isNaN(alquilerId)) {
      // Obtener el alquiler por su ID
      const response = await AlquilerService.getById(alquilerId);
      const alquiler = response.data;
      // Actualizar el estado del alquiler a "Pagado"
      alquiler.estado = 'Pagado';
      // Actualizar el alquiler en la base de datos
      await AlquilerService.update(alquilerId, alquiler);
    } else {
      console.error('El ID de alquiler almacenado no es válido.');
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    throw error; // Propagar el error para manejarlo en la función de pago en efectivo
  }
};

</script>

<template>
  <pv-toast aria-live="polite" />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar" role="navigation">
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
          <router-link to="/profile-tenant" role="menuitem">
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
    <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">Pagar alquiler</h1>

    <Card>
      <template #title>
        <h2 class="card-title">Detalles del vehículo</h2>
      </template>
      <template #content>
        <img :src="vehiculoFoto" alt="Imagen del vehículo" style="max-width: 100%; height: auto;" />
        <h3 class="h3-method">Precio: {{ vehiculoPrecio }}</h3>
        <h3 class="h3-method">Tiempo: {{ vehiculoTiempo }}</h3>
        <h3 class="h3-method">Fecha de inicio: {{ fechaInicio }}</h3>
        <h3 class="h3-method">Fecha de fin: {{ fechaFin }}</h3>
        <h3 class="h3-method">Lugar de recojo: {{ lugarRecojo }}</h3>
      </template>
    </Card>

    <!-- Pregunta sobre el método de pago -->
    <div>
      <h3 class="h3-method">Seleccione método de pago:</h3>
      <button @click="pagarEfectivo('Efectivo')" class="btn-efectivo">Efectivo</button>
      <button><router-link to="/rent-payment-confirmation" class="btn-online">Online</router-link></button>
    </div>

    <h1 v-if="pagoProcesado" class="msg-procesado">El pago ha sido procesado correctamente. Deberá recoger el vehículo alquilado.</h1>
  </div>
</template>

<style scoped>
.custom-bg {
  background-color: #FFFFFF;
}

.custom-toolbar {
  border-bottom: 2px solid #1A2C63;
}

.custom-button {
  background-color: #FFA500;
  color: #000000;
}

.custom-button:hover,
.custom-button:focus {
  background-color: #1A2C63 !important;
  color: #FFFFFF !important;
}

.p-grid {
  margin-top: 20px;
}

.card-title {
  color: #FF7A00;
}

.h3-method{
  color: #000000;
}


.btn-efectivo {
  background-color: #1A2C63;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-efectivo:hover {
  background-color: #92C9ED;
}

.btn-online {
  background-color: #FFA500;
  color: #000000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-online:hover {
  background-color: #FF7A00;
  color: #FFFFFF;
}

.msg-procesado {
  color: green;
}
</style>