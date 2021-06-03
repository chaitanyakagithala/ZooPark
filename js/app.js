require(['jquery', 'knockout', 'underscore', 'backbone', 'backbone-relational','datatables'], function ($, ko, _, Backbone, RelationalModel,dataTable) {
 // Zoo Model
  NewZoo = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany,
      key: 'animals',
      relatedModel: 'NewAnimal',
      collectionType: 'AnimalCollection',
      reverseRelation: {
        key: 'ZooName',
        type: Backbone.Hasone,
        includeInJSON: 'id'
      }
    }]
  });
// view template for adding animal
  var addAnimalView= Backbone.View.extend({
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
        var animals = []
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
  new addAnimalView();



  var ZooCollection = Backbone.Collection.extend({

  });
  var zooCollection = new ZooCollection();
// view of all Zoo
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
      animalCollection.reset();
      var a = 0;
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
         
        if (JSON.parse(localStorage.getItem(key)).ZooName == this.model.toJSON().zooName) {
          animalCollection.add(JSON.parse(localStorage.getItem(key))) 
          a++;  
        }
      }
      if(a == 0){
        alert("no animals in zoo")
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
// Zoo Collection view
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


// Animal model
  var AnimalCollection = Backbone.Collection.extend({

  });

// Animal Collection
  var animalCollection = new AnimalCollection();

// View of  animal
  var AnimalView = Backbone.View.extend({
    model: new NewAnimal(),
    tagName: 'tr',
    initialize: function () {
      this.template = _.template($('.blogs-list-template').html());

    },
    events: {
      'click #delete-blog': 'delete',
      'click .get-zooname' : 'GetZooName'
    },
    
    GetZooName : function(){
      alert(this.model.toJSON().ZooName )
      var model= this.model.toJSON()
      console.log(model.ZooName)
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
// view of all animals
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

  // fecthing Zoo's from local storage
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
  // data binding for animal
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
    
    $('#table').dataTable();
   $('#animals').dataTable({searching: false, paging: false, info: false});
  })
 
})
