fetch('./content/Settings/maintenance.json')
  .then(res => res.json())
  .then(config => {
    const isLocal = config.whitelist.includes(window.location.hostname);

    if (config.enabled && !isLocal) {
      sessionStorage.setItem('maintenanceMessage', config.message || '');
      window.location.href = './maintenance.html';
    }
  })
  .catch(err => {
    console.error('Maintenance config failed to load:', err);
  });
