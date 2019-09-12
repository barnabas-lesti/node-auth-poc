class Timer {
  createTimer () {
    return {
      startTime: (new Date()).getTime(),
      finish,
    };
  }
}

function finish () {
  return (new Date()).getTime() - this.startTime;
}

module.exports = new Timer();
