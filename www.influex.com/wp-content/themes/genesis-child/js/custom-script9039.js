var bgTimer;

function scrollBg(itemID) {
	//console.log( itemID );
	var elementId = itemID;
	var imageHeight = jQuery( '#' + elementId ).find( 'img' ).height();
	var outerWrapHeight = jQuery( '#' + elementId ).outerHeight();
	var sizeToBeScrolled = - ( imageHeight - outerWrapHeight );
	//console.log( sizeToBeScrolled );
	var scrollSpeed = 10;
	var step = 1,
		current = 0;

	//$( this ).css( 'background-position-y',  sizeToBeScrolled );
	

   bgTimer = setInterval(function(){
		current -= step;
		var currentPx = current + 'px'
		//console.log( elementId + ', ' + currentPx );
		if( current >= sizeToBeScrolled ){
			//console.log( 'Scrolling' );
            jQuery( '#' + elementId ).css( 'background-position-y',  currentPx );
        }
	}, scrollSpeed);
}

function resetScrollBg(itemID) {
	//console.log( 'Scrolling Reset' );
	var elementId = itemID;
	clearInterval(bgTimer);
	jQuery( '#' + elementId ).css( 'background-position-y',  0 );
}


jQuery(function($) {

    // Run script once document is ready
    $(document).ready(function(){

		if ( $( 'body' ).hasClass( 'page-id-12' ) ){

			window.almComplete = function(alm){

					console.log("Ajax Load More Complete!");

					portfolioAutoHeight();
				
			};
						
		}
		
    });

	// Portfolio auto height
	function portfolioAutoHeight(){
		$( '.portfolio-item .portfolio-item-inner' ).each(function(){
			var columnHeight = $( this ).find( '.site-info-column' ).outerHeight();
			var newHeight = columnHeight + 130;
			$( this ).find( '.site-image' ).css({ 
                'height': newHeight + 'px',
                'max-height': newHeight + 'px',
            });
		});
	}
	
});
