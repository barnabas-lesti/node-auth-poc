class Timer {
  createTimer () {
    return {
      startTime: Date.now(),
      finish,
    };
  }
}

function finish () {
  return Date.now() - this.startTime;
}

module.exports = new Timer();
