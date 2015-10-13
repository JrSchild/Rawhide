'use strict'

var Adapter = require('../core/Adapter');

class MongoDBBasicAdapter extends Adapter {
  READ(metric) {}

  WRITE(data, done) {
    var start = Date.now();

    this.db.collection(this.parameters.thread.tableName)
      .insertOne(data, (err) => {
        this.model.setLatency(Date.now() - start);
        done(err);
      });
  }

  READ(done) {
    var start = Date.now();

    var cursor = this.db.collection(this.parameters.thread.tableName)
      .find({});

    cursor.nextObject((err, res) => {
      cursor.close()
      this.model.setLatency(Date.now() - start);
      done(err);
    });
  }

  createTable(cb) {
    this.db.createCollection(this.parameters.thread.tableName)
      .then(() => cb())
      .catch((err) => cb(err));
  }

  // Clean up and delete database.
  destroy() {}
}

module.exports = MongoDBBasicAdapter;