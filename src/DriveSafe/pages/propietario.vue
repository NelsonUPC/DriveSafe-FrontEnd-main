<script>
import { useLayout } from '@/AutoYa/composables/layout'
import { ref, computed } from 'vue';
import AppConfig from '@/AutoYa/AppConfig.vue';
import AuthService from "@/AutoYa/services/auth.service";
import PropietarioService from "@/AutoYa/services/propietario.service";
import { useRouter } from 'vue-router';


export default {
  data() {
    return {
      layoutConfig: useLayout().layoutConfig,
      email: '',
      password: '',
      checked: false,
      router: useRouter(),
      propietarioId: 0,
    };
  },
  methods: {
    async logeo() {
      try {
        const response = await AuthService.login({
          email: this.email,
          password: this.password
        });

        const propietariosResponse = await PropietarioService.getAll();
        const propietarios = propietariosResponse.data;

        const propietarioEncontrado = propietarios.find(propietario => propietario.correo === this.email);

        if (propietarioEncontrado) {
          console.log("Usuario autenticado correctamente", response);
          localStorage.setItem("propietarioId", propietarioEncontrado.id);
          localStorage.setItem("fotoOwner", "https://i.postimg.cc/Fs9Z3g3V/usuario-1.png")
          console.log('Propietario ID:', localStorage.getItem("propietarioId"));
          //this.$router.push({ name: 'init-propie', query: { propietarioId: propietarioEncontrado.id} });
          this.router.push({path:"/init-propie"});

        } else {
          console.error("No existe un propietario con el correo proporcionado");
        }

      } catch (error) {
        console.error("Error al autenticar usuario", error);
      }
    },
  },
};
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" aria-label="Área principal de inicio de sesión">
    <div class="flex flex-column align-items-center justify-content-center">
      <img data-v-f5a3c044="" src="https://github.com/AppWeb-Grupo3/DriveSafe-Project-report/blob/main/imagenes/logo.png?raw=true" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0">
      <div style="border-radius: 56px; padding: 0.3rem; border: 1px solid black;" aria-label="Contenedor del formulario de inicio de sesión"> <!-- Agregado aria-label -->
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3" style="font-family: 'Poppins', sans-serif;">Bienvenido a DriveSafe!</div>
            <span class="text-600 font-medium" style="font-family: 'Poppins', sans-serif;">¡Inicia sesión para ingresar!</span>
          </div>

          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;">Tu Correo</label>
            <pv-input-text id="email1" type="text" placeholder="Correo electrónico" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" aria-label="Campo de correo electrónico" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2" style="font-family: 'Poppins', sans-serif;">Tu Contraseña</label>
            <pv-input-text id="password" type="password" placeholder="Contraseña" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="password" aria-label="Campo de contraseña" />

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
              </div>
              <router-link to="/register" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: #1A2C63; margin-top: 15px; transition: color 0.2s;" aria-label="Enlace para registro">¿No tienes cuenta aún? Registrate aqui</router-link> <!-- Cambiado a azul y agregado transition -->
            </div>

            <pv-button @click="logeo" label="Iniciar Sesión" class="w-full p-3 text-xl" aria-label="Botón de inicio de sesión"></pv-button>

            <div class="TipoLoginUsuario" aria-label="Selección de tipo de inicio de sesión">
              <router-link to="/login">
                <pv-button label="Ingresar como Arrendatario"></pv-button>
              </router-link>

              <router-link to="/propietario">
                <pv-button label="Ingresar como Propietario"></pv-button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppConfig simple />
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
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;

}

.p-button:hover {
  background-color: black;
  transform: scale(1.05);
}

.TipoLoginUsuario{
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.TipoLoginUsuario .p-button {
  background-color: #FFA500;
  color: white;
}

</style>
