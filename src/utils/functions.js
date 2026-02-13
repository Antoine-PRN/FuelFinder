export const getPostCode = (postCode) => {
  return postCode.toString().slice(0, 2);
};

export const getLastUpdate = (selectedStation) => {
  const dates = [
    selectedStation.gazole_maj,
    selectedStation.e85_maj,
    selectedStation.sp95_maj,
    selectedStation.sp98_maj,
    selectedStation.e10_maj,
  ];

  const latestDate = dates.reduce((latest, date) => {
    return new Date(date) > new Date(latest) ? date : latest;
  }, dates[0]);

  const formattedDate = new Date(latestDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const getAvailableFuels = (fuelsList) => {
  fuelsList = JSON.parse(fuelsList);

  return fuelsList.map((fuel) => ({
    name: fuel["@nom"],
    id: fuel["@id"],
    lastUpdate: fuel["@maj"],
    value: fuel["@valeur"],
  }));
};


export const getHours = (hoursList=null, horairesJour=null) => {
    if (horairesJour) {
        const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
        return daysOfWeek.map((day) => {
            const regex = new RegExp(`${day}(\\d{2}\\.\\d{2})-(\\d{2}\\.\\d{2})`);
            const match = horairesJour.match(regex);
            return {
            id: day,
            name: day,
            status: match ? "open" : "closed",
            openingTime: match ? match[1].replace(".", ":") : "N/A",
            closingTime: match ? match[2].replace(".", ":") : "N/A",
            };
        });
    }
    hoursList = JSON.parse(hoursList);
    return hoursList.jour.map((day) => ({
        id: day["@id"],
        name: day["@nom"],
        status: day["@ferme"],
        openingTime: day.horaire?.["@ouverture"] || "N/A",
        closingTime: day.horaire?.["@fermeture"] || "N/A",
    }));
};


