(function ($) {
    'use strict';

    $.DeviceDetect = function (options) {
        // Config
        $.extend((this.settings = {}), $.DeviceDetect.defaults, options);

        // Variables
        this.devicesRules = {
            'phones': 'iphone|ipod|Android.*Mobile|Android.*Mobile Safari|blackberry|opera|mini|windows\\sce|palm|smartphone|iemobile',
            'tablets': 'ipad|Android.*Safari|android 3.0|xoom|sch-i800|playbook|tablet|kindle'
        };
        this.userAgent = navigator.userAgent;
        this.devices   = {};
        this.type      = null;

        return this;
    };

    $.DeviceDetect.defaults = {
        maxWidth: {
            smartphone: 767,
            tablet: 1023
        },
        resizeTimeout: 100,
        onCheckDevice: undefined,
        onGetDevices: undefined,
        onCheckScreen: undefined,
        onGetFormats: undefined
    };

    $.DeviceDetect.prototype = {
        /**
         * Test un type de règle
         *
         * @param  string type Nom de la règle à tester
         * @return bool
         */
        checkUserAgent: function (type) {
            var regex = new RegExp(this.devicesRules[type], 'i');

            return regex.test(this.userAgent);
        },

        /**
         * Test un device en fonction d'une règle
         */
        checkDevice: function () {
            // Modification du type
            if (this.checkUserAgent('phones')) {
                this.type = 'smartphone';
            } else if (this.checkUserAgent('tablets')) {
                this.type = 'tablet';
            } else {
                this.type = 'desktop';
            }

            // User callback
            if (this.settings.onCheckDevice !== undefined) {
                this.settings.onCheckDevice.call({
                    deviceDetect: this,
                    type: this.getType()
                });
            }

            // Définition des devices
            this.setDevices();
            return this;
        },

        /**
         * Test l'écran en fonction de la largeur
         *
         * @param  int width Largeur écran
         * @return setDevices()
         */
        checkScreen: function (width) {
            if (width > this.settings.maxWidth.smartphone && width <= this.settings.maxWidth.tablet) {
                this.type = 'tablet';
            } else if (width <= this.settings.maxWidth.smartphone) {
                this.type = 'smartphone';
            } else {
                this.type = 'desktop';
            }

            // User callback
            if (this.settings.onCheckScreen !== undefined) {
                this.settings.onCheckScreen.call({
                    deviceDetect: this,
                    type: this.getType()
                });
            }

            // Définition des devices
            this.setDevices();
            return this;
        },

        /**
         * Définition des devices en fonction du type
         *
         * @return object {smartphone, tablet, desktop}
         */
        setDevices: function () {
            // En fonction du type, on défini les devices
            this.devices.smartphone = (this.getType() === 'smartphone');
            this.devices.tablet = (this.getType() === 'tablet');
            this.devices.desktop = (this.getType() === 'desktop');

            return this;
        },

        /**
         * Récupération des périphériques via le User Agent
         *
         * @return object {smartphone, tablet, desktop}
         */
        getDevices: function () {
            // Test
            this.checkDevice();

            // 2ème passe si device=desktop
            if (this.getType() === 'desktop') {
                this.getFormats();
            }

            // User callback
            if (this.settings.onGetDevices !== undefined) {
                this.settings.onGetDevices.call({
                    deviceDetect: this,
                    devices: this.devices
                });
            }

            return this.devices;
        },

        /**
         * Récupération des périphériques via la largeur de la fenêtre
         *
         * @return object {smartphone, tablet, desktop}
         */
        getFormats: function () {
            var width = $(window).width();

            // Test
            this.checkScreen(width);

            // User callback
            if (this.settings.onGetFormats !== undefined) {
                this.settings.onGetFormats.call({
                    deviceDetect: this,
                    windowWidth: width,
                    devices: this.devices
                });
            }

            return this.devices;
        },

        /**
         * Récupère le type du périphérique testé
         *
         * @return string
         */
        getType: function () {
            return this.type;
        },

        /**
         * Ajoute un événement de type resize
         *
         * @param function callback Fonction utilisateur au resize
         */
        onResize: function (callback) {
            var self = this;
            var timeout;

            $(window).on('resize.devicedetect orientationchange.devicedetect', function (event) {
                clearTimeout(timeout);

                timeout = setTimeout(function () {
                    // Mise à jour des formats
                    self.getFormats();

                    // User callback
                    if (callback !== undefined && typeof callback === 'function') {
                        callback.call({
                            window: this,
                            event: event,
                            deviceDetect: self,
                            devices: self.devices
                        });
                    }
                }, self.settings.resizeTimeout);
            });
        }
    };
})(jQuery);