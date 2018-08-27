
for (var i = 0; i < 10; i++)
{
	//$(".container").append("<div class='box'><div class='grab' draggable='true' ondragstart=\"event.dataTransfer.setData('text/plain', 'This')\"></div>  " + (i+1) + "</div>");
	$(".all-slides").append("<div class='slide'>" + (i + 1) + "</div>");
}

$(".slides").sortable({
	placeholder: 'slide-placeholder',
	axis: "y",
	revert: 150,
	start: function (e, ui)
	{

		//placeholderHeight = ui.item.outerHeight();
		//ui.placeholder.height(placeholderHeight + 15);
		//$('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
		
		$(ui.placeholder).after("<div class='expander'></div>");
		
		$(".expander").height(ui.item.outerHeight()+15);
		
	},
	change: function (event, ui)
	{

		/*ui.placeholder.stop().height(0).animate({
			height: ui.item.outerHeight() + 15
		}, 300);

		placeholderAnimatorHeight = parseInt($(".slide-placeholder-animator").attr("data-height"));

		$(".slide-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
			height: 0
		}, 300, function ()
		{
			$(this).remove();
			placeholderHeight = ui.item.outerHeight();
			$('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
		});*/
		
		var height = ui.item.outerHeight() + 15;
		
		$(".contractor").remove();
		$(".expander").removeClass("expander").addClass("contractor").height(height);
		//$(".slide").nextUntil(".slide, .slide-placeholder").remove();
		//$(".contractor").prevUntil(".slide").find(".contractor").remove();
		//$(ui.placeholder).prevUntil(".slide").remove();
		//$(ui.placeholder).nextUntil(".slide").remove();
		$(".contractor").stop().animate({height: 0 }, 200, "linear", function() { $(this).remove(); } );

		$(ui.placeholder).after("<div class='expander'></div>");
		$(".expander").stop().height(0).animate({ height: height }, 200, "linear", null);
		
	},
	stop: function (e, ui)
	{
		$(".expander, .contractor").remove();
		//$(".slide-placeholder-animator").remove();

	},
});
