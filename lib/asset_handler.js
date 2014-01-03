var path = require("path");

var ConnectMincer = require("connect-mincer");

module.exports.listen = function(app, rootPath) {
  var connectMincer = new ConnectMincer({
   root: rootPath,
   production: false,
   mountPoint: "/assets",
   manifestFile: path.join(rootPath, "public", "assets", "manifest.json"),
   paths: [ path.join(rootPath, "app", "assets", "css")
          , path.join(rootPath, "app", "assets", "js")
          ]
  });

  app.use(connectMincer.assets());
  app.use("/assets", connectMincer.createServer());

  app.get("/", function(req, res) {
    res.render(path.join(rootPath, "app", "templates", "index.ejs"));
  });
};
