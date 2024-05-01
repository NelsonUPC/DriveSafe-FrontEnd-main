<template>
  <pv-toast aria-live="polite" />
  <header aria-label="Barra de navegación">
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
                aria-label="Botón de navegación"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-owner" aria-label="Perfil de usuario">>
            <img
                src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png"
                alt="Usuario"
                style="height: 30px; margin-left: 20px; cursor: pointer;"
                aria-label="Imagen de perfil del usuario"
            />
          </router-link>

        </div>
      </template>
    </pv-toolbar>
  </header>
  <div class="notifications-section" aria-label="Seccion de notificaciones">
    <h2 class="section-title" >Notificaciones</h2>
    <div v-if="notificacionesFiltradas.length === 0" class="notification-card">
      <p class="notification">No hay notificaciones disponibles.</p>
    </div>
    <div v-for="notification in notificacionesFiltradas" :key="notification.id" class="notification-card ">
      <p class="notification">{{ notification.body }}</p>
    </div>
  </div>
</template>

<script>
import NotificacionService from "@/DriveSafe/services/notificacion.service";
export default {
  name: "NotificacionesPropie",
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
.notifications-section {
  display: grid;
  grid-template-rows: 1fr;
  background-color: white;
  padding: 1px 30px 30px 30px;
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
}
.view-notification {
  color: #FF7A00;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  margin-right: 20px;
}
</style>
