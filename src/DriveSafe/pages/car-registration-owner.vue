<script>
import VehicleService from "@/DriveSafe/services/vehicle.service";
import Swal from 'sweetalert2';
import {jwtDecode} from "jwt-decode";

export default {
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home-owner" },
        { label: this.$t('Menu.register'), to: "/car-registration-owner" },
        { label: this.$t('Menu.notifications'), to: "/notifications" },
        { label: this.$t('Menu.rent'), to: "/rent-owner" },
      ];
    },
    options_car_class() {
      return this.$i18n.messages[this.$i18n.locale].CarRegistrationOwner.options.car_class;
    },
    options_transmission() {
      return this.$i18n.messages[this.$i18n.locale].CarRegistrationOwner.options.transmission;
    },
    options_time_type() {
      return this.$i18n.messages[this.$i18n.locale].CarRegistrationOwner.options.time_type;
    },
  },
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      selected_time_type: null,
      selected_transmission: null,
      selected_car_class: null,
      Brand: null,
      Model: null,
      MaximumSpeed: null,
      Consumption: null,
      Dimensions: null,
      Weight: null,
      RentalCost: null,
      PickUpPlace: null,
      UrlImage: null,
    };
  },
  methods: {
    getEnglishValue(key, value) {
      const mapping = {
        car_class: {
          "Familiar": "Family",
          "Deportivo": "Sport",
          "Cargo car": "Cargo car",
          "SUV": "SUV",
          "Sedan": "Sedan"
        },
        transmission: {
          "Automático": "Automatic",
          "Manual": "Manual"
        },
        time_type: {
          "Diario": "Daily",
          "Semanal": "Weekly",
          "Mensual": "Monthly"
        }
      };

      return this.$i18n.locale === 'en' ? value : mapping[key][value];
    },
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async registerVehicle() {
      if (!this.Brand || !this.Model || !this.MaximumSpeed || !this.Consumption || !this.Dimensions || !this.Weight || !this.selected_car_class || !this.selected_transmission || !this.selected_time_type || !this.RentalCost || !this.PickUpPlace || !this.UrlImage) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.$t('CarRegistrationOwner.alerts.incomplete_fields'),
        });
        return;
      }
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
        const data = {
          Brand: this.Brand,
          Model: this.Model,
          MaximumSpeed: parseInt(this.MaximumSpeed),
          Consumption: parseInt(this.Consumption),
          Dimensions: this.Dimensions,
          Weight: parseInt(this.Weight),
          CarClass: this.getEnglishValue('car_class', this.selected_car_class),
          Transmission: this.getEnglishValue('transmission', this.selected_transmission),
          TimeType: this.getEnglishValue('time_type', this.selected_time_type),
          RentalCost: parseInt(this.RentalCost),
          PickUpPlace: this.PickUpPlace,
          UrlImage: this.UrlImage,
          RentStatus: "Available",
          OwnerId: parseInt(userId),
        };
        await VehicleService.create(data);
        this.Brand = null;
        this.Model = null;
        this.MaximumSpeed = null;
        this.Consumption = null;
        this.Dimensions = null;
        this.Weight = null;
        this.RentalCost = null;
        this.PickUpPlace = null;
        this.UrlImage = null;
        this.selected_time_type = null;
        this.selected_car_class = null;
        this.selected_transmission = null;

        Swal.fire({
          icon: 'success',
          title: this.$t('CarRegistrationOwner.alerts.title'),
          text: this.$t('CarRegistrationOwner.alerts.registration_success'),
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.$t('CarRegistrationOwner.alerts.registration_error'),
        });
      }
    }
  }
};
</script>

<template>
  <pv-toast/>
  <header>
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
        <div class="language-buttons">
          <button class="language-button" @click="switchLanguage" aria-label="Switch Language">
            {{ selectedLanguage === 'en' ? 'ES' : 'EN' }}
          </button>
        </div>
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
                aria-label="Navigate"
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
        </div>
      </template>
    </pv-toolbar>
  </header>

  <div class="container">
    <div class="half-width-card">
      <pv-card>
        <template #title>
        </template>
        <template #content>
          <h1 style="font-family: 'Poppins',sans-serif; color:#FF7A00">{{ $t('CarRegistrationOwner.title')}}</h1>
          <div class="input-grid">
            <div class="input-column">
              <p style="font-family: 'Poppins',sans-serif"><strong>{{ $t('CarRegistrationOwner.brand') }}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.brand')" v-model="Brand" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{ $t('CarRegistrationOwner.max_speed') }}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.max_speed')" v-model="MaximumSpeed" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.dimensions')}}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.dimensions')" v-model="Dimensions" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.car_class')}}</strong></p>
              <pv-dropdown :options="options_car_class" :placeholder="$t('CarRegistrationOwner.placeholders.car_class')" v-model="selected_car_class" style="font-family: 'Poppins',sans-serif" />
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.time_type')}}</strong></p>
              <pv-dropdown :options="options_time_type" :placeholder="$t('CarRegistrationOwner.placeholders.time_type')" v-model="selected_time_type"
                           style="font-family: 'Poppins',sans-serif"/>
              <p style="font-family: 'Poppins',sans-serif">
                <strong>{{ $t('CarRegistrationOwner.pick_up_place') }}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.pick_up_place')" v-model="PickUpPlace" style="font-family: 'Poppins',sans-serif"></pv-input>
            </div>
            <div class="input-column">
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.model')}}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.model')" v-model="Model" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.consumption')}}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.consumption')" v-model="Consumption" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.weight')}}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.weight')" v-model="Weight" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.transmission')}}</strong></p>
              <pv-dropdown :options="options_transmission"
                           :placeholder="$t('CarRegistrationOwner.placeholders.transmission')"
                           v-model="selected_transmission" style="font-family: 'Poppins',sans-serif"/>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.rental_cost')}}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.rental_cost')" v-model="RentalCost" type="number" style="font-family: 'Poppins',sans-serif"></pv-input>
              <p style="font-family: 'Poppins',sans-serif"><strong>{{$t('CarRegistrationOwner.url_image')}}</strong></p>
              <pv-input :placeholder="$t('CarRegistrationOwner.url_image')" v-model="UrlImage" style="font-family: 'Poppins',sans-serif"></pv-input>
            </div>
          </div>
          <div class="input-column">
            <pv-button label="REGISTRAR" class="custom-button2" @click="registerVehicle">{{$t('CarRegistrationOwner.register_button')}}</pv-button>
          </div>
        </template>
      </pv-card>
    </div>
    <div class="half-width-card">
      <pv-card>
        <template #title></template>
        <template #content>
          <div class="button-container">
            <router-link to="/rent-contract-owner">
              <pv-button label="CREAR CONTRATO DE ALQUILER" class="custom-button3">CREAR CONTRATO DE ALQUILER</pv-button>
            </router-link>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>


<style>
.custom-bg {
  background-color: white;
}

.custom-button {
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

.container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.half-width-card {
  flex: 1;
  width: calc(50% - 1rem);
  margin: 0.5rem;
  box-sizing: border-box;
  max-width: 50%;
}

.half-width-card p,
.half-width-card pv-input,
.half-width-card Button {
  font-size: 1rem;
}

.input-grid {
  display: flex;
  justify-content: space-between;
}

.input-column {
  flex: 1;
  padding: 0 1rem;
  box-sizing: border-box;
}

.custom-button2 {
  width: 30%;
  height: 30px;
  margin: 20px;
  background-color: #FF7A00;
  color: white;
  font-family: 'Poppins', sans-serif;
  border: none;
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

.custom-button2:hover {
  background-color: rgba(255, 122, 0, 0.9);
}

.custom-button3:hover {
  background-color: #CCCCCC;
  color: black
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.language-buttons {
  display: flex;
  align-items: center;
}

.language-button {
  background-color: white;
  color: #14131B;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}

.language-button:hover,
.language-button:focus {
  background-color: #FF7A00 !important;
  color: white !important;
}

@media (max-width: 50vmin) {
  .half-width-card {
    max-width: 100%;
  }

  .input-grid {
    flex-direction: column;
  }
}
</style>
