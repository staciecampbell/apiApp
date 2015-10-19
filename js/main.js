var lyricApp = {};//empty object

lyricApp.apiKey = '0e4492dcaccd6345a4894dbd3e7cc91d'; //my api key stored in object


lyricApp.getAlbum = function(){
	$.ajax({
		url: 'http://api.musixmatch.com/ws/1.1/artist.albums.get',
		dataType: 'jsonp',
		method: 'GET',
		data: {
			artist_id: '58262',
			apikey: lyricApp.apiKey,
			format: 'jsonp',
			page_size: 100
		}
	}).then(function(res){
	 	lyricApp.results = res.message.body.album_list;	
	 	lyricApp.sortedResults = _.uniq(res.message.body.album_list, function(item) {
	 		return item.album.album_name;
	 	});
	 	lyricApp.displayAlbums(lyricApp.sortedResults);
	});

};

lyricApp.displayAlbums = function(albums){
	$.each(albums, function(indexNumber, value){
		if (value.album.album_release_type === 'Album'){
			var title = $('<option>').val(value.album.album_id).text(value.album.album_name);
			$('#albumSelect').append(title);
		}
	});
};


lyricApp.getTracks = function(albumId){
	$.ajax({
		url: 'http://api.musixmatch.com/ws/1.1/album.tracks.get',
		dataType: 'jsonp',
		method: 'GET',
		data: {
			album_id: albumId,
			apikey: lyricApp.apiKey,
			format: 'jsonp',
			page_size: 100
		}

	}).then(function(res){
		lyricApp.trackResults = res.message.body.track_list;
		var randomSong = _.sample(lyricApp.trackResults);
		lyricApp.getSnippet(randomSong.track.track_id);

	});
};

lyricApp.getSnippet = function(trackId){
		$.ajax({
		url: 'http://api.musixmatch.com/ws/1.1/track.snippet.get',
		dataType: 'jsonp',
		method: 'GET',
		data: {
			track_id: trackId,
			apikey: lyricApp.apiKey,
			format: 'jsonp',
			page_size: 100
		}
	}).then(function(res){
		console.log(res);
		lyricApp.snippetResult = res.message.body.snippet.snippet_body;
		var snippet = lyricApp.snippetResult;
		console.log(snippet);
		if (snippet.length < 1) {
			$('.yourSnippet').html('Sorry, no snippet available :(!')
		} else {
			$('.yourSnippet').html(snippet);
			
		}

	});
};
	$('.main, footer').hide();
	$('a').on('click', function(){
		$('.main, footer').show();
	});

	$('.getLyrics').hide();
	$('select').on('click', function(){
		$('.getLyrics').show();
	});

	$('.snippet').hide();
	$('.getLyrics').on('click', function(){
		$('.snippet').show();
	});

$('a[href*=#]:not([href=#])').click(function() {
		    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		      var target = $(this.hash);
		      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		      if (target.length) {
		        $('html,body').animate({
		          scrollTop: target.offset().top+100
		        }, 1000);
		        return false;
		      }
		    }
	    });


lyricApp.init = function(){
	lyricApp.getAlbum();
	$('#getLyrics').on('click', function(e){
		e.preventDefault();
		var albumId = $('#albumSelect').val();
		lyricApp.getTracks(albumId);
	});
};


$(function(){ //docready
	lyricApp.init();//initializing
});






