import countryItemTpl from './templates/countryItem.hbs';
import countryListTpl from './templates/countryList.hbs';

import API from './js/fetchCountries';
import getRefs from './js/get-refs';

import debounce from '../node_modules/lodash.debounce';

import * as PNotify from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';
import { defaults } from '@pnotify/core';

PNotify.defaultModules.set(PNotifyMobile, {});
defaults.delay = 2000;

const refs = getRefs();

refs.inputField.addEventListener('input', debounce(onInputSearch, 500));

function onInputSearch(evt) {
  evt.preventDefault();

  const input = evt.target;
  const searchQuery = input.value;

  //   console.log(searchQuery);

  if (!searchQuery) {
    return;
  }

  API.fetchCountry(searchQuery).then(renderCountryCard).catch(onFetchError);
}

function renderCountryCard(country) {
  if (country.status === 404) {
    onFetchError(error);
  }

  if (country.length > 10) {
    PNotify.error({
      text: 'Too many matches found! Please enter a more specific query!',
    });
  }

  if (country.length >= 2 && country.length <= 10) {
    const countryListMarkup = countryListTpl(country);
    refs.countryContainer.innerHTML = countryListMarkup;
  }

  if (country.length === 1) {
    const countryItemMarkup = countryItemTpl(country);
    refs.countryContainer.innerHTML = countryItemMarkup;
  }
}

function onFetchError(error) {
  PNotify.error({
    text: `Sorry, this country doesn't exists in the database`,
  });
}
