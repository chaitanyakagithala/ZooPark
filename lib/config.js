require.config({
  shim: {
    jquery: {
      exports: '$'
    },

    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    }
  }

})


