<template>
  <transition>
    <div class="row m-auto">
      <nav class="text-white col-md-3 p-0">
        <div class="botao-container">
          <button class="text-muted" @click="listen">
            <i class="fas fa-microphone-alt"></i>
          </button>
          <p>{{ estado }}</p>
          <p class="text-muted">Você disse: {{ output }}</p>
        </div>

        <ul class="menu-container">
          <li class="mb-1" @click="abrirFavoritos">Meus Favoritos</li>
          <li class="mb-1" @click="abrirHistorico">Ver Histórico</li>
          <li class="mb-1" @click="abrirDicas">Ver Dicas</li>
          <li class="mb-1">Ver Créditos</li>
          <li class="mb-1" @click="logout">Sair</li>
        </ul>

        <div>
          <a href="https://github.com/robsoncartes/gpds">Github</a>
        </div>
      </nav>

      <div class="col-md-3">_</div>

      <div class="main-container col-md-9 text-white">
        <div class="row m-auto">
          <div class="row p-3">
            <div
              class="filme col-3 py-4"
              v-for="(movie, index) in movies"
              :key="index"
              @click="abrirSinopse(index + 1)"
            >
              <img :src="movie.poster_path" />
              <div class="indice">{{ index + 1 }}</div>
            </div>
          </div>
        </div>
        <div class="slideshow-sub"></div>
      </div>

      <b-modal id="modal-filme" size="lg">
        <template v-slot:modal-header="{}">
          <h5 class="text-danger">{{ sinopseModal.title }}</h5>
        </template>
        <template>
          <div class="row">
            <img :src="sinopseModal.poster_path" class="col-3" />
            <div class="col-9">
              <p class="text-muted">{{ sinopseModal.overview }}</p>
              <a :href="sinopseModal.google" target="_blank">Saber Mais</a>
            </div>
          </div>
        </template>

        <template v-slot:modal-footer="{ ok }">
          <b-button
            size="sm"
            variant="danger"
            @click="adicionarFavorito(idSelecionado)"
          >Adicionar aos Favoritos</b-button>
          <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-historico" size="lg">
        <template v-slot:modal-header="{}">
          <h5 class="text-danger">Histórico de Frase</h5>
        </template>
        <template>
          <b-table striped hover :items="historico" v-if="historico.length > 0"></b-table>
          <p v-else>Você não pesquisou nada ainda, dê uma olhada nas dicas para começar</p>
        </template>

        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-favoritos" size="lg">
        <template v-slot:modal-header="{}">
          <h5 class="text-danger">Meus Favoritos</h5>
        </template>
        <template>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Cód.</th>
                <th scope="col">Título</th>
                <th scope="col" class="text-center">Remover</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(favorito, index) in favoritos" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td
                  @click="abrirSinopseFavorito(index + 1)"
                  class="title-favorito"
                >{{ favorito.title }}</td>
                <td class="text-center">
                  <b-icon-x class="btn-remove" @click="removerFavorito(index + 1)"></b-icon-x>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-confirma-favorito" size="sm">
        <template v-slot:modal-header="{}">
          <h5 class="text-success">Filme adicionado com sucesso</h5>
        </template>
        <template>
          <p>Verifique sua lista de favoritos, o filme foi adicionado.</p>
        </template>

        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-erro-favorito" size="sm">
        <template v-slot:modal-header="{}">
          <h5 class="text-danger">Erro ao adicionar a favoritos</h5>
        </template>
        <template>
          <p>O filme já está na sua lista de favoritos!</p>
        </template>

        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="danger" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-filme-favorito" size="lg">
        <template v-slot:modal-header="{}">
          <h5 class="text-danger">{{ sinopseModalFavorito.title }}</h5>
        </template>
        <template>
          <div class="row">
            <img :src="sinopseModalFavorito.poster_path" class="col-3" />
            <div class="col-9">
              <p class="text-muted">{{ sinopseModalFavorito.overview }}</p>
              <a :href="sinopseModalFavorito.google" target="_blank">Saber Mais</a>
            </div>
          </div>
        </template>

        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>

      <b-modal id="modal-mostrar-dicas" size="lg">
        <template v-slot:modal-header="{}">
          <h5 class="text-danger">Dicas</h5>
        </template>
        <template>
          <ul class="menu-dicas">
            <li>
              Para buscar um filme por título, fale: título nome-do-filme. Ex.:
              <strong>título Homem Aranha</strong>
            </li>
            <li>
              Para buscar filmes por gênero, fale: gênero gênero. Ex.:
              <strong>gênero ação</strong>
            </li>
            <li>
              Para buscar abrir o histórico, fale:
              <strong>ver histórico</strong>
            </li>
            <li>
              Para buscar abrir a lista de favoritos, fale:
              <strong>ver favoritos</strong>
            </li>
          </ul>
        </template>

        <template v-slot:modal-footer="{ ok }">
          <b-button size="sm" variant="success" @click="ok()">OK</b-button>
        </template>
      </b-modal>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      genres: [],
      genresName: [],
      output: "",
      estado: "Clique no botão e fale!",
      sinopseModal: {},
      sinopseModalFavorito: {},
      historico: [],
      favoritos: [],
      idSelecionado: "",
      idSelecionadoFavorito: ""
    };
  },

  methods: {
    listen() {
      const app = this;
      start();

      function start() {
        const recognition = new window.webkitSpeechRecognition();
        app.estado = "Estou ouvindo...";
        recognition.interimResults = true;
        recognition.lang = "pt-BR";
        recognition.continuous = false;
        recognition.start();
        recognition.onresult = event => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              app.estado = "Clique no botão e fale!";
              const escutou = event.results[i][0].transcript.trim();
              const content = escutou.toLowerCase();
              console.log(content);
              app.output = content;
              app.adicionarHistorico(content);
              if (content.indexOf("título") !== -1) {
                let frase = content.split("título ");
                app.fetchMoviesByTitle(frase[1]);
              } else if (content.indexOf("gênero") !== -1) {
                let frase = content.split("gênero ");
                app.fetchMoviesByGenre(frase[1]);
              } else if (content.indexOf("sobre o filme") !== -1) {
                let frase = content.split("filme ");
                app.abrirSinopse(frase[1]);
              } else if (content.indexOf("favoritar filme") !== -1) {
                let frase = content.split("filme ");
                app.adicionarFavorito(frase[1]);
              } else if (content.indexOf("remover favorito") !== -1) {
                let frase = content.split("favorito ");
                app.removerFavorito(frase[1]);
              } else if (content.indexOf("abrir favorito ") !== -1) {
                let frase = content.split("favorito ");
                app.abrirSinopseFavorito(frase[1]);
              } else if (content.indexOf("ver histórico") !== -1) {
                app.abrirHistorico();
              } else if (content.indexOf("ver dicas") !== -1) {
                app.abrirDicas();
              } else if (content.indexOf("ver favoritos") !== -1) {
                app.abrirFavoritos();
              }
            }
          }
        };
      }
    },

    fetchMoviesByTitle(movie) {
      this.movies = [];
      const app = this;
      const apikey = "a00e0631ee67bd0195cf03c00ae9fc1f";
      let uri =
        "https://api.themoviedb.org/3/search/movie?api_key=" +
        apikey +
        "&query=" +
        movie;

      fetch(uri)
        .then(r => r.json())
        .then(resultado => {
          for (let i = 1; i <= resultado.total_pages; i++) {
            let uri =
              "https://api.themoviedb.org/3/search/movie?api_key=" +
              apikey +
              "&query=" +
              movie +
              "&page=" +
              i +
              "&language=pt-BR";

            fetch(uri)
              .then(re => re.json())
              .then(movie => {
                movie.results.forEach(item => {
                  if (item.poster_path != null) {
                    item.poster_path =
                      "http://image.tmdb.org/t/p/w185" + item.poster_path;
                    app.movies.push(item);
                  }
                });
              });
          }
        })
        .catch(function() {
          console.log("Não encontramos mais nada. ");
        });
      console.log(this.movies);
    },

    fetchMoviesByGenre(genre) {
      this.movies = [];
      const app = this;
      const apikey = "a00e0631ee67bd0195cf03c00ae9fc1f";
      const result = this.genresName.find(obj => obj.name === genre);
      console.log(genre);
      console.log(result.id);

      let uri =
        "https://api.themoviedb.org/3/discover/movie?api_key=" +
        apikey +
        "&with_genres=" +
        result.id +
        "&language=pt-BR";

      fetch(uri)
        .then(r => r.json())
        .then(resultado => {
          resultado.results.forEach(item => {
            if (item.poster_path != null) {
              item.poster_path =
                "http://image.tmdb.org/t/p/w185" + item.poster_path;
              app.movies.push(item);
              console.log(item);
            }
          });
        });
    },

    fetchGenreList() {
      const app = this;
      const apikey = "a00e0631ee67bd0195cf03c00ae9fc1f";
      let uri =
        "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
        apikey +
        "&language=pt-BR";

      fetch(uri)
        .then(r => r.json())
        .then(resultado => {
          app.genres = resultado.genres;
          app.genres.forEach(genre => {
            genre.name = genre.name.toLowerCase();
            app.genresName.push(genre);
          });
        });
    },

    adicionarHistorico(frase) {
      let hoje = new Date();
      let date = this.formatDate(hoje);
      let obj = {
        frase: frase,
        data: date
      };
      this.historico.push(obj);
    },

    adicionarFavorito(id) {
      if (this.favoritos.indexOf(this.movies[id - 1]) == -1) {
        this.favoritos.push(this.movies[id - 1]);
        this.$bvModal.show("modal-confirma-favorito");
      } else {
        this.$bvModal.show("modal-erro-favorito");
      }
    },

    abrirSinopse(id) {
      this.idSelecionado = id;
      console.log(this.idSelecionado);
      this.sinopseModal = this.movies[id - 1];
      this.sinopseModal.google =
        "https://www.google.com/search?q=" + this.sinopseModal.title;
      this.$bvModal.show("modal-filme");
    },

    abrirSinopseFavorito(id) {
      this.idSelecionadoFavorito = id;
      console.log(this.idSelecionadoFavorito);
      this.sinopseModalFavorito = this.movies[id - 1];
      this.sinopseModalFavorito.google =
        "https://www.google.com/search?q=" + this.sinopseModalFavorito.title;
      this.$bvModal.show("modal-filme-favorito");
    },

    abrirHistorico() {
      this.$bvModal.show("modal-historico");
    },

    abrirFavoritos() {
      this.$bvModal.show("modal-favoritos");
    },

    removerFavorito(id) {
      this.favoritos.splice(id - 1, 1);
    },

    abrirDicas() {
      this.$bvModal.show("modal-mostrar-dicas");
    },

    formatDate(date) {
      let dia = date.getDate();
      let mes = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
      ][date.getMonth()];
      let ano = date.getFullYear();
      let horas = date.getHours();
      let minutos = date.getMinutes();
      let segundos = date.getSeconds();

      return `${dia} de ${mes} de ${ano} às ${horas}:${minutos}:${segundos}`;
    },

    async logout() {
      this.$root.$emit("Spinner::show");

      await this.$firebase.auth().signOut();

      this.$router.push({ name: "login" });

      this.$root.$emit("Spinner::hide");
    }
  },

  created() {
    this.fetchGenreList();
  }
};
</script>


