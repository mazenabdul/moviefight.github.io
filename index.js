const autoCompleteConfig = {
    renderOption(movie) {
        const imageUrl = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src = '${imageUrl}'/>
            <b>${movie.Title}</b> (${movie.Year})
            
        `;
    },

    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '3c8a4e3d',
                s: searchTerm

            }
        })

        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }

}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    placeholder: 'Enter a movie here',
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    },
})
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    placeholder: 'Enter a movie here',
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');;
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    },
})

let leftMovie;
let rightMovie;
const onMovieSelect = async(movie, summaryElement, side) => {
    const res = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '3c8a4e3d',
            i: movie.imdbID

        }
    });

    console.log(res.data)
    summaryElement.innerHTML = movieTemplate(res.data);

    if (side === 'left') {
        leftMovie = res.data;
    } else {
        rightMovie = res.data;
    }
    if (leftMovie && rightMovie) {
        compare();
    }
};

const compare = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (leftSideValue > rightSideValue) {
            leftStat.classList.add('is-primary');
            rightStat.classList.add('is-danger');

        } else if (leftSideValue === rightSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-dark');
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-dark');
        } else {
            leftStat.classList.add('is-danger');
            rightStat.classList.add('is-primary');
        }

    })
}

const movieTemplate = (movieDetails) => {;
    const runTime = parseInt(movieDetails.Runtime);
    const ratingRT = parseInt(movieDetails.Ratings[1].Value);
    const ratingIMDB = parseInt(movieDetails.imdbRating * 10);
    const Votes = parseInt(movieDetails.imdbVotes.replace(/\$/g, '').replace(/,/g, ''));
    const awards = movieDetails.Awards.split(' ').reduce((acc, word) => {
            const value = parseInt(word);
            if (isNaN(value)) {
                return acc;
            } else {
                return acc + value;
            }
        }, 0)
        // console.log(awards);
        // console.log('Votes:', Votes);
        // console.log('Runtime:', runTime);
        // console.log('IMDB rating:', ratingIMDB);
        // console.log('Rotten Tomatoes:', ratingRT);



    return `
        <article class = 'media'>
            <figure class = 'media-left'>
                <p class ='image'>
                    <img src = "${movieDetails.Poster}" height = 200px, width = 200px />
                </p>
            </figure>
            <div class ='media-content'>
                <div class = 'content'>
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
         </article>

         <article class = 'notification is-primary'>
            <p class = 'title'>${movieDetails.Actors}</p>
            <p class = 'subtitle'>Starring:</p>
        </article>

        <article data-value = ${runTime} class = 'notification is-primary'>
            <p class = 'title'>${movieDetails.Runtime}</p>
            <p class = 'subtitle'>Runtime:</p>
        </article>

        <article data-value=${awards} class = 'notification is-primary'>
            <p class = 'title'>${movieDetails.Awards}</p>
            <p class = 'subtitle'>Awards</p>
        </article>
        
        <article data-value=${ratingRT} class = 'notification is-primary'>
            <p class = 'title'>${movieDetails.Ratings[1].Value}</p>
            <p class = 'subtitle'>Rotten Tomatoes:</p>
        </article>
        <article data-value=${ratingIMDB} class = 'notification is-primary'>
            <p class = 'title'>${movieDetails.imdbRating}</p>
            <p class = 'subtitle'>IMDB Rating:</p>
        </article>
        <article data-value = ${Votes} class = 'notification is-primary'>
            <p class = 'title'>${movieDetails.imdbVotes}</p>
            <p class = 'subtitle'>IMDB Votes:</p>
        </article>
    
    `
}
