<template>
  <!-- Show loading while checking auth -->
  <div
    v-if="loading"
    class="text-center mt-5"
  >
    <h3>Loading...</h3>
  </div>

  <!-- Show Dashboard if logged in -->
  <Dashboard
    v-else-if="user"
  />

  <!-- Show Login -->
  <Login
    v-else-if="showLogin"
    @loggedIn="user = auth.currentUser"
    @showRegister="showLogin = false"
  />

  <!-- Show Register -->
  <Register
    v-else
    @registered="user = auth.currentUser"
    @showLogin="showLogin = true"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase/config";

import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Dashboard from "./components/Dashboard.vue";

const user = ref(null);
const loading = ref(true);
const showLogin = ref(true);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    loading.value = false;
  });
});
</script>