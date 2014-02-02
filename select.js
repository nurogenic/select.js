;(function($, w, d, undefined){

	// Namespacing
	w.don = w.don || {};

	/*
	*	StyledSelect will take a jQuery select object and wrap it
	*	to give it custom functionality.
	*
	*	@param {obj, obj} - jQuery Select ELement Object, Options Object
	*	@return {obj} -  Instance of StyledSelect
	*/
	don.StyledSelect = function(el, opt){

		var defaults = {
			containerClass : 'select-container', 				// Class to be added to wrapper container that wraps the old select element as well as the new active element and list options
			optionsListClass : 'select-container-options-list', // Class to be added to the ul that wrapps the options
			activeElClass : 'styled-select-active', 			// Class to be added to the active element (Option that is currently selected)
			onChangeCallback : function(e){ 					// Function will fire anytime an option is changed
				// Do something on value change.
			}
		}

		var options = $.extend(defaults, opt);


		if( el instanceof HTMLElement || el instanceof jQuery ){
			console.log(el);
			return this.init(el, options);
		}
	};


	//Writing all methods on the StyledSelect prototype to improve memory performance
	don.StyledSelect.prototype = {

		/*
		*	Initialize the object with the specified options.
		*	@param {obj, obj} - jQuery Select ELement Object, Options Object
		*	@return {obj} -  Instance of StyledSelect
		*/
		init : function(selectObj, options){

			// Cache this objects attributes
			this.options 			= options;
			this.origSelect 		= selectObj;
			this.selectContainer 	= this.createContainer();
			this.optionsArray 		= this.getOptionsArray();
			this.optionsList 		= this.setOptionsList();
			this.activeItem 		= this.getActiveItem();

			this.events(this);

			return this;
		},

		// Unwrap the original select from the custom container and remove all
		// options associated with this object.
		destroy : function(){
			var $el = $(this.origSelect);

			$el.insertBefore(this.selectContainer).removeClass('initialized').show();
			this.selectContainer.remove();

			delete this.options,
			delete this.origSelect,
			delete this.selectContainer,
			delete this. optionsArray,
			delete this.optionsList,
			delete this.activeItem;
		},

		// Adding behavioral events to each object
		events : function(){
			var self = this;


			// When the Custom Select is clicked it will check to see if this is active
			// or not and will hide or show based on the result.
			$(this.activeItem).on('click.activeItem', function(){

				if(!self.optionsList.hasClass('active')){

					$('.'+self.options.optionsListClass+'').hide();
					self.optionsList.show();
					self.optionsList.addClass('active');

				} else {

					self.optionsList.hide();
					self.optionsList.removeClass('active');

				}
			});

			// When an option is clicked this will hide the list and update the
			//ActiveElement. If the value of the previous active element differs from
			//the new value then a custom event will trigger.
			$(this.optionsList).on('click.optionsList', 'li', function(e){

				var $this = $(this);
				self.optionsList.removeClass('active').hide();

				if($this.attr('value') != self.activeItem.attr('value')){
					self.options.onChangeCallback(e);
				}

				self.setActiveItem($this);
			});

			// If there is a click on the document that is outside of the CustomSelect
			// element then the custom select options will close to simulate the default
			// browser select.
			$(d).children().on('click', function(e){
				var $this = $(e.target);
				if($this.parents().hasClass(self.options.containerClass)){
					e.preventDefault();
				} else {
					$('.'+self.options.optionsListClass+'.active').removeClass('active').hide();
				}
			});
		},

		/*
		*	Creates/Inserts the new wrapping container and wraps the original select element in it.
		*
		*	@return {SelectContainer obj}
		*/
		createContainer : function(){
			var selectContainer = $('<div class="'+this.options.containerClass+'"></div>');

			var el = $(this.origSelect).addClass('initialized').hide();

			selectContainer.insertBefore(el);

			selectContainer.append(el);

			return selectContainer;
		},

		/*
		*	Gathers all the information on the options list from the original select object and stores
		* 	it in an array. This will store options infromation like: id, class, value, & if is selected
		*	
		*	@return {Options Array}
		*/
		getOptionsArray : function() {
			var thisOptionsArray = [];
			$(this.origSelect).children('option').each(function(i){
				var thisOption = {};
				$this = $(this)
				
				if($this.attr('id'))
					thisOption.id = $this.attr('id');

				if($this.attr('class'))
					thisOption.class = $this.attr('class');

				if($this.attr('value'))
					thisOption.value = $this.attr('value');

				if($this.html())
					thisOption.content = $this.html();

				if($this.attr('selected'))
					thisOption.selected = $this.attr('selected');

				thisOptionsArray.push(thisOption);
			});
			return thisOptionsArray;
		},

		/*
		*	Create <ul> and add options from original select to it as <li>. Id, Class, Value, & Selected
		*	attributes will be added to the <li> as it were on the option.
		*
		*	@return {options list with list items}
		*/
		setOptionsList : function(){
			var optionsList = $('<ul>').addClass(this.options.optionsListClass);

			var	i = 0,
				l = this.optionsArray.length;

			for( i; i<l; i++ ){
				var thisListItem = $('<li>');

				var li = this.optionsArray[i];
				if(li.id)
					thisListItem.attr('id', li.id);

				if(li.class)
					thisListItem.addClass(li.class);

				if(li.value)
					thisListItem.attr('value', li.value);

				if(li.content)
					thisListItem.html(li.content);

				if(li.selected)
					thisListItem.attr('selected', li.selected);

				optionsList.append(thisListItem);
			}

			this.selectContainer.prepend(optionsList);

			return optionsList;
		},

		/*
		*	Creates a <span> withe the activeElClass provided in options checks to see which option is
		*	selected and adds that to the span as the current selected option. If no option is selected
		*	will use the first option in the array.
		*
		*	@return {active el}
		*/
		getActiveItem : function(){
			var i = 0,
				l = this.optionsArray.length;

			var activeElement = $('<span>')
									.addClass(this.options.activeElClass);

			var hasSelected = false;

			for(i; i<l; i++){
				if(this.optionsArray[i].selected){

					hasSelected = true;

					activeElement.html(this.optionsArray[i].content);

					if(this.optionsArray[i].value)
						activeElement.attr('value', this.optionsArray[i].value);

					if(this.optionsArray[i].id)
						activeElement.attr('id', this.optionsArray[i].id);

					if(this.optionsArray[i].class)
						activeElement.addClass(this.optionsArray[i].class);
				}
			}


			if(!hasSelected)
				activeElement.html(this.optionsArray[0].content);


			activeElement.prependTo(this.selectContainer);

			return activeElement;
		},

		/*
		*	Used in this.events() to add the clicked list item as the selected option and active element
		*/
		setActiveItem : function(el){

			var content = el.html();
			var value = el.attr('value');

			this.activeItem.html(content).attr('value', value);

			$(this.origSelect).children('option').each(function(){
				var $this = $(this);
				$this.removeAttr('selected');
				if($this.attr('value') === value ){
					$this.attr('selected', 'selected');
				}
			});
		}
	};

})(jQuery, window, document);