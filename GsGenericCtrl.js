/**
 * Created by sefi on 11/12/14.
 */

'use strict';

try {
    angular.module('cloudifyWidgetAngularController');
} catch (e) {
    angular.module('cloudifyWidgetAngularController', []);
}

/**
 *
 *  A controller that handles postMessage and recieveMessage for you.
 *
 *  it communicates with your controller by watching a property on the scope called 'genericWidgetModel'
 *  that has the following structure
 *
 *   {
 *       loaded: false until the widget has loaded,
 *       element: the dom element to post message to
 *       widgetStatus: the widget status object,
 *       recipeProperties: recipe properties object
 *   }
 *
 *   This is a compatible only with the new widget. For the old widget, please see index.js
 *
 */
angular.module('cloudifyWidgetAngularController')
    .controller('GsGenericCtrl', function ($scope, $log, $window) {
        $scope.genericWidgetModel = {
            loaded: false,
            element: null, // the dom element to post message to
            widgetStatus: {},
            recipeProperties: {},
            advancedData: {}
        }; // initialized;

        var propertiesToArray = function (propertiesObject) {
            var propertiesArray = [];

            Object.keys(propertiesObject).forEach(function (key) {
                propertiesArray.push({'key': key, 'value': propertiesObject[key]});
            });

            return propertiesArray;
        };

        var postRecipeProperties = function () {
            $log.info('posting recipe properties');
            postMessage({name: 'widget_recipe_properties', data: propertiesToArray($scope.genericWidgetModel.recipeProperties)});
        };
        $scope.$watch(function () {
            return $scope.genericWidgetModel.recipeProperties;
        }, postRecipeProperties, true);

        $scope.playWidget = function () {
            postMessage({name: 'widget_play', widget: $scope.widget});
        };

        $scope.stopWidget = function () {
            postMessage({name: 'widget_stop', widget: $scope.widget, executionId: $scope.executionId});
        };

        function postMessage(data) {
            var element = $scope.genericWidgetModel.element;

            if (typeof(element) === 'function') {
                element = element();
            }

            if (!element) {
                $log.error('element not defined on GsMessagesHubService postMessage. Do not know who to post data to');
            }

            try {
                element.contentWindow.postMessage(data, '*');
            } catch (e) {
            }
        }

        function receiveMessage(e) {
            var messageData = angular.fromJson(e.data);
            $log.info(['cloudify widget GsMessagesHubService got a message ', messageData]);

            if (!messageData) {
                $log.error('unable to handle received message, no data was found');
                return;
            }

            if (messageData.name === 'widget_loaded') {
                $scope.genericWidgetModel.loaded = true;
                postRecipeProperties();
            }

            if (messageData.name === 'widget_status') {
                if (messageData.data.hasOwnProperty('status')) {
                    $scope.genericWidgetModel.widgetStatus = messageData.data.status;
                } else {
                    $scope.genericWidgetModel.widgetStatus = messageData.data;
                }

            }

            $scope.$apply();
        }

        $window.addEventListener('message', receiveMessage, false);

        $log.info('generic controller loaded');
    });
