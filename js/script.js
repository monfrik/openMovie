let form = document.querySelector('form');
let input = document.querySelector('input');
let searchText = document.querySelector('.searchText');
let moviesCont = document.querySelector('.moviesCont');
let searchIcon = document.querySelector('i');
let logo = document.querySelector('.logo');


logo.addEventListener('click',function(){
    location.reload();
});

input.addEventListener('mouseover', function(){
    searchText.classList.add('active');
});

input.addEventListener('mouseout', function(){
    if (input.value == ''){
        searchText.classList.remove('active');
    }
});

form.addEventListener('submit', function(event){
    event.preventDefault();
    searchMovie(input.value);
});

searchIcon.addEventListener('click',function(){
    searchMovie(input.value);
});

initialRender();

function searchMovie(name, initial){
    const loadImage = (url) => {
        return new Promise((resolve,reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', url);
            request.onprogress = () => {
                if (!initial) {
                    moviesCont.innerHTML = '';
                    moviesCont.innerHTML = 'Wait search in progress';
                }
            }
            request.onload = () => {
                if (!initial) {
                    moviesCont.innerHTML = '';
                }
                if (request.status===200){
                    let answer = JSON.parse(request.response);
                    if (answer.Response == 'False'){
                        reject(new Error(answer.Error));
                    }
                    resolve(request.response);
                }
                else{
                    reject(new Error('Произошла ошибка код ошибки:'+request.statusText))
                }
            }
            request.onerror = (error) => {
                reject(error)
            }
            request.send();
        });
    }
    const embeded = (url) => {
        loadImage(url)
            .then((result)=>{
                let movieInfo = JSON.parse(result);
                return movieInfo.Search;
            })
            .then((movies)=>{
                movies.forEach(element => {
                    let nameMovie = document.createElement('p');
                    nameMovie.innerHTML = element.Title;

                    let date = document.createElement('h2');
                    date.innerHTML = element.Year;

                    let imgCont = document.createElement('div');

                    let img = document.createElement('img');
                    img.src=element.Poster;
                    
                    let li = document.createElement('li');
                    imgCont.appendChild(img); 
                    imgCont.appendChild(date); 
                    
                    li.appendChild(imgCont);
                    li.appendChild(nameMovie); 
                    
                    moviesCont.appendChild(li); 
                });
            })
            .catch((error) => {
                let img = document.createElement('img');
                img.src='img/result-not-found-1.png';

                moviesCont.innerHTML = error;
                moviesCont.appendChild(img); 
            })
    }
    Promise.all([
        embeded(`http://www.omdbapi.com/?s=${name}&apikey=d5677312`)
    ]);
}

function initialRender(){
    let advice = document.createElement('h3');
    advice.innerHTML = 'Совет разарботчика';
    moviesCont.appendChild(advice);
    searchMovie('naruto', true);
}
