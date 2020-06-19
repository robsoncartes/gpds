<template>
  <b-container class="login-screen">
    <transition appear>
      <b-form @submit.prevent="auth" @reset="onReset" v-if="show" class="login-container">
        <h1 class="mb-4 text-muted">BuscaFilmes</h1>
        <hr />
        <b-form-group label="Usuário" label-for="inputUsuario" description>
          <b-form-input
            id="inputUsuario"
            v-model="form.email"
            type="text"
            required
            placeholder="Entre com seu usuario"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Senha:" label-for="inputSenha" description>
          <b-form-input
            id="inputSenha"
            v-model="form.password"
            type="password"
            required
            placeholder="Entre com a Senha"
          ></b-form-input>
        </b-form-group>
        <div class="mb-3">
          <router-link to="/register">Ainda não é registrado? Registre-se</router-link>
        </div>

        <div>
          <b-button type="submit" variant="success" class="mr-2">Login</b-button>
          <b-button type="reset" variant="danger" @click="onReset()">Limpar Campos</b-button>
        </div>
      </b-form>
    </transition>

    <b-modal id="modal-erro-login" size="sm">
      <template v-slot:modal-header="{}">
        <h5 class="text-danger">Falha ao fazer o login</h5>
      </template>
      <template>
        <p class="text-muted">Usuário ou senha incorretos.</p>
      </template>

      <template v-slot:modal-footer="{ ok }">
        <b-button size="sm" variant="danger" @click="ok()">OK</b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async auth() {
      const { email, password } = this;

      try {
        const res = await this.$firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style>
</style>