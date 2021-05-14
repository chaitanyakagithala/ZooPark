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

require(['jquery', 'knockout', 'underscore', 'backbone', 'backbone-relational'], function ($, ko, _, Backbone, RelationalModel) {
  Zoo = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany,
      key: 'animals',
      relatedModel: 'NewAnimal',
      collectionType: 'AnimalCollection',
      reverseRelation: {
        key: 'livesIn',
        includeInJSON: 'id'
      }
    }]
  });




  var NewAnimal = Backbone.RelationalModel.extend({

  });



  var AnimalCollection = Backbone.Collection.extend({

  });


  var animalCollection = new AnimalCollection();


  var AnimalView = Backbone.View.extend({
    model: new NewAnimal(),
    tagName: 'tr',
    initialize: function () {
      this.template = _.template($('.blogs-list-template').html());
    },
    events: {
      'click.delete-blog': 'delete'
    },

    delete: function () {
      localStorage.removeItem(this.model.toJSON().slno)
      this.model.destroy();

    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var AnimalCollectionView = Backbone.View.extend({
    model: animalCollection,
    el: $('.blogs-list'),
    initialize: function () {
      var self = this;
      this.model.on('add', this.render, this);
      this.model.on('remove', this.render, this);
    },
    render: function () {
      var self = this;
      this.$el.html('');
      _.each(this.model.toArray(), function (animal) {
        self.$el.append((new AnimalView({ model: animal })).render().$el);
      });
      return this;
    }
  });
  var animalCollectionView = new AnimalCollectionView();




  var NameViewModel = function (slno, animal, gender, relation) {
    this.SLno = ko.observable(slno)
    this.Animal = ko.observable(animal);
    this.Gender = ko.observable(gender)
    this.Relation = ko.observable(relation)
    this.Relations = ko.observableArray([
      'child', 'husband', 'wife', 'No  Relation'
    ]);
    this.gender = ko.observableArray([
      'male', 'female'
    ])
  }
  ko.applyBindings(NameViewModel())

  $(document).ready(function (event) {
    $('.add-blog').on('click', function () {

      if (SLno() != undefined) {
        var newAnimal = new NewAnimal({
          slno: SLno(),
          animal: Animal(),
          gender: Gender(),
          relation: Relation()
        });
        localStorage.setItem(SLno(), JSON.stringify(newAnimal.toJSON()))
        Animal(null)
        Gender(null)
        Relation(null)
        animalCollection.add(newAnimal);

      }
      else
        alert("enter serial nnumber")



    });
  })


  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    animalCollection.add(JSON.parse(localStorage.getItem(key)))
  }
})
