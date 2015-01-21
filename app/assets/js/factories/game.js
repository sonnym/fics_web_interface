ficsClient.factory("Game", ["MessageCollection", "ActivityNotifier", "Proxy", function(MessageCollection, ActivityNotifier, Proxy) {
  function Game(gameData) {
    this.updates = false;
    this.messageCollection = new MessageCollection();

    _.extend(this, gameData);

    var self = this;
    ActivityNotifier.call(this, {
      active: false,

      deactivate: function() {
        self.updates = false;
        self.messageCollection.newMessages = false;
      },

      notify: function() {
        return self.updates || self.messageCollection.notify();
      }
    });
  }

  Game.prototype.update = function(gameData) {
    this.updates = true;

    if (gameData.update.position) {
      this.setPosition(gameData.update);

    } else if (gameData.update.message) {
      this.storeMessage(gameData.update);

    } else if (gameData.update.result) {
      this.setResult(gameData.update.result);

    } else {
      this.chat = { mode: "whisper" };
    }
  };

  Game.prototype.setPosition = function(metaData) {
    this.metaData = metaData;

    if (this.moves) {
      if (metaData.current.color === "W") {
        _.last(this.moves).push(metaData.move.algebraic);
      } else {
        this.moves.push([metaData.move.algebraic]);
      }
    } else {
      Proxy.sendMessage("moveList", { number: this.number });
    }

    if (!this.observers) {
      Proxy.sendMessage("observerList", { number: this.number });
    }
  };

  Game.prototype.storeMessage = function(message) {
    this.messageCollection.push(messages);
  };

  Game.prototype.messages = function() {
    return this.messageCollection.messages;
  };

  Game.prototype.setResult = function(result) {
    if (this.metaData) {
      this.metaData.result = result;
    } else {
      this.metaData = { result: result };
    }

    this.isComplete = true;
  };

  return Game;
}]);
