<template>
  <pv-toast />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://i.imgur.com/hIAgH3Z.png"
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
                aria-label="Imagen-usuario"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>
  <div>

    <div class="body-container">
      <img src="../../../public/cuerpo.jpg" alt="Imagen de fondo" class="background-image" aria-label="Background">

      <div class="floating-card">
        <h1 class="orange-text">Convierte tu auto</h1>
        <h1 class="black-text">en dinero extra</h1>

        <div class="input-button-container">
          <div class="input-container">
            <input type="text" id="ubicacion" placeholder="Surco - Lima, Perú">

            <router-link to="/car-registration-owner">
              <button class="share-button">Comparte tu auto</button>
            </router-link>

          </div>
        </div>
      </div>
    </div>
    <div class="notifications-section">
      <h2 class="section-title">Notificaciones</h2>
      <div v-if="notificacionesFiltradas.length === 0">No hay notificaciones</div>
      <div v-else>
        <div v-for="notification in notificacionesFiltradas" :key="notification.id" class="notification-card">
          <p class="notification">{{ notification.body }}</p>
          <router-link :to="'/notification/' + notification.id" class="view-notification">Ver</router-link>
        </div>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<script>
import NotificacionService from "@/DriveSafe/services/notificacion.service";
export default{
  name: "InicioPropie",
  data() {
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/init-propie" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
      notifications: [],
      notificacionesFiltradas: [],
      propietarioId: null,
    };
  },
  methods: {
    async loadNotifications() {
      try {
        console.log('Propietario ID:', this.propietarioId);
        const response = await NotificacionService.getAll();
        console.log(response.data);
        this.notifications = response.data;
        this.notificacionesFiltradas = this.notifications.filter(notification => notification.propietarioId == this.propietarioId);
        console.log('Notificaciones:', this.notifications);
        console.log('Notificaciones filtradas:', this.notificacionesFiltradas);
      } catch (error) {
        console.error('Error al cargar las notificaciones', error);
      }
    },
  },
  created() {
    this.propietarioId = localStorage.getItem("propietarioId");
    console.log('Propietario ID:', localStorage.getItem("propietarioId"));
    this.loadNotifications();
  }
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
    padding: 20px 20px 20px 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    border-radius: 15px;
    padding-right: 50px;
    padding-left: 50px;

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
  .share-button {
    background-color: #FF7A00;
    color: white;
    padding: 10px 50px 10px 50px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
    white-space: nowrap;
  }

  .notifications-section {
    display: grid;
    grid-template-rows: 1fr;
    background-color: white;
    padding: 1px 60px 60px 60px;
    margin-top: 20px;
    font-family: 'Poppins', sans-serif;

  }
  .notification{
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
    font-weight: bold;
    padding-left: 30px;
  }
  .section-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .notification-card {
    background-color: white;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .notification-card p {
    margin: 0;
  }
  .view-notification {
    background-color: #FF7A00;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    text-decoration: none;
  }
</style>
