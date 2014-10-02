to install run

bower install cloudify-widget-angular-controller --save

make sure you include the JS file in your index.html

<script src="bower_components/cloudify-widget-angular-controller/index.js"></script>

then add the module in your angular app dependencies

angular.module('my module name', [ 'cloudifyWidgetAngularController' ] );


then use it from within a controller


angular('my module name').controller('MyCtrl', function( $scope, $controller ) {
   $controller('GsGenericWidgetCtrl', {$scope:$scope} );
   $scope.genericWidgetModel.element = $('iframe')[0];

} )


this will put a property and some functions for you on the scope and will handle all post message and receive message to and from the widget's iframe.


* the property `genericWidgetModel`

$scope.genericWidgetModel = {
            loaded : false,
            element : null, // the dom element to post message to
            widgetStatus : {},
            advancedData : {},
            leadDetails : {},
            recipeProperties : []
        }; // initialized;


where `loaded` will change once the iframe is loaded to true

`element` is a field you fill with a pointer to the DOM element

`widgetStatus` will be filled once the widget runs

`advancedData` has one of the following structures

{ 'type' : 'aws_ec2' , 'params' : { 'key' : null, 'secretKey' : null } };
{ 'type' : 'softlayer' , 'params' : { 'username' : null, 'apiKey' : null } };

depends on your cloud of choice

`leadDetails` can contain whatever you want.

`recipeProperties` has the following structure

[ { 'key' : 'my key' , 'value' : 'my value' } , { 'key' : 'another key' , 'value' : 'another value' } , ... ]


* the method `playWidget`

this method will invoke a play on the widget

* the method `stopWidget`

this method will invoke stop on the widget