<script>
import { useLayout } from '@/DriveSafe/composables/layout'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserService from "@/DriveSafe/services/user.service";
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      layoutConfig: useLayout().layoutConfig,
      gmail: ref(''),
      password: ref(''),
      checked: ref(false),
      router: useRouter(),
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async login() {
      try {
        const userResponse = await UserService.getUsers();
        console.log("GetUsers()", userResponse)
        const users = userResponse.data;
        console.log("Usuarios", users)
        const userFind = users.find(user => user.gmail === this.gmail)


        if (userFind && userFind.password === this.password) {
          console.log("Usuario autenticado correctamente", userFind);

          localStorage.setItem("usuarioId", userFind.id);

          localStorage.setItem("fotoTenant", "https://i.postimg.cc/Fs9Z3g3V/usuario-1.png");

          if (userFind.type === "owner"){
            this.router.push('/home-owner');
          }
          else {
            this.router.push('/home');
          }
        } else {
          console.error("No existe un arrendatario con el correo proporcionado");
          await Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'El correo electrónico o la contraseña son incorrectos',
            confirmButtonColor: '#FFA500',
          });
        }
      } catch (error) {
        console.error("Error al autenticar usuario", error);
      }
    },
  },
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
          <img data-v-f5a3c044="" src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png" alt="DriveSafe logo" class="mb-5 w-12rem flex-shrink-0" aria-label="App logo">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #FF7A00 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3" style="font-family: 'Poppins', sans-serif;">Bienvenido a DriveSafe!</div>
                        <span class="text-600 font-medium" style="font-family: 'Poppins', sans-serif;">Inicia sesión para continuar</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2" style="font-family: 'Poppins', sans-serif;">Correo</label>
                        <pv-input-text id="email1" type="text" placeholder="Correo electrónico" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="gmail" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2" style="font-family: 'Poppins', sans-serif;">Contraseña</label>
                        <pv-input-text id="email1" type="password" placeholder="Contraseña" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="password" />
                
                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                            </div>
                            <router-link to="/register" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: #FF7A00; margin-top: 15px;">¿No estás registrado? Crea una cuenta</router-link>
                        </div>
                        <pv-button @click="login" label="Iniciar Sesión" class="w-full p-3 text-xl"></pv-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.TipoLoginUsuario .p-button {
    background-color: black;
    color: white;
}

</style>
