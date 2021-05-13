
// Backbone Model

Zoo = Backbone.RelationalModel.extend({
	relations: [{
		type: Backbone.HasMany,
		key: 'animals',
		relatedModel: 'NewAnimal',
		collectionType: 'Blogs',
		reverseRelation: {
			key: 'livesIn',
			includeInJSON: 'id'
		}
	}]
});




var NewAnimal = Backbone.RelationalModel.extend({
	
});



var Blogs = Backbone.Collection.extend({
	 
});


var blogs = new Blogs();


var BlogView = Backbone.View.extend({
	model: new  NewAnimal(),
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.blogs-list-template').html());
	},
	events: {
		'click .delete-blog': 'delete'
	},
	
	delete: function() {
		this.model.destroy();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var BlogsView = Backbone.View.extend({
	model: blogs,
	el: $('.blogs-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('remove', this.render, this);
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(blog) {
			self.$el.append((new BlogView({model: blog})).render().$el);
		});
		return this;
	}
});
var blogsView = new BlogsView();

$(document).ready(function(event) {
	$('.add-blog').on('click', function() {
		var newAnimal = new NewAnimal({
			animal : Animal(),
			gender: Gender(),
			relation : Relation()
		});
		Animal(null)
		Gender(null)
		Relation(null)
		blogs.add(newAnimal);


	});
})
var  NameViewModel = function(fname,lname,relation){
    this.Animal =  ko.observable(fname);
    this.Gender = ko.observable(lname)
	this.Relation = ko.observable(relation)
	this.Relations = ko.observableArray ([
		'child','husband','wife'
	 ]);
	 this.gender = ko.observableArray([
		 'male','female'
	 ])
}
ko.applyBindings( NameViewModel())


