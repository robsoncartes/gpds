<template>
  <div class="row">
    <nav class="text-white col-md-3 p-0">
      <div class="botao-container">
        <button class="text-muted" @click="listen">
          <i class="fas fa-microphone-alt"></i>
        </button>
        <p>{{ estado }}</p>
      </div>

      <ul class="menu-container">
        <li class="mb-1" @click="abrirHistorico">Ver Histórico</li>
        <li class="mb-1">Ver Dicas</li>
        <li class="mb-1">Ver Créditos</li>
        <li class="mb-1">Sair</li>
      </ul>

      <div>
        <a href="#">Github</a>
      </div>
    </nav>

    <div class="main-container col-md-9 text-white">
      <div class="row">
        <p class="text-muted">{{ output }}</p>
        <div class="row p-3">
          <div class="filme col-3 p-2" v-for="(movie, index) in movies" :key="index">
            <img :src="movie.poster_path" />
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
        <p class="text-muted">{{ sinopseModal.overview }}</p>
      </template>

      <template v-slot:modal-footer="{ ok }">
        <b-button size="sm" variant="danger" @click="ok()">OK</b-button>
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
        <b-button size="sm" variant="danger" @click="ok()">OK</b-button>
      </template>
    </b-modal>
  </div>
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
      historico: []
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
              const content = event.results[i][0].transcript.trim();
              app.output = content;
              app.adicionarHistorico(content);
              if (content.indexOf("título") != -1) {
                let frase = content.split("título ");
                app.fetchMoviesByTitle(frase[1]);
              } else if (content.indexOf("gênero") != -1) {
                let frase = content.split("gênero ");
                app.fetchMoviesByGenre(frase[1]);
              } else if (content.indexOf("sobre o filme ") != -1) {
                let frase = content.split("filme ");
                app.abrirSinopse(frase[1]);
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
              i;
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
        result.id;

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

    abrirSinopse(id) {
      let numero = id - 1;
      this.sinopseModal = this.movies[numero];
      console.log(this.sinopseModal);
      this.$bvModal.show("modal-filme");
    },

    abrirHistorico() {
      this.$bvModal.show("modal-historico");
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
    }
  },

  created() {
    this.fetchGenreList();
  }
};
</script>

<style src="../assets/sass/style.scss" lang="scss">
