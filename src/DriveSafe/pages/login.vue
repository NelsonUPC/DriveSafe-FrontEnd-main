<script>
import { useLayout } from '@/AutoYa/composables/layout'
import { ref, computed } from 'vue';
import AppConfig from '@/AutoYa/AppConfig.vue';
import AuthService from "@/AutoYa/services/auth.service";
import ArrendatarioService from "@/AutoYa/services/arrendatario.service";
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      layoutConfig: useLayout().layoutConfig,
      email: ref(''),
      password: ref(''),
      checked: ref(false),
      router: useRouter(),
    };
  },
  methods: {
    async logeo() {
      try {
        // Llama al método login del servicio AuthService
        const response = await AuthService.login({
          email: this.email,
          password: this.password
        });

        // Obtén todos los arrendatarios
        const arrendatariosResponse = await ArrendatarioService.getAll();
        const arrendatarios = arrendatariosResponse.data;

        // Verifica si existe un arrendatario con el correo proporcionado
        const arrendatarioEncontrado = arrendatarios.find(arrendatario => arrendatario.correo === this.email);

        if (arrendatarioEncontrado) {
          // Si la autenticación es exitosa y hay un arrendatario con el correo, redirige a la página '/home'
          console.log("Usuario autenticado correctamente", response);
          localStorage.setItem("arrendatarioId", arrendatarioEncontrado.id);
          localStorage.setItem("arrendatarioNombres", arrendatarioEncontrado.nombres);
          localStorage.setItem("arrendatarioApellidos", arrendatarioEncontrado.apellidos);
          localStorage.setItem("fotoTenant", "https://i.postimg.cc/Fs9Z3g3V/usuario-1.png");
          console.log("Arrendatario id", localStorage.getItem("arrendatarioId"));
          this.router.push('/home');
        } else {
          // Si no hay un arrendatario con el correo, muestra un mensaje de error
          console.error("No existe un arrendatario con el correo proporcionado");
        }

      } catch (error) {
        // Maneja el error, por ejemplo, muestra un mensaje de error al usuario
        console.error("Error al autenticar usuario", error);
      }
    },
  },
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img data-v-f5a3c044="" src="https://i.postimg.cc/vmZh3LGv/logotransparent-26-06.png" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0">            
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #FF7A00 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3" style="font-family: 'Poppins', sans-serif;">Bienvenido a AutoYa!</div>
                        <span class="text-600 font-medium" style="font-family: 'Poppins', sans-serif;">Inicia sesión para continuar</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;">Correo</label>
                        <pv-input-text id="email1" type="text" placeholder="Correo electrónico" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2" style="font-family: 'Poppins', sans-serif;">Contraseña</label>
                        <pv-input-text id="email1" type="password" placeholder="Contraseña" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="password" />
                
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                            </div>
                            <router-link to="/register" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: #FF7A00; margin-top: 15px;">¿No estás registrado? Crea una cuenta</router-link>
                        </div>

                        <pv-button @click="logeo" label="Iniciar Sesión" class="w-full p-3 text-xl"></pv-button>

                        <div class="TipoLoginUsuario">
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
    background: #FF7A00;
    border: 1px solid black;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    border-radius: 6px;
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

</style>
