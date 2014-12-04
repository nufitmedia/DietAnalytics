angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http) {
  // Form data for the login modal
  $scope.searchData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSearch = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.search = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doSearch = function() {
  	if($scope.searchData.query != ''){
  		$http.get('http://api.nufitmedia.com/articles/searchName/22/word/'+$scope.searchData.query+'/format/json/start/0/limit/10').then(function(results) {
			$scope.results = results.data;
		});
  	}
  };
})

.controller('ArticlesCtrl', function($scope, $http) {
	var pageSize = 10;
   	$scope.articles = [];
  	$scope.loadMore = function() {
    	var l = $scope.articles.length;
    	$http.get('http://api.nufitmedia.com/articles/get_last_content/13/start/'+l+'/limit/'+pageSize+'/format/json').then(function(articles) {
    		$scope.articles = $scope.articles.concat(articles.data);
    		$scope.$broadcast('scroll.infiniteScrollComplete');
    	});
  	};

  	$scope.$on('stateChangeSuccess', function() {
    	$scope.loadMore();
  	});
  	
  	$scope.doRefresh = function() {
  		$scope.articles = [];
  		$http.get('http://api.nufitmedia.com/articles/get_last_content/13/start/0/limit/'+pageSize+'/format/json').then(function(articles) {
    		$scope.articles = articles.data;
    		$scope.$broadcast('scroll.refreshComplete');
	    	$scope.$apply();
    	});
	};
})

.controller('ArticleCtrl', function($scope, $stateParams, $http, $sce, $ionicModal) {
	$http.get('http://api.nufitmedia.com/articles/articleId/'+$stateParams.id).then(function(article) {
		$scope.article = article.data[0];
		$scope.body = $scope.article.body;
		$scope.isBookmarked = JSON.parse(window.localStorage['bookmarks']).indexOf($scope.article.id) > -1;
		$scope.iframe_url = $sce.trustAsResourceUrl('http://dietanalytics.com/comments.php?seo_url='+$scope.article.seo_url);
		
		$message = $scope.article.meta_description;
		$subject = $scope.article.name;
		$link = "http://dietanalytics"+$scope.article.seo_url;
		$image = "http://static.dietanalytics.com"+$scope.article.image_url;
	});
	
	$scope.onShare = function() {
    	window.plugins.socialsharing.share($scope.article.meta_description, 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl');
    	//window.plugins.socialsharing.share($message, $subject, $image, $link);
	};
	
	$scope.twitterShare = function() {
		window.plugins.socialsharing.shareViaTwitter($subject+': '+$message, $image, $link);
	};
	
	$scope.facebookShare = function() {
		window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint($subject+': '+$message, $image, $link, $subject+' has been copied to your clipboard. Paste to post!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
	};
	
	$scope.bookmarkArticle = function(){
		var bookmarks = JSON.parse(window.localStorage['bookmarks'] || '[]');
		bookmarks.push($scope.article.id);
		window.localStorage['bookmarks'] = JSON.stringify(bookmarks);
		$scope.isBookmarked = true;
	};
	
	$scope.unbookmarkArticle = function(){
		var bookmarks = JSON.parse(window.localStorage['bookmarks']);
    	bookmarks.splice(bookmarks.indexOf($scope.article.id), 1);
		window.localStorage['bookmarks'] = JSON.stringify(bookmarks);
		$scope.isBookmarked = false;
	};
	
	$ionicModal.fromTemplateUrl('templates/comments.html', {
	    scope: $scope
	}).then(function(modal) {
	    $scope.comments = modal;
	});
	
	// Triggered in the login modal to close it
	$scope.closeComments = function() {
	    $scope.comments.hide();
	};
	
	// Open the login modal
	$scope.showComments = function() {
	    $scope.comments.show();
	};
})

.controller('BookmarkCtrl', function($scope, $http) {
  
  	$scope.data = {
    	showDelete: false
  	};
  
  	$scope.onItemDelete = function(bookmark) {
  		var bookmarks = JSON.parse(window.localStorage['bookmarks']);
    	bookmarks.splice(bookmarks.indexOf(bookmark.toString()), 1);
		window.localStorage['bookmarks'] = JSON.stringify(bookmarks);
		$scope.bookmarks = [];
	  	$.each(bookmarks, function(i, bookmark) {
			$scope.bookmarks.push(Articles.get(bookmark));
		});
  	};
  
  	var bookmarks = JSON.parse(window.localStorage['bookmarks'] || '[]');
  	$scope.bookmarks = [];
  	$.each(bookmarks, function(i, bookmark) {
  		$http.get('http://api.nufitmedia.com/articles/articleId/'+bookmark).then(function(article) {
  			$scope.bookmarks.push(article.data[0]);
  		});
	});
    
});












