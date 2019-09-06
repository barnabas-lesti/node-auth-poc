const consola = require('consola').withScope('dba');

const logger = consola.create({
  // level: 4,
  reporters: [
    new consola.JSONReporter()
  ],
  defaults: {
    additionalColor: 'white'
  }
})
