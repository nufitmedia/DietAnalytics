angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})



.controller('ArticlesCtrl', function($scope, Articles) {
	var pageSize = 10;
   	$scope.articles = [];
  	$scope.loadMore = function() {
    	var data = [];
    	var l = $scope.articles.length;
    	$.each(Articles.all() , function(i, article) {
    		if(i==0 && i==l){
	    		data.push({ title: article.name, id: article.id, img: article.image_url, author: 'Adam Wilner' });
	    	}else if(i >= l && i < l+pageSize){
				data.push({ title: article.name, id: article.id, img: article.image_url });
			}
   		});

    	$scope.articles = $scope.articles.concat(data);
    	$scope.$broadcast('scroll.infiniteScrollComplete');
  	};

  	$scope.$on('stateChangeSuccess', function() {
    	$scope.loadMore();
  	});
  	
  	$scope.doRefresh = function() {
  		$scope.articles = [];
	    $.each(Articles.all() , function(i, article) {
	    	if(i==0){
	    		$scope.articles.push({ title: article.name, id: article.id, img: article.image_url, author: 'Adam Wilner' });
	    	}else if(i < pageSize){
				$scope.articles.push({ title: article.name, id: article.id, img: article.image_url });
			}
   		});
	    $scope.$broadcast('scroll.refreshComplete');
	    $scope.$apply();
	};
})

.controller('ArticleCtrl', function($scope, $stateParams, Articles) {
	$scope.article = Articles.get($stateParams.id);
	$scope.myHTML = $scope.article.body;
	
	var message = $scope.article.meta_description;
	var subject = $scope.article.name;
	var link = "http://dietanalytics"+$scope.article.seo_url;
	var image = "http://static.dietanalytics.com"+$scope.article.image_url;
	
	$scope.onShare = function() {
	    window.plugins.socialsharing.share(message, subject, image, link);
	};
	$scope.twitterShare = function() {
		window.plugins.socialsharing.shareViaTwitter(subject+': '+message, image, link);
	};
	$scope.facebookShare = function() {
		window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(subject+': '+message, image, link, subject+' has been copied to your clipboard. Paste to post!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)});
	};
	$scope.bookmarkArticle = function(){
		var bookmarks = JSON.parse(window.localStorage['bookmarks'] || '[]');
		bookmarks.push($scope.article.id);
		window.localStorage['bookmarks'] = JSON.stringify(bookmarks);
	};
	
	
	$scope.unbookmarkArticle = function(){
		var bookmarks = JSON.parse(window.localStorage['bookmarks']);
    	bookmarks.splice(bookmarks.indexOf($scope.article.id), 1);
		window.localStorage['bookmarks'] = JSON.stringify(bookmarks);
	};
	
	$scope.isBookmarked = function(){
		var bookmarks = JSON.parse(window.localStorage['bookmarks'] || '[]');
		if(bookmarks.indexOf($scope.article.id) > -1){
			return true;
		}else{
			return false;
		}
	};
})

.controller('BookmarkCtrl', function($scope, Articles) {
  
  	$scope.data = {
    	showDelete: false
  	};
  
  	$scope.onItemDelete = function(bookmark) {
  		var bookmarks = JSON.parse(window.localStorage['bookmarks']);
  		console.log(bookmark);
  		console.log(bookmarks);
  		console.log(bookmarks.indexOf(bookmark.toString()));
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
		$scope.bookmarks.push(Articles.get(bookmark));
	});
    
});












