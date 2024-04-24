<script>
import ArrendatarioService from "@/AutoYa/services/arrendatario.service";
export default {
  data(){
    return {
      user: {
        name: '',
        lastName: '',
        photo: localStorage.getItem("fotoTenant"),
        phone: '',
        email: ''
      },
      drawer: false,
      items: [
        { label: "Inicio", to: "/home" },
        { label: "Buscar Autos", to: "/car-search-tenant" },
        { label: "Mantenimiento", to: "/manteinance-tenant" },
        { label: "Alquiler", to: "/rent-tenant" },
      ],
    };
  },
  methods: {
    async cargarInformacionArrendatario() {
      try {
        const response = await ArrendatarioService.getAll();

        // Filtrar la información del arrendatario por el id almacenado en localStorage
        const arrendatario = response.data.find(
            (arrendatario) =>
                arrendatario.id === parseInt(localStorage.getItem("arrendatarioId"))
        );

        if (arrendatario) {
          this.user.name = arrendatario.nombres;
          this.user.lastName = arrendatario.apellidos;
          this.user.phone = arrendatario.telefono;
          this.user.email = arrendatario.correo;
          this.user.birthday = arrendatario.fechaNacimiento;
        }
      } catch (error) {
        console.error("Error al cargar la información del propietario:", error);
      }
    },
    cerrarSesion() {
      // Redirección a /login
      this.$router.push('/login');
      // Limpiar el localStorage
      localStorage.setItem("arrendatarioId", null);
      localStorage.setItem("fotoTenant", "https://i.postimg.cc/Fs9Z3g3V/usuario-1.png")
    },
  },
  created() {
    // Cargar la información del arrendatario al montar el componente
    this.cargarInformacionArrendatario();
  },
};
</script>

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
  <body>
  <div class="profile-container">
    <div class="left-column">
      <div class="title">
        <h1>Perfil del Usuario</h1>
        <h2>Arrendatario</h2>
      </div>
      <div class="profile-info">
        <h2>Nombres: </h2>
        <h2>{{ user.name }}</h2><br>
        <h2>Apellidos: </h2>
        <h2>{{user.lastName}}</h2><br>
        <h2>Celular: </h2>
        <h2>{{user.phone}}</h2><br>
        <h2>Correo: </h2>
        <h2>{{user.email}}</h2><br>
      </div>
      <div class="buttons">

        <router-link to="/update-tenant">
          <pv-button class="font-button">Actualizar Datos</pv-button><br>
        </router-link>

        <pv-button class="font-button" @click="cerrarSesion">Cerrar Sesión</pv-button>
      </div>
    </div>
    <div class="right-column">
      <div class="profile-image-container">
        <div class="profile-image">
          <img :src="user.photo" alt="Profile Picture" class="size-photo"/>
        </div>
        <br>
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
/*Cosas a cambiar*/
.profile-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between; /**/
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