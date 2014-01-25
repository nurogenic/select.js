;(function(){

	$(function(){
		_init();
	});

	var defaults = {
		containerClass : 'select-container',
		optionsListClass : 'select-container-options-list',
		activeElClass : 'styled-select-active'
	};



	var _init = function(){
		this.selectsArray = $('body').find('select');

		var i = 0,
			l = this.selectsArray.length;

		for ( i; i<l; i++ ){
			new StyledSelect(this.selectsArray[i], i);
		}
	};

	var globalEvents = (function(){
		$(document).children().on('click', function(e){
			var $this = $(e.target);
			
			if($this.parents().hasClass(defaults.containerClass)){
				e.preventDefault();
			} else {
				$('.'+defaults.optionsListClass+'.active').removeClass('active').hide();
			}
		});

		$(window).bind('select-option-changed', function(e){
			// Do something on select optino changed
		});
	})();

	var StyledSelect = function(selectObj, i){
		this.origSelect = selectObj;
		this.selectID = 'styled-select-'+i;
		this.selectContainer = this.createContainer(selectObj);
		this.optionsArray = this.getOptionsArray(selectObj);
		this.optionsList = this.setOptionsList(this.optionsArray);
		this.activeItem = this.getActiveItem();

		this.events();
	};

	StyledSelect.prototype = {

		events : function(){
			var self = this;
			$(this.activeItem).on('click', function(){

				if(!self.optionsList.hasClass('active')){
					self.optionsList.show();
					self.optionsList.addClass('active');
				} else {
					self.optionsList.hide();
					self.optionsList.removeClass('active');
				}
				
			});

			$(this.optionsList).on('click', 'li', function(){
				var $this = $(this);
				self.optionsList.removeClass('active').hide();
				if($this.attr('value') != self.activeItem.attr('value')){
					$(window).trigger('select-option-changed');	
				}
				self.setActiveItem($this);
				
			});
		},

		createContainer : function(select){
			var selectContainer = $('<div class="'+defaults.containerClass+'" id="'+this.selectID+'"></div>');
			$(select).wrap(selectContainer);
			$(select).hide();

			return selectContainer;
		},

		getOptionsArray : function(select) {
			var thisOptionsArray = [];
			$(select).children('option').each(function(i){
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

		setOptionsList : function(optionsArray){
			var optionsList = $('<ul>')
								.addClass(defaults.optionsListClass)
								.prependTo('#'+this.selectID+'');

			var	i = 0,
				l = optionsArray.length;

			for( i; i<l; i++ ){
				var thisListItem = $('<li>')

				$this = optionsArray[i];
				if($this.id)
					thisListItem.attr('id', $this.id);

				if($this.class)
					thisListItem.addClass($this.class);

				if($this.value)
					thisListItem.attr('value', $this.value);

				if($this.content)
					thisListItem.html($this.content);

				if($this.selected)
					thisListItem.attr('selected', $this.selected);


				thisListItem.appendTo(optionsList);
			}

			return optionsList;
		},

		getActiveItem : function(){
			var i = 0,
				l = this.optionsArray.length;

			var activeElement = $('<span>')
									.addClass(defaults.activeElClass);

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


			activeElement.prependTo('#'+this.selectID+'');

			return activeElement;
		},

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

})();