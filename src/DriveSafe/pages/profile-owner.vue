<script>
export default {
  data(){
    return {
      user: {
        name: '',
        lastName: '',
        photo: localStorage.getItem("fotoOwner"),
        phone: '',
        email: '',
        birthday: '',
      },
      drawer: false,
      items: [
        { label: "Inicio", to: "/init-propie" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
    };
  },
  methods: {
    async cargarInformacionPropietario() {
      try {
        this.user.name = localStorage.getItem("usuarioNombres");

        this.user.lastName = localStorage.getItem("usuarioApellidos");

        this.user.phone = localStorage.getItem("usuarioCelular");

        this.user.email = localStorage.getItem("usuarioCorreo");

      } catch (error) {
        console.error("Error al cargar la información del propietario:", error);
      }
    },
    cerrarSesion() {
      this.$router.push('/login');
      localStorage.clear()
    },
  },
  created() {
    this.cargarInformacionPropietario();
  },
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header aria-label="Barra de navegación">
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
                aria-label="Botón de navegación"
            >
              {{ item.label }}
            </pv-button>
          </router-link >
          <router-link to="/profile-owner" aria-label="Enlace al perfil del propietario">
            <img
                src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png"

                alt="Usuario"
                style="height: 30px; margin-left: 20px; cursor: pointer;"
                aria-label="Imagen de perfil del propietario"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>

  </header>
  <body>
  <div class="profile-container" aria-label="Contenedor del perfil del usuario">
    <div class="left-column" aria-label="Columna izquierda del perfil del usuario">
      <div class="title" aria-label="Título del perfil del usuario">
        <h1>Perfil del Usuario</h1>
        <h2>Propietario</h2>
      </div>
      <div class="profile-info" aria-label="Información del perfil del usuario">
        <h2>Nombres: </h2>
        <h2>{{ user.name }}</h2><br>
        <h2>Apellidos: </h2>
        <h2>{{user.lastName}}</h2><br>
        <h2>Celular: </h2>
        <h2>{{user.phone}}</h2><br>
        <h2>Correo: </h2>
        <h2>{{user.email}}</h2><br>
        <h2>Fecha de nacimiento: </h2>
        <h2>{{user.birthday}}</h2><br>
      </div>
      <div class="buttons" aria-label="Botones del perfil del usuario">
        <router-link to="/update-owner" aria-label="Enlace para actualizar datos del propietario">
          <pv-button class="font-button">Actualizar datos</pv-button><br>
        </router-link>

        <pv-button class="font-button" @click="cerrarSesion" aria-label="Botón para cerrar sesión">Cerrar Sesión</pv-button>
      </div>
    </div>
    <div class="right-column" aria-label="Columna derecha del perfil del usuario">
      <div class="profile-image-container" aria-label="Contenedor de la imagen de perfil del usuario">
        <div class="profile-image">
          <img :src="'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png' " alt="Profile Picture" class="size-photo" aria-label="Imagen de perfil del usuario"/>
        </div>
      </div>
    </div>
  </div>
  </body>
</template>


<style scoped>
  
body{
  font-family: 'Poppins', sans-serif;
  color: black;
  background-color: white;
}
.custom-bg {
  background-color: white;
}
.custom-button, .font-button {
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
.profile-button {
  text-align: center;
  margin-top: 10px;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

.profile-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.left-column {
  flex: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.right-column {
  flex: 10;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title h1{
  margin-top: 0;
}

.size-photo{
  max-width: 50%;
  max-height: 50%;
}

.profile-image-container{
  background-color: #f5f5f5;
  border: 2px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  height: 50%;
}

.profile-info{
  margin-top: 40px;
  margin-bottom: 20px;
}

.profile-info p{
  margin: 10px;
  line-height: 2.5;
}

.profile-image{
  display: flex;
  align-items: center;
  justify-content: center;
}

h2, p {
  display: inline;
  margin: 0;
}
</style>
