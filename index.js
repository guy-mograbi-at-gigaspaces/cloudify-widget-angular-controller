'use strict';

angular.module('cloudifyWidgetAngularController',[]);

/**
 *
 *  A controller that handles postMessage and recieveMessage for you.
 *
 *  it communicates with your controller by watching a property on the scope called 'genericWidgetModel'
 *  that has the following structure
 *
 *
 * dependencies:
 *  - JQuery  - We assume there is jquery in the project.
 *
 *
 */
angular.module('cloudifyWidgetAngularController')
    .controller('GsGenericWidgetCtrl', function ($scope, $log) {

        $scope.genericWidgetModel = {
            loaded : false,
            element : null, // the dom element to post message to
            widgetStatus : {},
            advancedData : {},
            leadDetails : {},
            recipeProperties : []
        }; // initialized;


        function _postMessage ( name, data ){
            if ( !$scope.genericWidgetModel.element ){
                $log.error('element not defined on $scope.genericWidgetModel. Do not know who to post data to');
            }
            try {
                $($scope.genericWidgetModel.element)[0].contentWindow.postMessage({ 'name': name, 'data': data }, '*');
            }catch(e){}
        }

        $scope.playWidget = function(){
            _postMessage('widget_play');
        };

        $scope.stopWidget = function(){
            _postMessage('widget_stop');
        };

        $scope.$watch('genericWidgetModel.recipeProperties', function(){
            _postMessage( 'widget_recipe_properties' , $scope.genericWidgetModel.recipeProperties );
        }, true);

        $scope.$watch( function() { return $scope.genericWidgetModel.advancedData; }, function(){
            $log.info('posting advancedData');
            _postMessage( 'widget_advanced_data', $scope.genericWidgetModel.advancedData );
        }, true);


        $scope.$watch('leadDetails', function(){
            _postMessage( 'widget_lead_details' , $scope.genericWidgetModel.leadDetails );
        },true);

        function receiveMessage( e ){
            $log.info('ibmpage got a message ', e.data );
            var messageData = angular.fromJson(e.data);

            if ( messageData.name === 'widget_loaded'){
                $scope.genericWidgetModel.loaded = true;
            }

            $scope.$apply();
        }

        window.addEventListener('message', receiveMessage, false);
    });
