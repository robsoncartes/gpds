<template>
  <b-container class="login-screen">
    <transition appear>
      <b-form @submit.prevent="auth" class="login-container">
        <h1 class="mb-4 text-muted">BuscaFilmes</h1>
        <hr/>
        <b-form-group label="Usuário" label-for="inputUsuario" description>
          <b-form-input
              id="inputUsuario"
              v-model="email"
              type="text"
              required
              placeholder="Entre com seu usuario"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Senha:" label-for="inputSenha" description>
          <b-form-input
              id="inputSenha"
              v-model="password"
              type="password"
              required
              placeholder="Entre com a Senha"
          ></b-form-input>
        </b-form-group>
        <div class="mb-3">
          <a
              style="color: blue; cursor: pointer"
              @click="abrirModalRegistro"
          >Ainda não é registrado? Registre-se</a>
        </div>

        <div>
          <b-button type="submit" variant="success" class="mr-2" :disabled="loading">
            <template v-if="loading">
              Entrando...
              <i class="fas fa-spinner fa-spin"></i>
            </template>
            <template v-else>Entrar</template>
          </b-button>
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

    <b-modal id="modal-registrar" size="md">
      <template v-slot:modal-header="{}">
        <h5 class="text-danger">Registrar</h5>
      </template>
      <template>
        <b-form-group label="Nome" label-for="inputNomeRegistro" description>
          <b-form-input
              id="inputNomeRegstro"
              v-model="nameRegistro"
              type="text"
              required
              placeholder="Insira seu nome"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="E-mail" label-for="inputEmailRegistro" description>
          <b-form-input
              id="inputEmailRegistro"
              v-model="emailRegistro"
              type="email"
              required
              placeholder="Entre com um email válido"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Senha:" label-for="inputSenhaRegistro" description>
          <b-form-input
              id="inputSenhaRegistro"
              v-model="passwordRegistro"
              type="password"
              required
              placeholder="Entre com a Senha"
          ></b-form-input>
        </b-form-group>
      </template>

      <template v-slot:modal-footer>
        <b-button
            type="submit"
            variant="success"
            class="mr-2"
            :disabled="loadingRegistro"
            @click="registrar"
        >
          <template v-if="loadingRegistro">
            Registrando...
            <i class="fas fa-spinner fa-spin"></i>
          </template>
          <template v-else>Registrar</template>
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import router from "../router";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,

      nameRegistro: "",
      emailRegistro: "",
      passwordRegistro: "",
      loadingRegistro: false
    };
  },
  methods: {
    async auth() {
      this.loading = true;
      const {email, password} = this;

      try {
        const res = await this.$firebase
            .auth()
            .signInWithEmailAndPassword(email, password);

        window.uid = res.user.uid;

        router.push("/");
      } catch (err) {
        console.log(err);
      }

      this.loading = false;
    },

    async registrar() {
      this.loadingRegistro = true;
      const {emailRegistro, passwordRegistro} = this;

      await this.$firebase
          .auth()
          .createUserWithEmailAndPassword(emailRegistro, passwordRegistro)
          .then(user => {
            this.nameRegistro = "";
            this.emailRegistro = "";
            this.passwordRegistro = "";
            console.log(user);
            alert("Registrado com Sucesso");
          })
          .catch(err => {
            console.log(err);
          });

      this.loading = false;
    },

    abrirModalRegistro() {
      this.$bvModal.show("modal-registrar");
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (window.uid) {
        vm.$router.push("/");
      }
    });
  }
};
</script>

<style>
</style>