<script>
import Swal from 'sweetalert2';
import UserService from "@/DriveSafe/services/user.service";

export default {
  data() {
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/home" },
        { label: "Buscar Autos", to: "/car-search-tenant" },
        { label: "Mantenimiento", to: "/manteinance-tenant" },
        { label: "Alquiler", to: "/rent-tenant" },
      ],
      tenantId: parseInt(localStorage.getItem("usuarioId")),
      name: '',
      last_name: '',
      cellphone: '',
      day: '',
      month: '',
      year: '',
      password: '',
      gmail: localStorage.getItem("usuarioCorreo") // Obtener el correo del localStorage
    };
  },
  methods: {
    async actualizarDatosOwner() {
      if (!this.name || !this.last_name || !this.cellphone || !this.password || !this.gmail || !this.day || !this.month || !this.year) {
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Por favor, completa todos los campos.',
        });
        return;
      }

      try {
        // Obtener los datos del usuario
        const response = await UserService.getUserById(this.tenantId);
        const responseUser = response.data;
        const BirthdateFormatted = `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
        responseUser.name = this.name;
        responseUser.last_name = this.last_name;
        responseUser.birthdate = BirthdateFormatted;
        responseUser.cellphone = this.cellphone;
        responseUser.gmail = this.gmail;
        responseUser.password = this.password;

        // Actualizar los datos del usuario en el servidor
        const responseUpdate = await UserService.update(this.tenantId, responseUser);

        // Verificar si la actualización en el servidor fue exitosa
        if (responseUpdate.status === 200) {
          // Actualizar localStorage si la actualización en el servidor fue exitosa
          localStorage.setItem("usuarioNombres", this.name);
          localStorage.setItem("usuarioApellidos", this.last_name);
          localStorage.setItem("usuarioCelular", this.cellphone);
          localStorage.setItem("usuarioCorreo", this.gmail);

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Los datos del arrendatario han sido actualizados correctamente.',
          });

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
          <router-link to="/profile-tenant">
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
    <pv-input placeholder="Nombres" v-model="name" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Apellidos</h2><br>
    <pv-input placeholder="Apellidos" v-model="last_name" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Celular</h2><br>
    <pv-input placeholder="Celular" v-model="cellphone" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Fecha de nacimiento</h2><br>
    <div class="date-inputs">
      <pv-input-text id="day" type="number" placeholder="DD" class="date-input" v-model="day" />
      <pv-input-text id="month" type="number" placeholder="MM" class="date-input" v-model="month" />
      <pv-input-text id="year" type="number" placeholder="AA" class="date-input" v-model="year" />
    </div>
    <h2>Contraseña</h2><br>
    <pv-input placeholder="Nueva contraseña" v-model="password" type="password" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>Correo electrónico</h2><br>
    <pv-input placeholder="Nuevo correo electrónico" v-model="gmail" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>

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
.custom-button{
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

.title h1{
  margin-top: 0;
}

.profile-info p{
  margin: 10px;
  line-height: 2.5;
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

.date-inputs {
  display: flex;
  justify-content: space-between;
}

.date-input {
  flex: 1;
  margin-right: 10px;
}

.date-input:last-child {
  margin-right: 0;
}

@media (max-width: 600px) {
  .date-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .date-input {
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;
  }

  .date-input:last-child {
    margin-bottom: 0;
  }
}
</style>
