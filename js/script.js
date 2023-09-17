const global = {
  currentPage : window.location.pathname,
  search:{
    term:'',
    type:'',
    page:1,
    totalPages:1,
    totalResults:0
  },
  api:{
    apiKey: '486145f1cfccbe0acbbfcbb181f5ecd9',
    apiUrl: 'https://api.themoviedb.org/3/'
  }

}

//Display 20 most polular movies
async function displayPopularMovies(){
  const { results } =  await fetchAPIData('movie/popular');

  results.forEach((movie)=>{
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        ${movie.poster_path?
          `<img
          src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />`:
        `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>`;
    document.getElementById('popular-movies').appendChild(div);
  });
  //console.log(results);
}


//Display 20 most polular tv shows
async function displayPopularShows(){
  const { results } =  await fetchAPIData('tv/popular');

  results.forEach((show)=>{
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
        ${show.poster_path?
          `<img
          src="https://image.tmdb.org/t/p/w500/${show.poster_path}"
          class="card-img-top"
          alt="${show.name}"
        />`:
        `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${show.name}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
      </div>`;
    document.getElementById('popular-shows').appendChild(div);
  });
  //console.log(results);
}

//Display Movie Details
async function displayMovieDetails(){
  const movieID = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieID}`);
  console.log(movie);

  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
        ${movie.poster_path?
          `<img
          src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
          class="card-img-top"
          alt="${movie.title}"
        />`:
        `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${movie.title}"
        />`
        }
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
          ${movie.overview}
        </p>
        <h5>Genres:</h5>
        <ul class="list-group">
          ${movie.genres.map((gerne)=>{
            return `<li>${gerne.name}</li>`;
          }).join('')}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${movie.production_companies.map((company)=>{
        return `<span>${company.name}</span>`;
      }).join(', ')}</div>
    </div>
  `;
  document.querySelector('#movie-details').appendChild(div);
}

//Display Shows Details
async function displayShowDetails(){
  const seriesId = window.location.search.split('=')[1];

  const series = await fetchAPIData(`tv/${seriesId}`);

  displayBackgroundImage('series', series.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
      <div>
      ${series.poster_path?
        `<img
          src="https://image.tmdb.org/t/p/w500/${series.poster_path}"
          class="card-img-top"
          alt="${series.name}"
        />`:
        `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${series.name}"
        />`
      }
      </div>
      <div>
        <h2>${series.original_name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${series.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${series.first_air_date}</p>
        <p>
          ${series.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${series.genres.map((gerne)=>{
            return `<li>${gerne.name}</li>`;
          }).join('')}
        </ul>
        <a href="${series.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
       <li><span class="text-secondary">Number Of Sesion:</span> ${series.number_of_seasons}</li>
        <li><span class="text-secondary">Number Of Episodes:</span> ${series.number_of_episodes}</li>
        <li>
          <span class="text-secondary">Last Episode To Air:</span>  ${series.last_episode_to_air.name} (${series.last_air_date})
        </li>
        <li><span class="text-secondary">Status:</span> ${series.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${series.production_companies.map((company)=>{
        return `<span>${company.name}</span>`;
      }).join(', ')}</div>
    </div>

  `;
  document.querySelector('#show-details').appendChild(div);


}

//Display backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

//Search Movies/Shows
async function search(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if(global.search.term !== '' && global.search.term !== null){
    const {results, total_pages, page, total_results} = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if(results.length === 0){
      showAlert('No Result Found','success'); 
      return;
    }
    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  }
  else{
    showAlert('please enter a search item','error');
  }
}

function displaySearchResults(results){
  document.getElementById('search-results').innerHTML='';
  results.forEach((result)=>{
    const div =document.createElement('div');
    div.classList.add('card');
    div.innerHTML=`
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${result.poster_path?
          `<img
          src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
          class="card-img-top"
          alt="${global.search.type==='movie'?result.title:result.name}"
        />`:
        `<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type==='movie'?result.title:result.name}}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type==='movie'?result.title:result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type==='movie'?result.release_date:result.first_air_date}</small>
        </p>
      </div>
    `;
    document.getElementById('search-results').appendChild(div);
  });
  document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
  `;

  pagination();
}

// creat and display pagination for search
function pagination(){
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
    <h3>${global.search.page} Page / ${global.search.totalPages} Pages</h3>
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter"Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  document.querySelector('#pagination').innerHTML='';
  document.querySelector('#pagination').appendChild(div);

  //Display Prev Button if on first page
  if(global.search.page === 1){
    document.querySelector('#prev').disabled = true;
  }

  //Display Next Page if on last page
  if(global.search.page === global.search.totalPages){
    document.querySelector('#next').disabled = true;
  }

  //Next Page
  document.querySelector('#next').addEventListener('click', async()=>{
    global.search.page++;
    const {results, totalPages} = await searchAPIData();
    displaySearchResults(results);
  });

  //Prev Page
  document.querySelector('#prev').addEventListener('click', async()=>{
    global.search.page--;
    const {results, totalPages} = await searchAPIData();
    displaySearchResults(results);
  });
  
}


//Display Slider Movies
async function displayMovieSlider(endpoint){
  const { results } = await fetchAPIData(endpoint);

  results.forEach((movie=>{
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML+=`
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);

  }))
  initSwipper();
}

async function displayTVSlider(endpoint){
  const { results } = await fetchAPIData(endpoint);

  results.forEach((series=>{
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML=`
      <a href="tv-details.html?id=${series.id}">
        <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${series.vote_average} / 10
      </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);

  }))
  initSwipper();
}

function initSwipper(){
  const swiper = new Swiper('.swiper',{
    slidesPerView:1,
    spaceBetween:30,
    freeMode: true,
    loop:true,
    autoplay:{
      delay : 3000,
      disableONIteraction: true
    },
    breakpoints:{
      500:{
        slidesPerView:1
      },
      700:{
        slidesPerView:2
      },
      900:{
        slidesPerView:3
      },
      1100:{
        slidesPerView:4
      }

    }
  });
}


// Fetch data from TMDB API
async function fetchAPIData(endpoint){
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

  const data = await response.json();

  hideSpinner();

  return data;
}

// Make Request to Search
async function searchAPIData(){
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;


  showSpinner();

  // const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&include_adult=false&language=en-US&query=${global.search.term}`);

  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&include_adult=false&language=en-US&query=${global.search.term}&page=${global.search.page}`);

  const data = await response.json();

  hideSpinner();

  return data;
}

function showSpinner(){
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner(){
  document.querySelector('.spinner').classList.remove('show');
}

// Highlight active link
function highlightActiveLink(){
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link)=>{
    if(link.getAttribute('href') === global.currentPage){
      link.classList.add('active');
    }
  })
}

//show alert
function showAlert(message, className){
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);
  console.log(alertEl);

  setTimeout(()=>alertEl.remove(),2000);
}

function addCommasToNumber(number){
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//Init App
function init(){
  switch(global.currentPage){
    case '/':
    case '/index.html':
      displayMovieSlider(`movie/now_playing`);
      displayPopularMovies();
      console.log('Home');
      break;
    case '/shows.html':
      displayTVSlider(`tv/on_the_air`);
      displayPopularShows();
      console.log('Shows');
      break;
    case '/movie-details.html':
      displayMovieDetails();
      console.log('Movie Details');
      break;
    case '/tv-details.html':
      displayShowDetails();
      console.log('TV Details');
      break;
    case '/search.html':
      search();
      console.log('Search');
      break;

  }
  highlightActiveLink();
}

init();