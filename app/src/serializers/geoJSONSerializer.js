'use strict';

var logger = require('logger');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var geoStoreSerializer = new JSONAPISerializer('geoStore', {
    attributes: ['geojson', 'hash', 'providers', 'areaHa'],
    geojson:{
        attributes:['type', 'features', 'crs']
    },
    providers:{
        attributes: ['provider', 'table', 'user']
    },
    typeForAttribute: function (attribute, record) {
        return attribute;
    },
    keyForAttribute: 'camelCase'
});

class GeoStoreSerializer {

  static serialize(data) {
    return geoStoreSerializer.serialize(data);
  }
}

module.exports = GeoStoreSerializer;
