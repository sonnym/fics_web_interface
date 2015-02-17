global._ = require("./vendor/underscore");

require("./vendor/sockjs");

require("./vendor/angular");
require("./vendor/angular-cookies");

require("./vendor/angular-ui-boostrap_accordion");
require("./vendor/angular-ui-bootstrap_buttons");

require("./vendor/angular-ui-bootstrap_collapse");
require("./vendor/angular-ui-bootstrap_dropdown");
require("./vendor/angular-ui-bootstrap_pagination");
require("./vendor/angular-ui-bootstrap_tabs");
require("./vendor/angular-ui-bootstrap_transition");

require("./vendor/ui-utils");

require("./vendor/scrollglue");

require("./templates");

require("./fics");

require("./controllers/chat_ctrl");
require("./controllers/login_ctrl");
require("./controllers/observation_ctrl");
require("./controllers/play_ctrl");
require("./controllers/about_ctrl");
require("./controllers/console_ctrl");

require("./directives/board");
require("./directives/infinite_horizontal");
require("./directives/loading_area");
require("./directives/messages");
require("./directives/sought");
require("./directives/timer");
require("./directives/user_list");

require("./factories/about");
require("./factories/activity_notifier");
require("./factories/chat");
require("./factories/console");
require("./factories/finite_array");
require("./factories/game");
require("./factories/message_collection");
require("./factories/observe");
require("./factories/play");
require("./factories/proxy");
require("./factories/setter");
require("./factories/tab_manager");
require("./factories/user");

require("./filters/numerical");
require("./filters/paginate");
require("./filters/time");
