;(function(){

	$(function(){
		_init();
	});

	var defaults = {};

	var _init = function(){
		this.selectsArray = $('body').find('select');

		var i = 0,
			l = this.selectsArray.length;

		for ( i; i<l; i++ ){
			new StyledSelect(this.selectsArray[i]);
		}

	};


	var StyledSelect = function(selectObj){
		this.createContainer(selectObj);
		this.optionsArray = this.getOptionsArray(selectObj);
		this.optionsList = this.setOptionsList(this.selectContainer, this.optionsArray);
	};

	StyledSelect.prototype = {

		createContainer : function(select){
			this.selectContainer = $('<div class="select-container"></div>');
			$(select).wrap(this.selectContainer);
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

		setOptionsList : function(container, optionsArray){
			var optionsList = $('<ul>').addClass('select-container-options-list').prependTo(container),
				i = 0,
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
		}
	};

})();