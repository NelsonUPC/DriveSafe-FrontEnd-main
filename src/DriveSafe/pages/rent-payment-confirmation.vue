<script>
import Card from "primevue/card";
import AlquilerService from "@/DriveSafe/services/rental.service";

export default {
  components: {
    Card,
  },
  data(){
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/init-propie" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
      alquiler: null,
      arrendatario: null,
      vehiculo: null,
    };
  },
  methods:{
    async cargar(){
      try{
        const alquilerId = parseInt(localStorage.getItem("alquilerId"));
        console.log("alquilerId:", parseInt(localStorage.getItem("alquilerId"))); // Agregado para depurar

        // Verificar si alquilerId es un número válido
        if (!isNaN(alquilerId)) {
          const response = await AlquilerService.getById(alquilerId);
          this.alquiler = response.data;

          console.log("alquiler:", this.alquiler); // Agregado para depurar
        } else {
          console.error("El ID de alquiler almacenado no es un número válido.");
          return; // Salir de la función si el ID no es válido
        }

      } catch(error){
        console.error("Error al cargar la información del alquiler:", error);
      }
    },


    async pagar(){
      try{
        console.log("this.alquiler:", this.alquiler); // Agregado para depurar

        // Verificar si this.alquiler no es null antes de continuar
        if (this.alquiler !== null) {
          const response = await AlquilerService.getById(this.alquiler.id);
          const alquilerCompleto = response.data;
          alquilerCompleto.estado = "Pagado";
          console.log("alquilerCompleto:", alquilerCompleto); // Agregado para depurar

          await AlquilerService.update(this.alquiler.id, alquilerCompleto);
        } else {
          console.error("No se puede realizar el pago porque no se ha cargado correctamente la información del alquiler.");
        }

      } catch (error) {
        console.error("Error al recuperar el alquiler:", error);
      }
    }
  },
  created(){
    this.cargar();
  }
}
</script>

<template>
  <div class="credit-card-form">
    <div class="form-group">
      <label for="cardNumber" class="label">Número de tarjeta:</label>
      <input type="text" id="cardNumber" v-model="cardNumber" placeholder="Ingrese el número de tarjeta" class="input">
    </div>
    <div class="form-group">
      <label for="expiry" class="label">Fecha de expiración (MM/AA):</label>
      <input type="text" id="expiry" v-model="expiry" placeholder="MM/AA" class="input">
    </div>
    <div class="form-group">
      <label for="cvv" class="label">CVV:</label>
      <input type="text" id="cvv" v-model="cvv" placeholder="CVV" class="input">
    </div>
    <div class="form-group">
      <label for="firstName" class="label">Nombres:</label>
      <input type="text" id="firstName" v-model="firstName" placeholder="Nombres" class="input">
    </div>
    <div class="form-group">
      <label for="lastName" class="label">Apellidos:</label>
      <input type="text" id="lastName" v-model="lastName" placeholder="Apellidos" class="input">
    </div>
    <div class="form-group">
      <label for="email" class="label">Email:</label>
      <input type="email" id="email" v-model="email" placeholder="Email" class="input">
    </div>
    <div class="extra-commission">
      <p>Comisión extra de uso: 5 soles</p>
    </div>
    <div class="form-group">
      <button @click="pagar" class="btn-pagar">Pagar</button>
    </div>
  </div>
</template>

<style scoped>
.credit-card-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #92C9ED;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #92C9ED;
  border-radius: 5px;
}

.extra-commission {
  margin-top: 20px;
}

.btn-pagar {
  background-color: #007bff;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-pagar:hover {
  background-color: #0056b3;
}
</style>
