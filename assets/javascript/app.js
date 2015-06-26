// Item Backbone model. Name, text, status (0 or 1)
var Item = Backbone.Model.extend({
	defaults: {
		"name" : "",
		"status" : 0
	},
	
	validate: function() {
		
	},
	
	saveLocally: function() {
		if (typeof(Storage) !== void(0)) {
			var id = this.getLocalStorageKeysCount();
			localStorage[id] = JSON.stringify(this.toJSON());
		}
	},
	
	initialize: function() {
		if (this.validate) {
			console.log("Validation succesful, rendering and adding to collection");
			app.items.add(this);
			new ItemView({model : this});
			this.saveLocally();
		} else {
			console.log("Validation error");
		}
	},
	
	getLocalStorageKeysCount: function() {
		return Object.keys(localStorage).length;
	},
	
	toJSON: function() {
		return { "name" : this.get('name'), "status" : this.get('status') };
	}
	

});

// Items Collection
var Items = Backbone.Collection.extend({
});

// Item Backbone View.
var ItemView = Backbone.View.extend({
	tagName : 'div',
	className : 'todoItem',
	events : {
		"click" : "log",
		"click .todoItemFinish" : "finish",
		"click .todoItemEdit" : "edit",
		"click .todoItemRemove" : "delete",
		"click .todoItemFinishEdit" : "saveEdit"
	},
	
	initialize: function() {
		console.log("Rendering " + this.model.get('name'));
		this.render();
	},
	
	todoDiv: $('.todo-list'),
	render: function() {
		var t1 = '<div class="todoItemText">{{ name }}</div>';
		var t2 = '<div class="todoItemControls"><div class="todoItemFinish todoIcon"></div><div class="todoItemEdit todoIcon"></div><div class="todoItemRemove todoIcon"></div></div>';
		var template = t1 + t2;
		Mustache.parse(template);
		var rendered = Mustache.render(template, {name: this.model.get('name')});
		
		this.$el.html(rendered);
		this.todoDiv.append(this.$el);
		
		return this;
	},
	
	log : function(event) {
		console.log(this.model.get('name'));
	},
	
	finish: function(event) {
		this.model.set('status', 1);
		console.log('finished' + this.model.get('name'));
		this.moveToFinished();
	},
	
	edit: function(event) {
		const textField = this.$el.children(".todoItemText");
		textField.html('<input class="itemTextEditField"></input>');
	},
	
	saveEdit: function(event) {
		const textField = this.$el.children(".todoItemText");
		this.model.set({'name' : textField.html()});
		textField.html(this.model.get('name'));
	},
	
	delete: function() {
		// Removes the view from the DOM and deletes the view object
		this.remove();
		// Destroys the model (and references on server and localStorage)
		this.model.destroy();
		console.log("Deleted" + this.model.get('name') + "view");
	},
	
	moveToFinished: function() {
		this.$el.hide();
		$(".done-list").append(this.$el);
		this.$el.show();
	}
});



function App() {
}

App.prototype.init = function() {
	this.inputWidget();
};

App.prototype.inputWidget = function() {
	const inputBtn = $('.input_layer_btn');
	const inputField = $('.input_layer_input');
	
	// When app loads, the input field is instantly focused on
	// As a result, the user can start typing in the text without
	// manually focusing the field with a mouse
	inputField.focus();
	
	inputBtn.click(function() {
		var text = $('.input_layer_input').val();
		// Creates a backbone todo item model (so we could work with its data) and view (for UI controlling)
		var itemModel = new Item({name : text});
	});
	
	
	$(document).keypress(function(e) {
		if(e.which == 13) {
			var text = $('.input_layer_input').val();
			// Creates a backbone todo item model (so we could work with its data) and view (for UI controlling)
			var itemModel = new Item({name : text});
		}
	});
};


var app = new App();
app.items = new Items();
app.init();


