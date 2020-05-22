const MainVue = new Vue({
  el: "#app",
  data: {
    movies: []
  },

  methods: {
      listen(){
        const app = this
        const output = document.querySelector('#output');
        start()
        function start() {
          const recognition = new webkitSpeechRecognition();
          recognition.interimResults = true;
          recognition.lang = "pt-BR";
          recognition.continuous = false;
          recognition.start();
          recognition.onresult = function(event) {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                const content = event.results[i][0].transcript.trim();
                output.textContent = content;
                app.fetchMoviesByTitle(content)
              }
            }
          };
        };
      },

      fetchMoviesByTitle(movie) {
          this.movies = []
          const app = this
          const apikey = 'a00e0631ee67bd0195cf03c00ae9fc1f'
          let uri = "https://api.themoviedb.org/3/search/movie?api_key="+ apikey + "&query=" + movie
          
          fetch(uri)
            .then(r => r.json())
            .then(resultado => {
                for(let i = 1 ; i <= resultado.total_pages; i++){
                  let uri = "https://api.themoviedb.org/3/search/movie?api_key="+ apikey + "&query=" + movie + "&page=" + i
                  fetch(uri)
                    .then(re => re.json())
                    .then(movie => {
                        movie.results.forEach(item => {
                          if(item.poster_path != null){
                            item.poster_path = 'http://image.tmdb.org/t/p/w185' + item.poster_path
                            app.movies.push(item)
                            console.log(item)
                          }
                        })
                    })
                }
            })
            .catch(function(error) {
              console.log("Não encontramos mais nada. ")
            })
      }
  }
})