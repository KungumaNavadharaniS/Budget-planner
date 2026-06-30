<template>
  <div class="container mt-5">

    <div class="card p-4 shadow mx-auto" style="max-width:400px">

      <h2 class="text-center mb-4">
        Register
      </h2>

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
        class="btn btn-success w-100"
        @click="register"
      >
        Register
      </button>

      <p class="text-center mt-3">

        Already have an account?

        <a href="#"
           @click.prevent="$emit('showLogin')">
          Login
        </a>

      </p>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase/config";

const emit = defineEmits(["registered","showLogin"]);

const email = ref("");

const password = ref("");

async function register(){

try{

await createUserWithEmailAndPassword(

auth,

email.value,

password.value

);

emit("registered");

}

catch(err){

alert(err.message);

}

}
</script>