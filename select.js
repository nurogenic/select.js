;(function($, w, d, undefined){

	$(function(){

		w.selectArr = [];

		$('.dontStyleThis').each(function(index, el){
			selectArr.push( new don.StyledSelect(el) );
		});
		
	});

	w.don = w.don || {};

	don.StyledSelect = function(el, opt){

		var defaults = {
			containerClass : 'select-container',
			optionsListClass : 'select-container-options-list',
			activeElClass : 'styled-select-active',
			onChangeCallback : function(e){
				// Do Something on Select Change
			}
		}

		var options = $.extend(defaults, opt);

		if( el instanceof HTMLElement ){
			this.init(el, options);
		}
	};

	don.StyledSelect.prototype = {

		init : function(selectObj, options){
			this.options 			= options;
			this.origSelect 		= selectObj;
			this.selectContainer 	= this.createContainer(self, selectObj);
			this.optionsArray 		= this.getOptionsArray(self, selectObj);
			this.optionsList 		= this.setOptionsList(self, this.optionsArray);
			this.activeItem 		= this.getActiveItem(self);
			this.events(this);
			return this;
		},

		destroy : function(){
			var $el = $(this.origSelect) || '';

			$el.insertBefore(this.selectContainer).removeClass('initialized').show();
			this.selectContainer.remove();
		},

		events : function(){
			var self = this;

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

			$(this.optionsList).on('click.optionsList', 'li', function(){

				var $this = $(this);
				self.optionsList.removeClass('active').hide();

				if($this.attr('value') != self.activeItem.attr('value')){

					$(window).trigger('select-option-changed');

				}

				self.setActiveItem($this);

			});

			$(d).children().on('click', function(e){
				var $this = $(e.target);
				if($this.parents().hasClass(self.options.containerClass)){
					e.preventDefault();
				} else {
					$('.'+self.options.optionsListClass+'.active').removeClass('active').hide();
				}
			});

			$(w).bind('select-option-changed', function(e){
				self.options.onChangeCallback(e);
			});	
		},

		isInitialized : function(obj){
			$this = $(obj);
			if($this.hasClass('initialized'))
				return true;
			else
				return false;
		},

		createContainer : function(){
			var selectContainer = $('<div class="'+this.options.containerClass+'"></div>');

			var el = $(this.origSelect).addClass('initialized').hide();

			selectContainer.insertBefore(el);

			selectContainer.append(el);

			return selectContainer;
		},

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

		setOptionsList : function(){
			var optionsList = $('<ul>').addClass(this.options.optionsListClass);

			var	i = 0,
				l = this.optionsArray.length;

			for( i; i<l; i++ ){
				var thisListItem = $('<li>');

				var li = optionsArray[i];
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

			console.log(this.selectContainer);

			return optionsList;
		},

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