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
            <!-- Agrega la imagen a la derecha -->
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
      <Card>
        <template #title>
        </template>
        <template #content>
          <h1 style="font-family: 'Poppins',sans-serif; color:#FF7A00">MANTENIMIENTO</h1>
          <p style="font-family: 'Poppins',sans-serif">Cree una solicitud para su arrendador en minutos con información detallada sobre el problema y fotografías relevantes. Además, puede comunicarse con el arrendador cuando le sea necesario.</p>
          <p style="font-family: 'Poppins',sans-serif; color:#FF7A00">Vea la respuesta del propietario en su correo electrónico.</p>
        </template>
      </Card>
    </div>
    <div class="half-width-card">
      <Card>
        <template #title></template>
        <template #content>
          <p style="font-family: 'Poppins',sans-serif">Seleccionar nombre del propietario del auto alquilado</p>
          <Dropdown :options="userOptions" v-model="selectedUser" placeholder="Selecciona un propietario" />
          <Card>
            <template #title></template>
            <template #content>
              <p style="font-family: 'Poppins',sans-serif">Tipo de problema</p>
              <InputText v-model="value1" placeholder="Tipo de problema" style="font-family: 'Poppins',sans-serif"/>
              <p style="font-family: 'Poppins',sans-serif">Titulo</p>
              <InputText v-model="value1" placeholder="Titulo" style="font-family: 'Poppins',sans-serif"/>
              <p style="font-family: 'Poppins',sans-serif">Descripcion</p>
              <InputText v-model="value1" placeholder="Descripcion" style="font-family: 'Poppins',sans-serif"/>

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

<script>
import Card from "primevue/card";
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import VehiculoService from "@/AutoYa/services/vehiculo.service";
import PropietarioService from "@/AutoYa/services/propietario.service";
export default{
  components: {
    Card,
    Dropdown,
    InputText,
  },
  data() {
    return {
      drawer: false,
      items: [
        { label: "Inicio", to: "/home" },
        { label: "Buscar Autos", to: "/car-search-tenant" },
        { label: "Mantenimiento", to: "/manteinance-tenant" },
        { label: "Alquiler", to: "/rent-tenant" },
      ],
      userOptions: [],
      selectedUser: null,
    };
  },
  methods: {
    rotateCarousel(step) {
      const cardContainer = document.querySelector(".carousel-cards");
      const hiddenCards = document.querySelectorAll(".hidden-card");
      const visibleCards = cardContainer.querySelectorAll(".card:not(.hidden-card)");

      const totalVisibleCards = visibleCards.length;
      const totalHiddenCards = hiddenCards.length;

      const newCardCount = this.cardCount + step;

      if (newCardCount >= 1 && newCardCount <= totalVisibleCards + totalHiddenCards) {
        this.cardCount = newCardCount;

        hiddenCards.forEach((card) => {
          card.style.display = "none";
        });

        for (let i = 0; i < this.cardCount; i++) {
          if (visibleCards[i]) {
            visibleCards[i].style.display = "flex";
          }
        }
      }
    },
    enviarSolicitud() {
      this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Mensaje enviado al correo del propietario exitosamente.' });
    },
  },
  created() {
    const arrendatarioId = parseInt(localStorage.getItem("arrendatarioId"));

    console.log("arrendatarioId", localStorage.getItem("arrendatarioId"));

    // Consultar vehículos alquilados por el arrendatario actual
    VehiculoService.getAll()
        .then((response) => {
          const vehiculosAlquilados = response.data.filter(
              (vehiculo) => vehiculo.arrendatario && vehiculo.arrendatario.id === arrendatarioId
          );

          console.log("va: ", vehiculosAlquilados);

          // Obtener la lista de propietarios de los vehículos alquilados
          const propietarioIds = [...new Set(vehiculosAlquilados.map((v) => v.propietario.id))];

          console.log("propietarios: ", propietarioIds);

          // Consultar detalles de propietarios
          PropietarioService.getAll()
              .then((propietariosResponse) => {
                const propietarios = propietariosResponse.data.filter((p) => propietarioIds.includes(p.id));

                // Crear opciones para el Dropdown con nombres y apellidos de propietarios
                this.userOptions = propietarios.map((propietario) => `${propietario.nombres} ${propietario.apellidos}`);
                console.log("userop: ", this.userOptions);
              })
              .catch((error) => {
                console.error("Error al obtener detalles de propietarios:", error);
              });
        })
        .catch((error) => {
          console.error("Error al obtener vehículos alquilados:", error);
        });
  }
};
</script>

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
  margin-top: 10px; /* Espacio entre el párrafo y los botones, ajusta según sea necesario */
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