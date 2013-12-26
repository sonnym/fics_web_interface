# FICS Web Interface

A project intended to modernize interfaces for the
[Free Internet Chess Server](http://freechess.org) using
[node](http://nodejs.org) and [AngularJS](http://angularjs.org).

### Structure
The bulk of interaction with the FICS server is handled in the separate
[fics](https://github.com/sonnym/fics) module. All interaction between the user,
the [express](http://expressjs.com/) application occurs in this project.

### Contributing
All contributions are welcome. The application can be installed locally by
running `npm install` in the repository root directory. Running `npm start`
will start the application running on port 8000.
