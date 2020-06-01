const MainVue = new Vue({
  el: "#app",
  data: {
    movies: [],
    genres: [],
    genresName: [],
    output: "",
    estado: "Clique no botão e fale!"
  },

  methods: {
    listen() {
      const app = this
      start()

      function start() {
        const recognition = new webkitSpeechRecognition();
        app.estado = "Estou ouvindo..."
        recognition.interimResults = true;
        recognition.lang = "pt-BR";
        recognition.continuous = false;
        recognition.start();
        recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              app.estado = "Clique no botão e fale!"
              const content = event.results[i][0].transcript.trim();
              app.output = content;
              if (content.indexOf("título") != -1) {
                let frase = content.split('título ')
                app.fetchMoviesByTitle(frase[1])
              } else if (content.indexOf("gênero") != -1) {
                let frase = content.split('gênero ')
                app.fetchMoviesByGenre(frase[1])
              }
            }
          }
        }
      }
    },

    fetchMoviesByTitle(movie) {
      this.movies = []
      const app = this
      const apikey = 'a00e0631ee67bd0195cf03c00ae9fc1f'
      let uri = "https://api.themoviedb.org/3/search/movie?api_key=" + apikey + "&query=" + movie

      fetch(uri)
        .then(r => r.json())
        .then(resultado => {
          for (let i = 1; i <= resultado.total_pages; i++) {
            let uri = "https://api.themoviedb.org/3/search/movie?api_key=" + apikey + "&query=" + movie + "&page=" + i
            fetch(uri)
              .then(re => re.json())
              .then(movie => {
                movie.results.forEach(item => {
                  if (item.poster_path != null) {
                    item.poster_path = 'http://image.tmdb.org/t/p/w185' + item.poster_path
                    app.movies.push(item)
                  }
                })
              })
          }
        })
        .catch(function (error) {
          console.log("Não encontramos mais nada. ")
        })

    },

    fetchMoviesByGenre(genre) {
      this.movies = []
      const app = this
      const apikey = 'a00e0631ee67bd0195cf03c00ae9fc1f'
      const result = this.genresName.find(obj => obj.name === genre)
      console.log(genre)
      console.log(result.id)

      let uri = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apikey + '&with_genres=' + result.id

      fetch(uri)
        .then(r => r.json())
        .then(resultado => {
          resultado.results.forEach(item => {
            if (item.poster_path != null) {
              item.poster_path = 'http://image.tmdb.org/t/p/w185' + item.poster_path
              app.movies.push(item)
              console.log(item)
            }
          })
        })
    },

    fetchGenreList() {
      const app = this
      const apikey = 'a00e0631ee67bd0195cf03c00ae9fc1f'
      let uri = 'https://api.themoviedb.org/3/genre/movie/list?api_key=' + apikey + '&language=pt-BR'
      fetch(uri)
        .then(r => r.json())
        .then(resultado => {
          app.genres = resultado.genres
          app.genres.forEach(genre => {
            genre.name = genre.name.toLowerCase()
            app.genresName.push(genre)
          })
        })
    }
  },

  created() {
    this.fetchGenreList()
  }
})