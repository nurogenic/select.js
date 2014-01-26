;(function($, w, d, undefined){

	$(function(){
		don.StyledSelectInit('.styleThis');
		don.globalEvents();
	});

	don = {

		defaults : {
			containerClass : 'select-container',
			optionsListClass : 'select-container-options-list',
			activeElClass : 'styled-select-active',
			onChangeCallback : function(e){
				// Do Something on Select Change
			}
		},

		isInitialized : function(obj){
			$this = $(obj);
			if($this.hasClass('initialized'))
				return true;
			else
				return false;
		},

		StyledSelectInit : function(arg){
			this.arg = arg;
			
			if(!arg){
				this.arg = '';
			}

			if( this.arg.substr(0,1) === '.' || this.arg.substr(0,1) === '#'){
				var el = $(arg);
				if(el.length > 1){
					var i = 0,
					l = el.length;
					for ( i; i<l; i++ ){
						var isInit = this.isInitialized(el.eq(i));
						if(!isInit){
							new this.StyledSelect(el.eq(i), this.defaults, i);
						}
					}
				} else {
					new this.StyledSelect(arg, this.defaults, 0);	
				}
			} else{
				this.arg = $('body').find('select');
				var i = 0,
					l = this.arg.length;
				for ( i; i<l; i++ ){
					var isInit = this.isInitialized(this.arg[i]);
					if(!isInit){
						new this.StyledSelect(this.arg[i], this.defaults, i);
					}
				}
			}
		},

		StyledSelectDestroy : function(){
			var $this = this.arg,
				self = this;

			if(typeof $this === 'object'){
				$this.each(function(i){
					self.isInitialized(this);
					$(this).removeClass('initialized').show();
					$(this).unwrap();
				});
			} else {
				this.isInitialized($this);
				$(this.arg).removeClass('initialized').show();
				$(this.arg).unwrap();
			}

			$('.'+self.defaults.activeElClass+'').remove();
			$('.'+self.defaults.optionsListClass+'').remove();
		},

		globalEvents : function(){
			var self = this;
			$(d).children().on('click', function(e){
				var $this = $(e.target);
				
				if($this.parents().hasClass(self.defaults.containerClass)){
					e.preventDefault();
				} else {
					$('.'+self.defaults.optionsListClass+'.active').removeClass('active').hide();
				}
			});

			$(w).bind('select-option-changed', function(e){
				self.defaults.onChangeCallback(e);
			});
		},

		StyledSelect : function(selectObj, options, i){
			this.defaults = options;
			this.origSelect = selectObj;
			this.selectID = this.getStyledSelectID(i);
			this.selectContainer = this.createContainer(self, selectObj);
			this.optionsArray = this.getOptionsArray(self, selectObj);
			this.optionsList = this.setOptionsList(self, this.optionsArray);
			this.activeItem = this.getActiveItem(self);
			this.events(this);
		}
	};

	don.StyledSelect.prototype = {

		events : function(obj){
			var self = obj;
			$(this.activeItem).on('click.activeItem', function(){
				if(!self.optionsList.hasClass('active')){
					$('.'+self.defaults.optionsListClass+'').hide();
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
		},

		createContainer : function(obj, select){
			var selectContainer = $('<div class="'+this.defaults.containerClass+'" id="'+this.selectID+'"></div>');
			$(select).wrap(selectContainer);
			$(select).addClass('initialized').hide();

			return selectContainer;
		},

		getStyledSelectID : function(i){
			$this = $('#styled-select-'+i).length;
			if($this){
				i++;
				this.getStyledSelectID(i);
			}
			return 'styled-select-'+i;
		},

		getOptionsArray : function(obj, select) {
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

		setOptionsList : function(obj, optionsArray){
			var optionsList = $('<ul>')
								.addClass(this.defaults.optionsListClass)
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

		getActiveItem : function(obj){
			var i = 0,
				l = this.optionsArray.length;

			var activeElement = $('<span>')
									.addClass(this.defaults.activeElClass);

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

})(jQuery, window, document);