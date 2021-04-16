<template>
  <b-container class="login-screen">
    <transition appear>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="login-container">
        <h1 class="mb-4 text-muted">Registrar-se</h1>
        <hr/>
        <b-form-group label="Nome de Usuário" label-for="inputUsuario" description>
          <b-form-input
              id="inputUsuario"
              v-model="form.username"
              type="text"
              required
              placeholder="Digite o nome de usuário"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="E-mail" label-for="inputEmail" description>
          <b-form-input
              id="inputEmail"
              v-model="form.email"
              type="text"
              required
              placeholder="Entre com um e-mail válido"
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
          <router-link to="/login">Já sou registrado. Entrar</router-link>
        </div>
        <div>
          <b-button type="submit" variant="success" class="mr-2">Registrar</b-button>
          <b-button type="reset" variant="danger">Limpar Campos</b-button>
        </div>
      </b-form>
    </transition>

    <b-modal id="modal-usuario-cadastrado" size="sm">
      <template v-slot:modal-header="{}">
        <h5 class="text-success">Cadastrado com Sucesso!</h5>
      </template>
      <template>
        <p
            class="text-muted"
        >Obrigado por se cadastrar, você será redirecioanado para a tela de login.</p>
      </template>

      <template v-slot:modal-footer>
        <b-button size="sm" variant="success" @click="redirectLogin()">OK</b-button>
      </template>
    </b-modal>

    <b-modal id="modal-erro-cadastro" size="sm">
      <template v-slot:modal-header="{}">
        <h5 class="text-danger">Falha ao registrar</h5>
      </template>
      <template>
        <p class="text-muted">E-mail já está cadastrado! Tente novamente.</p>
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
        username: "",
        password: ""
      },

      show: true
    };
  },
  methods: {
    onReset(evt) {
      evt.preventDefault();
      this.form.email = "";
      this.form.username = "";
      this.form.password = "";
    }
  }
};
</script>

<style lang="stylus" scoped></style>