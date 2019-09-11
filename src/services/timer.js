function finish () {
  return (new Date()).getTime() - this.startTime;
}

class Timer {
  createTimer () {
    return {
      startTime: (new Date()).getTime(),
      finish,
    };
  }
}

module.exports = new Timer();
