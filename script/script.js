const country = document.querySelector("#search-country");
const btn = document.querySelector("#btn-submit");
let condition = document.querySelector("#condition");
let temperatur = document.querySelector("#temperatur");
let wing = document.querySelector("#wings");
let humidityValue = document.querySelector("#humidityValue");
let pressureValue = document.querySelector("#pressureValue");
let rain = document.querySelector("#rain");
const city = document.querySelector("#city");
const dateValue = document.querySelector("#date-value");
const timeValue = document.querySelector("#time-value");
const icon = document.querySelector("#icon-cloud");
const loading = document.querySelector("#loading");
const inputDate = document.querySelector("#dateInput");
const inputTime = document.querySelector("#timeInput");

let date = new Date();
let tanggal = date.getDate();
let bulan = date.getMonth() + 1;
let tahun = date.getFullYear();
let jam = date.getHours();
let minute = date.getMinutes();
if (minute < 10) {
  minute = "0" + minute;
}
const timeDesktop = jam + ":" + minute;
if (tanggal < 10) {
  tanggal = "0" + tanggal;
}
if (bulan < 10) {
  bulan = "0" + bulan;
}

let d = new Date();
d.setDate(d.getDate() - 7);
let date7 = d.getDate();
let bulan7 = d.getMonth() + 1;
let tahun7 = d.getFullYear();
if (date7 < 10) {
  date7 = "0" + tanggal;
}
if (bulan7 < 10) {
  bulan7 = "0" + bulan;
}
let date7Now = tahun7 + "-" + bulan7 + "-" + date7;
let dateNow = tahun + "-" + bulan + "-" + tanggal;
flatpickr("#dateInput", {
  altInput: true,
  altFormat: "j F, Y",
  dateFormat: "Y-m-d",
  maxDate: new Date().fp_incr(1),
  minDate: date7Now,
});
flatpickr("#timeInput", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i",
  time_24hr: true,
});
function showLoading() {
  loading.style.display = "block";
  loading.style.opacity = 1;
}

function hiddenLoading() {
  let loadingEffect = setInterval(() => {
    if (!loading.style.opacity) {
      loading.style.opacity = 1;
    }
    if (loading.style.opacity > 0) {
      loading.style.opacity -= 0.1;
    } else {
      clearInterval(loadingEffect);
      loading.style.display = "none";
    }
  }, 100);
}
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "0d799448b2msh3b92a6186580cd1p1ef143jsn015ce46557cb",
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
  },
};

condition.innerHTML = "-";
temperatur.innerHTML = 0;
wing.innerHTML = 0;
humidityValue.innerHTML = 0;
pressureValue.innerHTML = 0;
rain.innerHTML = 0;
btn.addEventListener("click", (e) => {
  e.preventDefault();
  const timeNow = parseInt(inputTime.value);
  showLoading();
  if (country.value == "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Input Daerah Tidak Boleh Kosong",
    });
    hiddenLoading();
    return;
  } else {
    if (inputDate.value == "") {
      fatchApi = fetch(
        `https://weatherapi-com.p.rapidapi.com/history.json?q=${country.value}&dt=${dateNow}&lang=en`,
        options
      );
    } else {
      fatchApi = fetch(
        `https://weatherapi-com.p.rapidapi.com/history.json?q=${country.value}&dt=${inputDate.value}&lang=en`,
        options
      );
    }
    fatchApi
      .then((response) => response.json())
      .then((response) => {
        const hour = response.forecast.forecastday[0].hour;
        let hours = [];
        let tempCelcius = [];
        let humidty = [];
        let wind = [];
        let pressure = [];
        hour.forEach((isi, index) => {
          if (index < 12) {
            index += " AM";
          } else {
            index -= 12;
            index += " PM";
          }
          if (index == "0 AM") {
            index = "12 AM";
          } else if (index == "0 PM") {
            index = "12 PM";
          }
          hours.push(index);
          tempCelcius.push(isi.temp_c);
          humidty.push(isi.humidity);
          wind.push(isi.wind_kph);
          pressure.push(isi.pressure_mb);
        });
        if (inputTime.value == "") {
          condition.innerHTML =
            response.forecast.forecastday[0].hour[jam].condition.text;
          temperatur.innerHTML =
            response.forecast.forecastday[0].hour[jam].temp_c + " C";
          wing.innerHTML =
            response.forecast.forecastday[0].hour[jam].wind_kph + " Km/h";
          humidityValue.innerHTML =
            response.forecast.forecastday[0].hour[jam].humidity + " %";
          pressureValue.innerHTML =
            response.forecast.forecastday[0].hour[jam].pressure_mb + " mb";
          rain.innerHTML =
            response.forecast.forecastday[0].hour[jam].chance_of_rain + " %";
          city.innerHTML = response.location.name;
          dateValue.innerHTML = response.forecast.forecastday[0].date;
          timeValue.innerHTML = timeDesktop;
          icon.setAttribute(
            "src",
            "https:" + response.forecast.forecastday[0].hour[jam].condition.icon
          );
        } else {
          condition.innerHTML =
            response.forecast.forecastday[0].hour[timeNow].condition.text;
          temperatur.innerHTML =
            response.forecast.forecastday[0].hour[timeNow].temp_c + " C";
          wing.innerHTML =
            response.forecast.forecastday[0].hour[timeNow].wind_kph + " Km/h";
          humidityValue.innerHTML =
            response.forecast.forecastday[0].hour[timeNow].humidity + " %";
          pressureValue.innerHTML =
            response.forecast.forecastday[0].hour[timeNow].pressure_mb + " mb";
          rain.innerHTML =
            response.forecast.forecastday[0].hour[timeNow].chance_of_rain +
            " %";
          city.innerHTML = response.location.name;
          dateValue.innerHTML = response.forecast.forecastday[0].date;
          timeValue.innerHTML = inputTime.value;
          icon.setAttribute(
            "src",
            "https:" +
              response.forecast.forecastday[0].hour[timeNow].condition.icon
          );
        }
        icon.classList.add("icon");
        tempChart(hours, tempCelcius);
        humadityChart(hours, humidty);
        windChart(hours, wind);
        pressureChart(hours, pressure);
        hiddenLoading();
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Api tidak ditemukan",
        });
        hiddenLoading();
        return;
      });
  }
});

function pluginChart() {
  const plugin = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = options.color || "#99ffff";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };
  return plugin;
}

function tempChart(hours, tempCelcius) {
  let chartStatus = Chart.getChart("chartTemp");
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  const ctx = document.getElementById("chartTemp");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: hours,
      datasets: [
        {
          label: "temperatur (C)",
          data: tempCelcius,
          borderWidth: 3,
        },
      ],
    },
    options: {
      plugins: {
        customCanvasBackgroundColor: {
          color: "white",
        },
      },
    },
    plugins: [pluginChart()],
  });
  document.querySelector("#tempratur").innerHTML = "Temperature Chart (C)";
}

function humadityChart(hours, humidity) {
  let chartStatus = Chart.getChart("chartHumadity");
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  const ctx = document.getElementById("chartHumadity");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: hours,
      datasets: [
        {
          label: "humadity (%)",
          data: humidity,
          borderWidth: 3,
        },
      ],
    },
    options: {
      plugins: {
        customCanvasBackgroundColor: {
          color: "white",
        },
      },
    },
    plugins: [pluginChart()],
  });
  document.querySelector("#humadity").innerHTML = "Humidity Chart (%)";
}

function windChart(hours, wind) {
  let chartStatus = Chart.getChart("chartWind");
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  const ctx = document.getElementById("chartWind");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: hours,
      datasets: [
        {
          label: "Wind Velocity (Km/h)",
          data: wind,
          borderWidth: 3,
        },
      ],
    },
    options: {
      plugins: {
        customCanvasBackgroundColor: {
          color: "white",
        },
      },
    },
    plugins: [pluginChart()],
  });
  document.querySelector("#wind").innerHTML = "Wind Speed Chart (Km/h)";
}

function pressureChart(hours, pressure) {
  let chartStatus = Chart.getChart("chartPressure");
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  const ctx = document.getElementById("chartPressure");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: hours,
      datasets: [
        {
          label: "Pressure (Milibar)",
          data: pressure,
          borderWidth: 3,
        },
      ],
    },
    options: {
      plugins: {
        customCanvasBackgroundColor: {
          color: "white",
        },
      },
    },
    plugins: [pluginChart()],
  });
  document.querySelector("#pressure").innerHTML = "Pressure Chart (Milibar)";
}
