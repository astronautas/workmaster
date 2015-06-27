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
			// Manually triggering as the item is saved
			this.trigger('change', this);
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
	editState: 0,
	events : {
		"click" : "log",
		"click .todoItemFinish" : "finish",
		"click .todoItemEdit" : "edit",
		"click .todoItemRemove" : "delete",
	},
	
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	
	todoDiv: document.getElementsByClassName('todo-list')[0],
	render: function() {
		var t1 = '<div class="todoItemText">{{ name }}</div>';
		var t2 = '<div class="todoItemControls"><div class="todoItemFinish todoIcon"></div><div class="todoItemEdit todoIcon"></div><div class="todoItemRemove todoIcon"></div></div>';
		var template = t1 + t2;
		Mustache.parse(template);
		var rendered = Mustache.render(template, {name: this.model.get('name')});
		
		this.el.innerHTML = rendered;
		this.todoDiv.appendChild(this.el);
		
		return this;
	},
	
	addToDom: function() {
		
	},
	
	log : function(event) {
		console.log(this.model.get('name'));
	},
	
	finish: function(event) {
		this.model.set('status', 1);
		this.moveToFinished();
	},
	
	edit: function(event) {
		if (this.editState == 0) {
			
			var name = this.model.get('name');
			
			var el1 = document.createElement("input");
			el1.setAttribute("class", "itemTextEditField");
			el1.value = name;
			
			var el2 = this.el.firstChild;
			
			this.replaceOneElementWithAnother(el1, el2, this.el);
			
			this.$el.children(".todoItemControls").children(".todoItemEdit").css('background-color', 'white');
			this.editState = 1;
		
		/* When finished editing */
		} else {
			
			var el2 = this.el.firstChild;
			
			this.model.set({name: el2.value});
			
			var el1 = document.createElement("div");
			el1.setAttribute("class", "todoItemText");
			el1.innerHTML = this.model.get('name');
			
			
			
			this.replaceOneElementWithAnother(el1, el2, this.el);
			
			this.$el.children(".todoItemControls").children(".todoItemEdit").css('background-color', '');
			this.editState = 0;
			
		}
	},
	closeEdit: function() {
		
		
	},
	
	delete: function() {
		// Destroys the model (and references on server and localStorage)
		this.model.destroy();
	},
	
	moveToFinished: function() {
		this.$el.hide();
		$(".done-list").append(this.$el);
		this.$el.show();
	},
	
	replaceOneElementWithAnother: function(el1, el2, el2Parent) {
		el2Parent.replaceChild(el1, el2);
	},
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


