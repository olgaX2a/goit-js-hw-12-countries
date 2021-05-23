import './sass/main.scss';
import './sass/main.scss';
import debounce from 'lodash.debounce'
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import refs from './js/refs';
import fetchCountries from './js/fetchCountries';
import singleCountryTemplate from './templates/singleCountryTemplate.hbs';
import multipleCountriesTemplate from './templates/multipleCountriesTemplate.hbs';

refs.input.addEventListener('input', debounce(searchCountry, 500))

function searchCountry(event) {
    const searchQuery = event.target.value.trim()
    if (!searchQuery) {
        clearMarkup()
        return
    }
    if (searchQuery) {
        fetchCountries(searchQuery)
        .then(data => {
            if (data.length === 1) {
                const markup = singleCountryTemplate(data[0])
                renderMarkup(markup);
                return
            }
            if (data.length > 1 && data.length < 11) {
                const markup = multipleCountriesTemplate(data)
                renderMarkup(markup);
                return
            }
            if (data.length > 10) {
                onResultExcess()
                return
            }
            if (data.status === 404) {
                onBadRequest()
                return
            }
    })
    }
    
}

function renderMarkup(markup) {
    return refs.container.innerHTML = markup
}
function onResultExcess () {
    return error({
                    text: "Too many matches found. Please enter more specific query.",
                    type: "error",
                    delay: 2000
                });
}
function onBadRequest () {
    return error({
                    text: "You entered an invalid value. Please check your query.",
                    type: "error",
                    delay: 2000
                });
}

function clearMarkup() {
    return refs.container.innerHTML = ""
}

