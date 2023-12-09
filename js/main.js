const select = document.getElementById('cities-select');
const printCity = document.getElementById('print-city');
const printForecast = document.getElementById('print-forecast');

let selectedCity = '';

const formatDate = (date) => {
  // Convert to string and structure it in 'yyyy-mm-dd' format
  let dateString = String(date);
  let formattedDateString = `${dateString.slice(0, 4)}-${dateString.slice(
    4,
    6
  )}-${dateString.slice(6)}`;

  // Create Date object
  let formatedDate = new Date(formattedDateString);

  // Array of month names
  let monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Array of day names
  let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get the day, month name and day name
  let day = formatedDate.getDate();
  let month = monthNames[formatedDate.getMonth()];
  let dayName = dayNames[formatedDate.getDay()];

  return `${dayName} ${month} ${day}`;
};

const weatherByCity = async (latitude, longitude) => {
  const response = await fetch(
    `http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&unit=metric&product=civillight&output=json`
  );
  `http://www.7timer.info/bin/astro.php?lon=${longitude}&lat=${latitude}&ac=0&lang=en&unit=metric&output=internal&tzshift=0`;
  const forecast = await response.json();
  return forecast.dataseries;
};

const getCities = async () => {
  // create array of object from city.csv
  const response = await fetch('./city_coordinates.csv');
  const csv = await response.text();
  var lines = csv.split('\n');

  var result = [];

  var headers = lines[0].split(',');

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(',');

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
};

const createDropdown = async () => {
  // get cities from citie csv file
  const cities = await getCities();

  // push cities to select element
  for (let i = 0; i < cities.length; i++) {
    const option = document.createElement('option');
    option.value = cities[i].city;
    option.innerHTML = cities[i].city;
    option.dataset.country = cities[i].country;
    option.dataset.latitude = cities[i].latitude;
    option.dataset.longitude = cities[i].longitude;
    select.appendChild(option);
  }
};

const run = () => {
  // create dropdown menu of cities
  createDropdown();

  // select a city
  select.onclick = async (e) => {
    e.preventDefault(); // not neccesary

    // do nothing when click on index 0 or click on current selected city
    if (select.selectedIndex === 0 || select.value === selectedCity) return;

    // set selected city value
    selectedCity = select.value;

    //clear content
    printForecast.innerHTML = '';

    //get current city option
    const option =
      document.getElementsByTagName('option')[select.selectedIndex];

    // print city and country
    printCity.innerHTML = select.value + ' - ' + option.dataset.country;

    //get weather data
    const weather = await weatherByCity(
      option.dataset.latitude,
      option.dataset.longitude
    );

    //create html
    for (let i = 0; i < weather.length; i++) {
      //main block
      const block = document.createElement('div');

      //date
      const dateText = document.createElement('h3');
      dateText.append(formatDate(weather[i].date));

      //img
      const img = document.createElement('img');
      img.setAttribute('src', `./images/${weather[i].weather}.png`);

      //weather text
      const weatherText = document.createElement('p');
      weatherText.append(weather[i].weather.toUpperCase());

      //max temp
      const maxTemp = document.createElement('p');
      maxTemp.append(`H: ${weather[i].temp2m.max} °C`);

      // min temp
      const minTemp = document.createElement('p');
      minTemp.append(`L: ${weather[i].temp2m.min} °C`);

      //append all emelents
      block.append(dateText);
      block.append(img);
      block.append(weatherText);
      block.append(maxTemp);
      block.append(minTemp);

      printForecast.appendChild(block);
    }
  };
};

run();
