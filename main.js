function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  const stats = getEmployeeStatistics(employees);

  return stats;
}

/*
   GENEROVÁNÍ ZAMĚSTNANCŮ
*/
function generateEmployeeData(dtoIn) {
  const maleNames = [
    "Jan","Petr","Pavel","Martin","Tomáš","Josef","Milan","David","Jakub","Lukáš",
    "Jaroslav","Marek","Michal","Ondřej","Filip","Roman","Karel","Radek","Daniel","Patrik",
    "Adam","Matěj","Dominik","Aleš","Stanislav","Richard","Václav","Vojtěch","Jiří","Antonín",
    "Zdeněk","Libor","Oldřich","Vratislav","Rostislav","Bohumil","Hynek","Igor","Emil","Norbert",
    "Miroslav","Dalibor","Robin","Kristián","Denis","Šimon","Tadeáš","Erik","Marcel","Bedřich"
  ];

  const femaleNames = [
    "Jana","Petra","Marie","Eva","Lucie","Kateřina","Lenka","Hana","Alena","Veronika",
    "Martina","Barbora","Tereza","Monika","Klára","Nikola","Michaela","Adéla","Anna","Eliška",
    "Karolína","Markéta","Simona","Ivana","Dagmar","Jiřina","Zuzana","Radka","Natálie","Vendula",
    "Kristýna","Denisa","Olga","Miroslava","Blažena","Božena","Renata","Gabriela","Sabina","Andrea",
    "Sofie","Nela","Ludmila","Helena","Irena","Kamila","Jitka","Milada","Věra","Pavla"
  ];

  const surnames = [
    "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
    "Marek","Pospíšil","Hájek","Jelínek","Král","Růžička","Beneš","Fiala","Sedláček","Doležal",
    "Zeman","Kolář","Navrátil","Urban","Blažek","Krejčí","Kratochvíl","Musil","Pokorný","Vlček",
    "Polák","Konečný","Malý","Tichý","Staněk","Kadlec","Sýkora","Ptáček","Mach","Šimek",
    "Bartoš","Soukup","Valenta","Dušek","Čech","Beran","Pešek","Holub","Kříž","Šťastný"
  ];

  const workloads = [10, 20, 30, 40];
  const result = [];

  for (let i = 0; i < dtoIn.count; i++) {
    const gender = randomItem(["male", "female"]);

    let surname = randomItem(surnames);

    result.push({
      gender,
      birthdate: generateBirthdate(dtoIn.age.min, dtoIn.age.max),
      name: gender === "male" ? randomItem(maleNames) : randomItem(femaleNames),
      surname,
      workload: randomItem(workloads)
    });
  }

  return result;
}

/*
   STATISTIKY
*/
function getEmployeeStatistics(employees) {
  const total = employees.length;

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  const ages = [];
  const workloads = [];

  let womenWorkloadSum = 0;
  let womenCount = 0;

  const now = new Date();

  employees.forEach(emp => {
    const age = calculateAgeDecimal(emp.birthdate, now); // ❗ desetinný věk
    ages.push(age);
    workloads.push(emp.workload);

    if (emp.workload === 10) workload10++;
    if (emp.workload === 20) workload20++;
    if (emp.workload === 30) workload30++;
    if (emp.workload === 40) workload40++;

    if (emp.gender === "female") {
      womenWorkloadSum += emp.workload;
      womenCount++;
    }
  });

  //  PRŮMĚR VĚKU → 1 desetinné místo
  const averageAge = round(average(ages), 1);

  //  MIN / MAX → celé číslo
  const minAge = Math.round(Math.min(...ages));
  const maxAge = Math.round(Math.max(...ages));

  //  MEDIAN AGE → celé číslo
  const medianAge = Math.round(median(ages));

  //  MEDIAN WORKLOAD → celé číslo
  const medianWorkload = Math.round(median(workloads));

  //  PRŮMĚR ŽEN
  const averageWomenWorkload = womenCount
    ? round(womenWorkloadSum / womenCount, 1)
    : 0;

  //  ŘAZENÍ NUMERICKY
  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}

/* 
   KLÍČOVÁ FUNKCE – DESATINNÝ VĚK
*/
function calculateAgeDecimal(birthdate, now) {
  const diffMs = now - new Date(birthdate);
  return diffMs / (365.25 * 24 * 60 * 60 * 1000);
}

/* 
   POMOCNÉ FUNKCE
*/
function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function round(num, decimals) {
  return Number(num.toFixed(decimals));
}

function generateBirthdate(minAge, maxAge) {
  const now = new Date();
  const yearMs = 365.25 * 24 * 60 * 60 * 1000;

  const minTime = now.getTime() - maxAge * yearMs;
  const maxTime = now.getTime() - minAge * yearMs;

  const randomTime = randomNumber(minTime, maxTime);
  return new Date(randomTime).toISOString();
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
