<script>
import Card from "primevue/card";
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import AlquilerService from "@/DriveSafe/services/alquiler.service";
import UserService from "@/DriveSafe/services/user.service";
import ManteinanceService from "@/DriveSafe/services/manteinance.service.js";
import Swal from 'sweetalert2'

export default {
  components: {
    Card,
    Dropdown,
    InputText,
  },
  data() {
    return {
      items: [
        { label: "Inicio", to: "/home" },
        { label: "Buscar Autos", to: "/car-search-tenant" },
        { label: "Mantenimiento", to: "/manteinance-tenant" },
        { label: "Alquiler", to: "/rent-tenant" },
      ],
      alquileres: [],
      userOptions: [],
      userOptionsId: [],
      value1: null,
      value2: null,
      value3: null,
      selectedUser: null,
    };
  },
  methods: {
    async obtenerAlquileresUsuario() {
      try {
        const usuarioId = parseInt(localStorage.getItem('usuarioId'));
        console.log("UsuarioId", usuarioId)
        const response = await AlquilerService.getAll();
        this.alquileres = response.data
        console.log("Alquileres", this.alquileres)

        // Conjunto para almacenar los nombres únicos de los propietarios
        const uniquePropietarios = new Set();
        const uniqueIds = new Set();

        for (let alquiler of this.alquileres){
          if (alquiler.arrendatario_id === usuarioId){
            console.log('Alquiler ID: ', alquiler.id)
            const usuarioResponse = await UserService.getUserById(alquiler.propietario_id);
            console.log('Usuario: ', usuarioResponse.data)

            // Almacena el nombre del propietario en el conjunto
            uniquePropietarios.add(`${usuarioResponse.data.nombres} ${usuarioResponse.data.apellidos}`);
            uniqueIds.add(`${usuarioResponse.data.id}`)
          }
        }

        // Convierte el conjunto de nombres únicos a un arreglo y asígnalo a userOptions
        this.userOptions = Array.from(uniquePropietarios);
        console.log("User Options", this.userOptions)

        this.userOptionsId = Array.from(uniqueIds);
        console.log("User Ids", this.userOptionsId)

      } catch (error) {
        console.error("Error al obtener los alquileres del usuario:", error);
      }
    },
    async enviarSolicitud() {
      // Validar que todos los campos estén llenos
      if (!this.value1 || !this.value2 || !this.value3 || !this.selectedUser) {
        // Mostrar alerta de error con SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Por favor, completa todos los campos antes de enviar la solicitud.',
          confirmButtonText: 'Aceptar'
        });
        return; // Detener el flujo si hay campos incompletos
      }


      // Obtiene la posición del nombre seleccionado en el arreglo userOptions
      const selectedUserIndex = this.userOptions.indexOf(this.selectedUser);

      // Obtiene el ID correspondiente al nombre seleccionado
      const propietarioId = this.userOptionsId[selectedUserIndex];

      console.log("Propietario seleccionado:", this.selectedUser);
      console.log("ID del propietario:", propietarioId);

      const manteinance = {
        id: null,
        tipo_problema: this.value1,
        titulo: this.value2,
        descripcion: this.value3,
        arrendatario_id: parseInt(localStorage.getItem('usuarioId')),
        propietario_id: parseInt(propietarioId)
      };

      console.log("Manteinance", manteinance);

      try {
        const response = await ManteinanceService.create(manteinance);
        console.log("Mantenimiento creado:", response);

        // Mostrar mensaje de éxito utilizando Swal
        Swal.fire({
          icon: 'success',
          title: 'Mantenimiento creado exitosamente',
          text: 'El mantenimiento se ha creado correctamente.',
          confirmButtonText: 'Aceptar'
        });

      } catch (error) {
        console.error("Error al crear el mantenimiento:", error);
        // Aquí puedes manejar el error, mostrar un mensaje de error, etc.
        // Mostrar mensaje de error utilizando Swal
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al crear el mantenimiento. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Aceptar'
        });
      }
    }
  },
  created() {
    this.obtenerAlquileresUsuario();
  }
};
</script>

<template>
  <pv-toast aria-live="polite" />
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

  <div class="container">
    <div class="half-width-card">
      <Card role="region" aria-labelledby="card1Title">
        <template #title>
          <h1 id="card1Title" style="font-family: 'Poppins',sans-serif; color:#FF7A00">
            MANTENIMIENTO
          </h1>
        </template>
        <template #content>
          <p style="font-family: 'Poppins',sans-serif">
            Cree una solicitud para su arrendador en minutos con información detallada sobre el
            problema y fotografías relevantes. Además, puede comunicarse con el arrendador cuando le
            sea necesario.
          </p>
          <p style="font-family: 'Poppins',sans-serif; color:#FF7A00">
            Vea la respuesta del propietario en su correo electrónico.
          </p>
        </template>
      </Card>
    </div>
    <div class="half-width-card">
      <Card role="form" aria-labelledby="card2Title">
        <template #title>
          <h2 id="card2Title" style="font-family: 'Poppins',sans-serif">
            Formulario de Mantenimiento
          </h2>
        </template>
        <template #content>
          <p style="font-family: 'Poppins',sans-serif">
            Seleccionar nombre del propietario del auto alquilado
          </p>
          <Dropdown
              :options="userOptions"
              v-model="selectedUser"
              placeholder="Selecciona un propietario"
              role="combobox"
              aria-expanded="false"
          />
          <Card role="region" aria-labelledby="card3Title">
            <template #title></template>
            <template #content>
              <p style="font-family: 'Poppins',sans-serif">Tipo de problema</p>
              <InputText v-model="value1" placeholder="Tipo de problema" style="font-family: 'Poppins',sans-serif" role="textbox"/>
              <p style="font-family: 'Poppins',sans-serif">Titulo</p>
              <InputText v-model="value2" placeholder="Titulo" style="font-family: 'Poppins',sans-serif" role="textbox"/>
              <p style="font-family: 'Poppins',sans-serif">Descripcion</p>
              <InputText v-model="value3" placeholder="Descripcion" style="font-family: 'Poppins',sans-serif" role="textbox"/>

              <div class="button-container">
                <Button class="custom-button3">Agregar Fotos</Button>
                <Button class="custom-button3" @click="enviarSolicitud">Enviar</Button>
              </div>
            </template>
          </Card>
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

.button-container {
  display: block;
  margin-top: 10px;
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

</style>
