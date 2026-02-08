function loadContent(jsonFile) {
  fetch(jsonFile)
    .then(res => res.json())
    .then(data => {
      Object.keys(data).forEach(key => {
        const el = document.getElementById(key);
        if (el) el.innerHTML = data[key];
      });
    })
    .catch(err => console.error("JSON load error:", err));
}
