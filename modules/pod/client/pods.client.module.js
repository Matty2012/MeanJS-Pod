(function (app) {
  'use strict';

  app.registerModule('pods', ['core']);
  app.registerModule('pods.admin', ['core.admin']);
  app.registerModule('pods.admin.routes', ['core.admin.routes']);
  app.registerModule('pods.services');
  app.registerModule('pods.routes', ['ui.router', 'core.routes', 'pods.services']);
}(ApplicationConfiguration));
