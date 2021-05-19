require(['jquery', 'knockout', 'underscore', 'backbone', 'backbone-relational'], function ($, ko, _, Backbone, RelationalModel) {
  NewZoo = Backbone.RelationalModel.extend({
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

  var ViewDemo = Backbone.View.extend({
    el: $('.animal-list'),
    initialize: function () {

      this.template = _.template($('.animal-template').html()),
        this.render();
    },
    events: {
      'click #login-button': 'animalTemplate'
    },
    animalTemplate: function (e) {


      if (SLno() != undefined) {
        var newAnimal = new NewAnimal({
          slno: SLno(),
          animal: Animal(),
          gender: Gender(),
          relation: Relation(),
          ZooName: ZooName()
        });
        localStorage.setItem(SLno(), JSON.stringify(newAnimal.toJSON()))
        Animal(null)
        Gender(null)
        Relation(null)
        ZooName(null)
        animalCollection.add(newAnimal);

      }
      else
        alert("enter serial nnumber")



    },

    render: function () {

      this.$el.html(this.template());
    }

  });
  new ViewDemo();



  var ZooCollection = Backbone.Collection.extend({

  });
  var zooCollection = new ZooCollection();

  var ZooView = Backbone.View.extend({
    model: new NewZoo(),
    tagName: 'tr',
    initialize: function () {
      this.template = _.template($('.blog-list-template').html());
      this.model.on('add', this.render, this);
      this.model.on('remove', this.render, this);
    },
    events: {
      'click #delete-zoo': 'delete',
      'click #new-animal': 'addAnimal'
    },
    addAnimal: function () {
      // alert(this.model.toJSON().zooName)
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (JSON.parse(localStorage.getItem(key)).ZooName == this.model.toJSON().zooName) {


          animalCollection.set(JSON.parse(localStorage.getItem(key)))
        }
       
      }

    },

    delete: function () {
      this.model.destroy();

    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;

    }
  });

  var ZooCollectionView = Backbone.View.extend({
    model: zooCollection,
    el: $('.zoo-list'),

    initialize: function () {
      var self = this;
      this.model.on('add', this.render, this);
      //   this.model.on('remove', this.render, this);
    },
    render: function () {
      var self = this;
      this.$el.html('');
      _.each(this.model.toArray(), function (zoo) {
        self.$el.append((new ZooView({ model: zoo })).render().$el);
      });
      return this;
    }
  });
  var zooCollectionView = new ZooCollectionView()

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

   var animalArray = []
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.length > 5){
      zooCollection.add(JSON.parse(localStorage.getItem(key)))
      if( JSON.parse(localStorage.getItem(key)).zooName != undefined){
      animalArray.push(JSON.parse(localStorage.getItem(key)).zooName)
      }
    }
  }
  var ViewModel = function (slno, animal, gender, relation, zoo) {
    this.SLno = ko.observable(slno)
    this.Animal = ko.observable(animal);
    this.Gender = ko.observable(gender)
    this.Relation = ko.observable(relation)
    this.ZooName = ko.observable(zoo)
    this.zooname = ko.observableArray(animalArray)
    this.Relations = ko.observableArray([
      'child', 'husband', 'wife', 'No  Relation'
    ]);
    this.gender = ko.observableArray([
      'male', 'female'
    ])
  }
  ko.applyBindings(ViewModel())

  $(document).ready(function (event) {
    $('.add-zoo').on('click', function () {
      var newZoo = new NewZoo({
        zooName: $('.author-input').val(),
        ZooId: $('.id-input').val()
      })
      console.log(newZoo.attributes)
      localStorage.setItem($('.id-input').val(), JSON.stringify(newZoo.attributes))
      zooCollection.add(newZoo)
      window.location.reload(false);
    })

  })
 
})
