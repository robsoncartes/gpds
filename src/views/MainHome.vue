<template>
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
                <li class="mb-1">Ver Dicas</li>
                <li class="mb-1">Ver Créditos</li>
                <li class="mb-1">Sair</li>
            </ul>

            <div>
                <a href="#">Github</a>
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
                        <img :src="movie.poster_path"/>
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
                    <img :src="sinopseModal.poster_path" class="col-3"/>
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
                >Adicionar aos Favoritos
                </b-button>
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
                <div class="row">
                    <div v-for="(favorito, index) in favoritos" :key="index" class="col-12">{{favorito.title}}</div>
                </div>
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
                historico: [],
                favoritos: [],
                idSelecionado: "",
                populares: [],
            };
        },

        methods: {
            listen: function () {
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
                                } else if (content.indexOf("descobrir") !== -1) {
                                    let frase = content.split("descobrir");
                                    app.fetchMostPopularMovies(frase[1]);
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
                let uri = "https://api.themoviedb.org/3/search/movie?api_key=" + apikey + "&query=" + movie;

                fetch(uri)
                    .then(r => r.json())
                    .then(resultado => {
                        for (let i = 1; i <= resultado.total_pages; i++) {
                            let uri = "https://api.themoviedb.org/3/search/movie?api_key=" + apikey + "&query=" + movie + "&page=" + i;

                            fetch(uri)
                                .then(re => re.json())
                                .then(movie => {
                                    movie.results.forEach(item => {
                                        if (item.poster_path != null) {
                                            item.poster_path = "http://image.tmdb.org/t/p/w185" + item.poster_path;
                                            app.movies.push(item);
                                        }
                                    });
                                });
                        }
                    })
                    .catch(function () {
                        console.log("Não encontramos mais nada. ");
                    });
                console.log(this.movies);
            },

            fetchMostPopularMovies() {
                this.movies = [];
                const app = this;
                const apikey = "a00e0631ee67bd0195cf03c00ae9fc1f";
                const result = this.populares.find(obj => obj.populares);
                console.log(result);
                console.log(result.id);

                let uri = "https://api.themoviedb.org/3/discover/movie?api_key=" + apikey + "&sort_by=popularity.desc" + result.id;

                fetch(uri)
                    .then(r => r.json())
                    .then(resultado => {
                        resultado.results.forEach(item => {
                            if (item.poster_path != null) {
                                item.poster_path = "http://image.tmdb.org/t/p/w185" + item.poster_path;
                                app.movies.push(item);
                                console.log(item);
                            }
                        });
                    });
            },

            fetchPopularsList() {
                const app = this;
                const apiKey = "a00e0631ee67bd0195cf03c00ae9fc1f";
                let uri = "https://api.themoviedb.org/3/populars/movie/list?api_key=" + apiKey + "&language=pt-BR";

                fetch(uri)
                    .then(r => r.json())
                    .then(resultado => {
                        app.populars = resultado.populars;
                        app.populars.forEach(popular => {
                            popular.name = popular.name.toLowerCase();
                            app.populars.push(popular);
                        });
                    });
            },

            fetchMoviesByGenre(genre) {
                this.movies = [];
                const app = this;
                const apikey = "a00e0631ee67bd0195cf03c00ae9fc1f";
                const result = this.genresName.find(obj => obj.name === genre);
                console.log(genre);
                console.log(result.id);

                let uri = "https://api.themoviedb.org/3/discover/movie?api_key=" + apikey + "&with_genres=" + result.id;

                fetch(uri)
                    .then(r => r.json())
                    .then(resultado => {
                        resultado.results.forEach(item => {
                            if (item.poster_path != null) {
                                item.poster_path = "http://image.tmdb.org/t/p/w185" + item.poster_path;
                                app.movies.push(item);
                                console.log(item);
                            }
                        });
                    });
            },

            fetchGenreList() {
                const app = this;
                const apikey = "a00e0631ee67bd0195cf03c00ae9fc1f";
                let uri = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apikey + "&language=pt-BR";

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
                this.favoritos.push(this.movies[id - 1]);
                this.$bvModal.show("modal-confirma-favorito");
            },

            abrirSinopse(id) {
                this.idSelecionado = id;
                console.log(this.idSelecionado);
                this.sinopseModal = this.movies[id - 1];
                this.sinopseModal.google = "https://www.google.com/search?q=" + this.sinopseModal.title;
                this.$bvModal.show("modal-filme");
            },

            abrirHistorico() {
                this.$bvModal.show("modal-historico");
            },

            abrirFavoritos() {
                this.$bvModal.show("modal-favoritos");
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
            this.fetchPopularsList();
        }
    };
</script>

<style src="../assets/sass/style.scss" lang="scss"/>
