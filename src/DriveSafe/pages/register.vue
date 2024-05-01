<script setup>
import { useLayout } from '@/AutoYa/composables/layout'
import { ref, computed } from 'vue';
import AuthService from "@/AutoYa/services/auth.service";
import ArrendatarioService from "@/AutoYa/services/arrendatario.service";
import PropietarioService from "@/AutoYa/services/propietario.service";

const { layoutConfig } = useLayout();
const email = ref('');

const checked = ref(false);
const tipoUsuario = ref(''); 
const tipoUsuarioOptions = ['Arrendatario', 'Propietario'];
const nombres = ref('');
const apellidos = ref('');
const telefono = ref(0);
const correo = ref('');
const password = ref('');
const day = ref(''); 
const month = ref(''); 
const year = ref('');

const registerUser = async () => {
  if (!nombres.value || !apellidos.value || !correo.value || !password.value || !tipoUsuario.value || !day.value || !month.value || !year.value || !telefono.value) {
    console.error("Todos los campos son obligatorios.");
    console.log(`${nombres.value}, ${apellidos.value}, ${correo.value}, ${password.value}, ${tipoUsuario.value}, ${day.value}, ${month.value}, ${year.value}, ${telefono.value}`)
    return;
  }

  const user = {
    firstName: nombres.value,
    lastName: apellidos.value,
    email: correo.value,
    password: password.value,
  };

  try {
    const response = await AuthService.register(user);
    console.log("Usuario registrado correctamente", response);
    if (tipoUsuario.value === 'Arrendatario') {
      const fechaNacimientoFormatted = `${day.value}-${month.value}-${year.value}`;

      const arrendatarioData = {
        nombres: nombres.value,
        apellidos: apellidos.value,
        fechaNacimiento: fechaNacimientoFormatted,
        telefono: telefono.value,
        correo: correo.value,
        antecedentesPenalesPdf: 'misAntecedentesPenales',
        contrasenia: password.value,
      };

      await ArrendatarioService.create(arrendatarioData);

      console.log("Arrendatario creado correctamente");
    }

    if (tipoUsuario.value === 'Propietario') {
      const fechaNacimientoFormatted = `${day.value}-${month.value}-${year.value}`;

      const propietarioData = {
        nombres: nombres.value,
        apellidos: apellidos.value,
        fechaNacimiento: fechaNacimientoFormatted,
        telefono: telefono.value,
        correo: correo.value,
        contrasenia: password.value,
      };

      await PropietarioService.create(propietarioData);

      console.log("Propietario creado correctamente");
    }
  } catch (error) {
    console.error("Error al registrar usuario", error);
    if (error.response) {
      console.error("Respuesta del servidor:", error.response.data);
    }
  }
};

</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" aria-label="Página de registro de usuario">
    <div class="flex flex-column align-items-center justify-content-center">
      <img data-v-f5a3c044="" src="https://imgur.com/a/DWk9R7P" alt="logo" class="mb-5 w-6rem flex-shrink-0" aria-label="Logo de la aplicación DriveSafe">

      <div style="border-radius: 56px; padding: 0.3rem; border: 1px solid black;"  aria-label="Fondo de la página de registro">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px" aria-label="Formulario de registro">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3" style="font-family: 'Poppins', sans-serif;" aria-label="Bienvenida a DriveSafe!">Bienvenido a DriveSafe!</div>
            <span class="text-600 font-medium" style="font-family: 'Poppins', sans-serif;" aria-label="Mensaje de bienvenida">Inicia sesión para continuar</span>
          </div>

          <div>
            <label for="tipoUsuario" class="block text-900 font-medium text-xl mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Seleccione su tipo de usuario">Tipo de usuario</label>
            <pv-dropdown id="tipoUsuario" class="w-full md:w-30rem mb-5 w-30rem" :options="tipoUsuarioOptions" v-model="tipoUsuario" />

            <label for="nombres" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese sus nombres">Nombres</label>
            <pv-input-text id="nombres" type="text" placeholder="Ingrese sus nombres" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="nombres" />

            <label for="apellidos" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese sus apellidos">Apellidos</label>
            <pv-input-text id="apellidos" type="text" placeholder="Ingrese sus apellidos" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="apellidos" />

            <label for="fechaNacimiento" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su fecha de nacimiento">Fecha de nacimiento</label>
            <div class="flex justify-between" aria-label="Seleccione su fecha de nacimiento">
              <pv-input-text id="day" type="number" placeholder="DD" class="w-1/4 md:w-8rem mb-5" style="padding: 1rem" v-model="day" />
              <pv-input-text id="month" type="number" placeholder="MM" class="w-1/4 md:w-8rem mb-5" style="padding: 1rem" v-model="month" />
              <pv-input-text id="year" type="number" placeholder="AA" class="w-1/4 md:w-8rem mb-5" style="padding: 1rem" v-model="year" />
            </div>

            <label for="teléfono" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su número de teléfono">Teléfono</label>
            <pv-input-text id="teléfono" type="number" placeholder="+51 teléfono" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="telefono" />

            <label for="correo" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su dirección de correo electrónico">Correo electrónico</label>
            <pv-input-text id="correo" type="text" placeholder="Ex. mail@abc.com" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="correo" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2" style="font-family: 'Poppins', sans-serif;" aria-label="Ingrese su contraseña">Contraseña</label>
            <pv-input-text id="password" type="password" placeholder="Contraseña" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="password" />
            <div class="flex align-items-center justify-content-between mb-5 gap-5" aria-label="Recuérdame">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
              </div>
            </div>
            <router-link to="/login" aria-label="Enlace para ir a la página de inicio de sesión">
              <pv-button @click="registerUser" label="Registrarse" class="w-full md:w-30rem p-3 text-xl" aria-label="Botón de registro de usuario"></pv-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-medium {
  font-family: 'Poppins', sans-serif;
}

.p-inputtext,
.inputtext {
  font-family: 'Poppins', sans-serif;
}

.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

.p-button {
  color: black;
  color: #ffffff;
  background: #1A2C63;
  border: 1px solid black; 
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  border-radius: 6px;
}

.p-button:hover {
  background-color: black;
  color: white;
  transform: scale(1.05); 
}

.TipoLoginUsuario{
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.TipoLoginUsuario .p-button {
  background-color: black;
  color: white;
}

.w-30rem {
  height: 3rem;
}
</style>
