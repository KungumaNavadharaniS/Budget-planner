<template>
  <div class="container mt-5">

    <div class="card p-4 shadow mx-auto" style="max-width:400px">

      <h2 class="text-center mb-4">Login</h2>

      <input
        v-model="email"
        type="email"
        class="form-control mb-3"
        placeholder="Email"
      />

      <input
        v-model="password"
        type="password"
        class="form-control mb-3"
        placeholder="Password"
      />

      <button
        class="btn btn-primary w-100"
        @click="login"
      >
        Login
      </button>

      <p class="text-center mt-3">
        Don't have an account?
        <a href="#" @click.prevent="$emit('showRegister')">
          Register
        </a>
      </p>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

const emit = defineEmits(["loggedIn","showRegister"]);

const email = ref("");
const password = ref("");

async function login(){

  try{

    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    emit("loggedIn");

  }catch(err){

    alert(err.message);

  }

}
</script>