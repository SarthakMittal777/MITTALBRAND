function getYouTubeID(url) {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);

	return (match && match[2].length === 11) ?
		match[2] :
		null;
}

function parseVideo(url) {
    // - Supported YouTube URL formats:
    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
    //   - http://youtu.be/My2FRPA3Gf8
    //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
    // - Supported Vimeo URL formats:
    //   - http://vimeo.com/25451551
    //   - http://player.vimeo.com/video/25451551
    // - Also supports relative URLs:
    //   - //player.vimeo.com/video/25451551

    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
        var type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        var type = 'vimeo';
    }

    return {
        type: type,
        id: RegExp.$6
    };
}

// 2. This code loads the IFrame Player API code asynchronously.
if ( typeof loadScript === 'function' ) {
	loadScript( 'https://www.youtube.com/iframe_api', () => {} );
	loadScript( 'https://player.vimeo.com/api/player.js', () => {} );
} else {
	// YouTube
	var yt = document.createElement('script');
	yt.src = "https://www.youtube.com/iframe_api";
	var ytScriptTag = document.getElementsByTagName('script')[0];
	ytScriptTag.parentNode.insertBefore(yt, ytScriptTag);

	// Vimeo
	var vm = document.createElement('script');
	vm.src = "https://player.vimeo.com/api/player.js";
	var vmScriptTag = document.getElementsByTagName('script')[0];
	vmScriptTag.parentNode.insertBefore(vm, vmScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var api_ready = false;
function onYouTubeIframeAPIReady() {
	api_ready = true;
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {

}

function stopVideo() {
	player.stopVideo();
}

jQuery(document).ready(function () {

	function showPopup( obj ) {

		var player_id = obj.find('> .video-player > div').attr('id');

		jQuery.magnificPopup.open({
			mainClass: 'mfp-fade',
			items: {
				src: obj, // can be a HTML string, jQuery object, or CSS selector
				type: 'inline'
			},
			callbacks: {
				open: function() {
					preparePlayer( player_id );
				},
				beforeClose: function() {
					// Remove YouTube player
					var src = jQuery( '#' + player_id ).attr('data-src');
					jQuery( '#' + player_id ).parent().html( '<div data-src="' + src + '" id="' + player_id + '"></div>' );
				},
				close: function() {
					
				}
			}
		});

	}

	function preparePlayer( player_id ) {
		
		if ( ! api_ready ) {
			return false;
		}

		var player_box = document.getElementById( player_id );
		if ( player_box ) {

			var src = player_box.getAttribute('data-src');
			var video = parseVideo( src );
			
			if ( video.type && video.id ) { 
				if ( video.type == 'vimeo' ) {					
					jQuery( '#' + player_id ).parent().html( '<iframe id="' + player_id + '" src="https://player.vimeo.com/video/' + video.id + '?muted=1" data-src="' + src + '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' );
					setTimeout(() => {
						var iframe = document.querySelector( '#' + player_id );
						player = new Vimeo.Player( iframe );
						player.play();
					}, 250);
				} else {
					player = new YT.Player( player_id, {
						height: '824',
						width: '1920',
						videoId: video.id,
						playerVars: {
							'rel' : 0,
							'showinfo' : 0,
							'modestbranding' : 1,
							'origin': window.location.href,
							'enablejsapi': 1,
						},
						events: {
							'onReady': onPlayerReady,
							'onStateChange': onPlayerStateChange
						}
					});
				}
			}
		}

	}

	function prepareVideos() {
		jQuery('.influex-popup-video').each( function() {
		
			box = jQuery(this).find('.video-player-box > .video-player > div');
	
			var id = Math.random().toString(36).slice(2);	// Generate random alpha numeric string
			box.attr('id', 'video_player_' + id );
	
		});
	}
	prepareVideos();

	// Trigger this event if the videos are in a Slick JS slider or loaded by AJAX
	jQuery('body').on( 'influex_video_popup_init', function() {
		prepareVideos();
	});

	jQuery('body').on( 'click', '.influex-popup-video > a', function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		showPopup( jQuery(this).next('.video-player-box') );
	});

});