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
});
