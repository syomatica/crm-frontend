(function () {
  function safeJsonParse(str, fallback) {
    try { return JSON.parse(str); } catch (e) { return fallback; }
  }

  function getTemplateUrl() {
    // se alcune pagine stanno a profondità diverse puoi renderlo configurabile
    return "../templates/menu.mst";
  }

  function buildViewModel() {
    const pmeFormat = safeJsonParse(sessionStorage.getItem('pme-format') || '', {});
    return {
      admins: sessionStorage.getItem('admins') === 'true',
      vv: sessionStorage.getItem('vv') || '',
      active: window.__MENU_ACTIVE__ || {},     // setti questa variabile per pagina
      pme: sessionStorage.getItem('pme') === 'true',
      mstLabels: pmeFormat.labels || {},
      mstItem: pmeFormat.item || {}
    };
  }

  function loadMenu() {
    const el = document.getElementById('themenu');
    if (!el) return;

    $.get(getTemplateUrl() + "?_" + Date.now(), function (template) {
      el.innerHTML = Mustache.render(template, buildViewModel());
      if (typeof eventMenu === 'function') eventMenu();
    });
  }

  // auto-run
  loadMenu();
})();
