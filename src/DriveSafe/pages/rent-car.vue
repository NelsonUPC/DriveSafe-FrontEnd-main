<script>
import Swal from 'sweetalert2';
import Card from "primevue/card"
import Carousel from "primevue/carousel";
import InputText from "primevue/inputtext";
import VehiculoService from "@/DriveSafe/services/vehicle.service";
import AlquilerService from "@/DriveSafe/services/rental.service";
import {useRouter} from "vue-router";
import UserService from "@/DriveSafe/services/user.service";

export default {
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
      vehicle: null,
      rent_time: null,
      cost: null,
      owner: null,
      pick_up_place: null,
      router: useRouter(),
    };
  },
  methods: {
    abrirContratoAlquiler() {
      if (this.vehicle && this.vehicle.contratoAlquilerPdf) {
        window.open(this.vehicle.contratoAlquilerPdf, "_blank");
      }
    },
    crearAlquiler() {
      const alquilerData = {
        status: "Pending",
        start_date: new Date(1,0,1).toISOString().split('T')[0],
        end_date: new Date(1,0,1).toISOString().split('T')[0],
        vehicle_id: this.vehicle.id,
        owner_id: this.owner.id,
        tenant_id: parseInt(localStorage.getItem("usuarioId")),
        pick_up_place: this.vehicle.pick_up_place
      };

      console.log(alquilerData)

      // Llamamos al método create de AlquilerService para crear el alquiler
      AlquilerService.create(alquilerData)
          .then(() => {
            localStorage.setItem("vehiculoId", null);
            console.log("Alquiler creado con éxito.");
            // Mostrar alerta de éxito
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'El alquiler ha sido creado con éxito.',
            });
          })
          .catch((error) => {
            console.error("Error al crear alquiler:", error);
            // Mostrar alerta de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al crear el alquiler. Por favor, inténtalo de nuevo más tarde.',
            });
          });
    },
  },

  created() {
    const vehicle_id = localStorage.getItem("vehicle_id");
    if (vehicle_id) {
      VehiculoService.getAll()
          .then((response) => {
            const vehicleFind = response.data.find(
                (v) => v.id === parseInt(vehicle_id)
            );

            if (vehicleFind) {
              this.vehicle = vehicleFind;

              // Ahora obtenemos la información del owner
              UserService.getUserById(parseInt(this.vehicle.owner_id))
                  .then((response) => {
                    this.owner = response.data;
                    // Ahora que tenemos la información del owner, podemos imprimir la información del vehículo
                    console.log("Costo Total", this.vehicle.rental_cost);
                    console.log("Vehiculo Id", this.vehicle.id);
                    console.log("Propietario_id", parseInt(this.vehicle.owner_id));
                    console.log("Arrendatario_id", parseInt(localStorage.getItem("usuarioId")));
                    console.log("Lugar_recojo", this.vehicle.pick_up_place)
                  })
                  .catch((error) => {
                    console.error("Error al obtener la información del owner:", error);
                  });

            } else {
              console.error("No se encontró el vehículo con ID:", vehicle_id);
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

  <pv-toast aria-live="polite" />
  <div class="container" role="main">
    <div class="half-width-card">
      <Card role="region" aria-labelledby="card1Title">
        <template #title>
          <h2 id="card1Title" style="font-family: 'Poppins',sans-serif; text-align: center; color: #FF7A00;">Alquilar vehículo</h2>
        </template>
        <template #content>
          <div v-if="vehicle" class="center-content">
            <img
                :src="vehicle.url_image"
                alt="Imagen de vehículo"
                style="max-width: 100%; max-height: 300px;"
            />
            <div class="card-title">{{ vehicle.brand }} {{ vehicle.model }}</div>
            <Button @click="abrirContratoAlquiler" style="font-family: 'Poppins',sans-serif" class="font-button" role="button">Ver Contrato de Alquiler</Button>
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

          </div>
        </template>
        <template #content>
          <div>
            <h1>Contrato de Alquiler</h1>
            <h1>Mi nombre es {{ owner ? owner.name + ' ' + owner.last_name : '...' }}, yo como propietario del
              vehículo doy los siguientes reglamentos</h1>
          </div>
          <Button @click="crearAlquiler" style="font-family: 'Poppins',sans-serif" class="font-button" role="button">Crear Alquiler</Button>
        </template>
      </Card>
    </div>
  </div>
</template>



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
