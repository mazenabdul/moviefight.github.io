const createAutoComplete = ({ root, renderOption, placeholder, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
    <label><b>Search for a Movie!</b></label>
    <input class = 'input' placeholder = '${placeholder}'/>
    <div class = 'dropdown'>
        <div class = 'dropdown-menu'>
        <div class = 'dropdown-content results'></div>
        </div>
    </div>
`;

    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    const input = root.querySelector('input');

    const onInput = async(event) => {

        const movies = await fetchData(event.target.value);
        if (!movies.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');

        for (let movie of movies) {


            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(movie);
            option.addEventListener('click', (event) => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(movie);
                onOptionSelect(movie);

            })
            resultsWrapper.appendChild(option);
        }

    }

    input.addEventListener('input', debounce(onInput))

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        };
    })
}