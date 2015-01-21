ficsClient.factory("Game", ["MessageCollection", "Proxy", function(MessageCollection, Proxy) {
  function Game(gameData) {
    this.messageCollection = new MessageCollection();

    _.extend(this, gameData);
  }

  Game.prototype.update = function(gameData) {
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
