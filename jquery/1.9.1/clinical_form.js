/* the hierarchy inside the form container is :
form_container
{
	form_control
	form_list_container
	{
		diagnosis_form_0
		{
			legend
			category_list
			{
				select_category_0
					select	
					{
						options_0
						options_1
						...
					}
				select_category_1
				...
			}
		}
		diagnosis_form_1
		{}
		...
	}
}			
*/

var form_list_container = 'clinical_form_list';

// $.fn is short hand of jquery prototype function 
$.fn.initialize_diagnosis_form = function()
{
	// initialize form controls and 
	$(this).append('<div id="form_controls"></div>');
	$(this).attr('form_list_id',form_list_container);
	$(this).append($('<div/>',{
		id: form_list_container		
	}));
	$('#form_controls').append('Add one more Diagnosis');
	jQuery('<button/>', {
		type: 'button',
		text: '+'
	}).click(function (){ 
		$('#'+form_list_container).add_one_diagnosis_form();
		})
	.appendTo('#form_controls');
	$('#form_controls').append(' Remove one Diagnosis');
	jQuery('<button/>', {
		type: 'button',
		text: '-'
	}).click(function (){
		$('#'+form_list_container).remove_one_diagnosis_form();
	})
	.appendTo('#form_controls');
	$('#'+form_list_container).add_one_diagnosis_form();
}
$.fn.number_of_diagnosis_forms = function(){
	return $('#'+$(this).attr('form_list_id')).children().length;
}
function getchildrenfromdata(data,id)
{
	var children = data[id].children;
	var items = {};
	// children is an object, have to loop through it's properties	
	for (var k in children)
	{
		// and items is also an object, this is the way to define a property of object.
		items[k] = {
				id: children[k],
				text: data[children[k]].text
				};
	}
	return items;
}
$.fn.remove_next_siblings = function()
{
	// remove from the last of children list up to the current one
	while(! $(this).is(':last-child'))
	{
		$(this).parent().children().last().remove();
	}
}

$.fn.append_one_select_category = function (id)
{
	var items = getchildrenfromdata(name_data,id);
	// add one category only when items is not empty
	if ( ! $.isEmptyObject(items))
	{
		// with a dollar sign, the variable is a DOM element.
		var $level = $('<div/>');
		$(this).append($level);
		$level.append('<div>Category Level '+($level.index()+1)+'</div>');
		$level.attr('form_index', $(this).attr('form_index'));
		var full_name_id = 'diagnosis_form_'+$(this).attr('form_index')+'_category_level_'+$level.index()+'_full_name';
		// the field saves the full name of selected item, to be submitted and parsed by php laravel
		// http://laravel.io/forum/02-28-2014-subbmiting-form-with-array-of-text-fields
		// http://stackoverflow.com/questions/1978664/is-it-possible-to-have-double-nested-input-tag-arrays-in-html
		// don't put quotation marks to the field names use [a] instead of ['a'] or ["a"], otherwise the quotation marks will become part of the name!!!
		$level.append($('<input/>',{
				name: "diagnosis_form["+$(this).attr('form_index')+"][category][level_"+$level.index()+"]",
				id: full_name_id,
				type: 'hidden',
				value: get_full_name_value_string('0')
			}));
		var $select = $('<select/>', {
//				name: 'diagnosis_form_'+$(this).attr('form_index')+'_category_level_'+$level.index(),
				full_name_value_id: full_name_id
		});
		$level.append($select);
		for (var k in items)
		{
			$select.append('<option value = "'+items[k].id+'">'+items[k].id+': '+items[k].text+'</options>');
		}
		$select.change(function () {
			// update the full value field
			var full_value_id = $(this).attr('full_name_value_id');
			$('#'+full_value_id).val(get_full_name_value_string(this.value));
			// remove next siblings
			$(this).parent().remove_next_siblings();
			$(this).parent().parent().append_one_select_category(this.value);
		});
	}
}
function get_full_name_value_string(id)
{
	return id+': '+name_data[id].text ;	
}


$.fn.create_category_list = function()
{
	// at beginning: only one category in the list
	var $acategory = $('<div/>');
	$(this).append($acategory);
	// propagate the form_index attribute to its children
	$acategory.attr('form_index', $(this).attr('form_index'));
	$acategory.append_one_select_category('root');
}
$.fn.add_one_diagnosis_form = function() {
	var $aform = $('<div/>');
	// have to append child first, then create its content, thus the child has an index 
	$(this).append($aform);
	$aform.append('<legend>Diagnosis '+($aform.index()+1)+'</legend>');
	$aform.attr('form_index', $aform.index());
	$aform.create_category_list();
	// add probability selection
	$probability_div = $('<div/>');
	$probability_div.append($('<div>Probability</div>'));
	$probability_select = $('<select/>',{
		// don't put quotation marks to the field names use [a] instead of ['a'] or ["a"], otherwise the quotation marks will become part of the name!!!
		name: "diagnosis_form["+$aform.index()+"][probability]",
	});
	$probability_select.append($('<option/>',{
		value: 'Definitely',
		text: 'Definitely'
	}));
	$probability_select.append($('<option/>',{
		value: 'Probably',
		text: 'Probably'
	}));
	$probability_select.append($('<option/>',{
		value: 'Possibly',
		text: 'Possibly'
	}));
	$probability_div.append($probability_select);
	$aform.append($probability_div);
}
$.fn.remove_one_diagnosis_form = function() {
	$(this).children().last().remove();
}
