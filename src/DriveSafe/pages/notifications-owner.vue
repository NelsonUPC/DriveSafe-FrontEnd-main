<script>
import VehicleService from "@/DriveSafe/services/vehicle.service";
import UserService from "@/DriveSafe/services/user.service";
import {useRouter} from "vue-router";
import MaintenanceService from "@/DriveSafe/services/maintenance.service";
import RentService from "@/DriveSafe/services/rent.service";

export default {
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home-owner" },
        { label: this.$t('Menu.register'), to: "/car-registration-owner" },
        { label: this.$t('Menu.notifications'), to: "/notifications" },
        { label: this.$t('Menu.rent'), to: "/rent-owner" },
      ];
    },
  },
  name: "NotificationsOwner",
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      rents: [],
      tenant_id: null,
      maintenances: [],
      router: useRouter()
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    seeRequest(rent_id){
      localStorage.setItem("alquilerId", rent_id);
      this.router.push('/read-request');
    },
    async loadMaintenances() {
      try {
        const ownerId = parseInt(localStorage.getItem("usuarioId"));
        const response = await MaintenanceService.getAll();
        const maintenancesFiltered = response.data.filter(m => m.owner_id === ownerId);

        // Crear un arreglo para almacenar todos los maintenances
        const maintenances = [];

        for (let maintenance of maintenancesFiltered) {
          // Obtener los datos del arrendatario
          const maintenanceId = maintenance.id;
          const userResponse = await UserService.getUserById(maintenance.tenant_id);
          const name = userResponse.data.name;
          const last_name = userResponse.data.last_name;

          // Obtener los datos del mantenimiento
          const description = maintenance.description;
          const title = maintenance.title;
          const type_problem = maintenance.type_problem;

          // Agregar los datos del mantenimiento al arreglo
          maintenances.push({
            id: maintenanceId,
            name: name,
            last_name: last_name,
            type_problem: type_problem,
            title: title,
            description: description
          });
        }

        // Asignar el arreglo de maintenances a la variable de datos maintenances
        this.maintenances = maintenances;
      } catch(error){
        console.error('Error al cargar los maintenances', error);
      }
    },
    async loadRents() {
      try {
        const ownerId = parseInt(localStorage.getItem("usuarioId"));
        const response = await RentService.getAll();
        const rentsFiltered = response.data.filter(r => r.owner_id === ownerId);
        for (let rent of rentsFiltered) {
          const rentId = rent.id;
          const userResponse = await UserService.getUserById(rent.tenant_id);
          console.log("Usuario", userResponse);
          const vehicleResponse = await VehicleService.getById(rent.vehicle_id);
          console.log("Vehiculo", vehicleResponse);

          rent.tenant_name = `${userResponse.data.name} ${userResponse.data.last_name}`;
          rent.vehicle_brand = vehicleResponse.data.brand;
          rent.vehicle_model = vehicleResponse.data.model;
          rent.vehicle_image = vehicleResponse.data.url_image;
        }
        this.rents = rentsFiltered;

        console.log(this.rents)
      } catch (error) {
        console.error('Error al cargar los rents', error);
      }
    },
  },
  created() {
    // Obtener el ID del propietario del localStorage y convertirlo a un número entero
    const ownerId = parseInt(localStorage.getItem("usuarioId"));

    // Verificar si el ID del propietario es válido antes de cargar los rents y los maintenances
    if (!isNaN(ownerId)) {
      console.log('Propietario ID:', ownerId);
      // Cargar los rents asociados al propietario
      this.loadRents(ownerId);
      // Cargar los maintenances asociados al propietario
      this.loadMaintenances(ownerId);
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
            src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
        <div class="language-buttons">
          <button class="language-button" @click="switchLanguage" aria-label="Switch Language">
            {{ selectedLanguage === 'en' ? 'ES' : 'EN' }}
          </button>
        </div>
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
    <h2 class="section-title">{{ $t('NotificationsOwner.title1') }}</h2>
    <div v-if="rents.length === 0" class="notification-card">
      <p class="notification">{{ $t('NotificationsOwner.no_rentals') }}</p>
    </div>
    <div v-for="rent in rents" :key="rent.id" class="notification-card">
      <div class="notification-content">
        <div class="notification-text">
          <p>{{ rent.tenant_name }} {{ $t('NotificationsOwner.rental_request') }} {{ rent.vehicle_brand }} {{ rent.vehicle_model }}</p>
          <pv-button @click="seeRequest(rent.id)" class="font-button">{{ $t('NotificationsOwner.see_rental') }}</pv-button><br>
        </div>
        <div class="notification-actions">
          <img :src="rent.vehicle_image" alt="Imagen del vehículo" class="vehiculo-image" />
        </div>
      </div>
    </div>
    <div v-if="maintenances.length === 0" class="notification-card">
      <p class="notification">{{ $t('NotificationsOwner.no_maintenances') }}</p>
    </div>
    <div v-for="maintenance in maintenances" :key="maintenance.id" class="notification-card">
      <div class="notification-content">
        <div class="notification-text">
          <h1>{{ maintenance.name }} {{ maintenance.last_name }}</h1>
          <h1>{{ $t('NotificationsOwner.type_problem') }}: {{ maintenance.type_problem }}</h1>
          <h1>{{ $t('NotificationsOwner.title2') }}: {{ maintenance.title }}</h1>
          <h1>{{ $t('NotificationsOwner.description') }}: {{ maintenance.description }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
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