<script>
import Swal from 'sweetalert2';
import UserService from "@/DriveSafe/services/user.service";

export default {
  data() {
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/init-propie" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
      arrendatarioId: parseInt(localStorage.getItem("usuarioId")),
      nombres: '',
      apellidos: '',
      celular: '',
      fechaNacimiento: '',
      contrasenia: '',
      correo: localStorage.getItem("usuarioCorreo") // Obtener el correo del localStorage
    };
  },
  methods: {
    async actualizarDatosOwner() {
      // Verificar si algún campo está vacío
      if (!this.nombres || !this.apellidos || !this.celular || !this.fechaNacimiento || !this.contrasenia || !this.correo) {
        // Mostrar advertencia Swal
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Por favor, completa todos los campos.',
        });
        return; // Salir del método si algún campo está vacío
      }

      try {
        // Obtener los datos del usuario
        const response = await UserService.getUserById(this.arrendatarioId);
        const responseUser = response.data;

        // Actualizar los datos del usuario con los nuevos valores
        responseUser.nombres = this.nombres;
        responseUser.apellidos = this.apellidos;
        responseUser.fecha_nacimiento = this.fechaNacimiento;
        responseUser.telefono = this.celular;
        responseUser.correo = this.correo;
        responseUser.contrasenia = this.contrasenia;
        responseUser.tipo = "arrendatario";

        // Actualizar los datos del usuario en el servidor
        const responseUpdate = await UserService.update(this.arrendatarioId, responseUser);

        // Verificar si la actualización en el servidor fue exitosa
        if (responseUpdate.status === 200) {
          // Actualizar localStorage si la actualización en el servidor fue exitosa
          localStorage.setItem("usuarioNombres", this.nombres);
          localStorage.setItem("usuarioApellidos", this.apellidos);
          localStorage.setItem("usuarioCelular", this.celular);
          localStorage.setItem("usuarioCorreo", this.correo); // Actualizar el correo en el localStorage

          // Redirigir al usuario a la página de perfil
          this.$router.push('/profile-tenant');
        } else {
          // Mostrar mensaje de error si la actualización en el servidor falló
          throw new Error("La actualización de datos del usuario falló.");
        }
      } catch (error) {
        console.error("Error al actualizar datos del propietario:", error);
        // Mostrar mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar los datos del propietario. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    }
  }
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header role="banner">
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://imgur.com/a/DWk9R7P"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
      </template>
      <template #end>
        <nav class="flex-column">
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
                role="link"
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
        </nav>
      </template>
    </pv-toolbar>
  </header>
  <main class="center-container" style="margin-top: 100px;">
    <h1 id="updateTitle" style="color: #FF7A00;">Actualice sus datos</h1>
    <h2>Nombres</h2><br>
    <pv-input placeholder="Nombres" v-model="nombres" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Apellidos</h2><br>
    <pv-input placeholder="Apellidos" v-model="apellidos" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Celular</h2><br>
    <pv-input placeholder="Celular" v-model="celular" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Fecha de nacimiento</h2><br>
    <pv-input placeholder="Fecha de nacimiento" v-model="fechaNacimiento" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Contraseña</h2><br>
    <pv-input placeholder="Nueva contraseña" v-model="contrasenia" type="password" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Correo electrónico</h2><br>
    <pv-input placeholder="Nuevo correo electrónico" v-model="correo" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>

    <Button label="Actualizar datos" class="custom-button2" @click="actualizarDatosOwner()" role="button">Actualizar</Button>
  </main>
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

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}
</style>
