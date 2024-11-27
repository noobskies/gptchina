
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-purchase.CdvPurchase",
          "file": "plugins/cordova-plugin-purchase/www/store.js",
          "pluginId": "cordova-plugin-purchase",
        "clobbers": [
          "store",
          "CdvPurchase"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-purchase": "13.11.1"
    };
    // BOTTOM OF METADATA
    });
    