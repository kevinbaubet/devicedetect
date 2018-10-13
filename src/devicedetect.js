(function ($) {
    'use strict';

    $.DeviceDetect = function (options) {
        // Config
        $.extend((this.settings = {}), $.DeviceDetect.defaults, options);

        // Variables
        this.userAgent = window.navigator.userAgent;
        this.devices = {
            mobile: false,
            tablet: false,
            desktop: false,
            oldbrowser: false
        };
        this.type = null;
        this.windowWidth = $(window).width();

        return this;
    };

    $.DeviceDetect.defaults = {
        maxWidth: {
            mobile: 767,
            tablet: 1023
        },
        rules: {
            'mobile': 'iphone|ipod|Android.*Mobile|Android.*Mobile Safari|blackberry|opera|mini|windows\\sce|palm|smartphone|iemobile',
            'tablet': 'ipad|Android.*Safari|android 3.0|xoom|sch-i800|playbook|tablet(?! PC)|kindle',
            'oldbrowser': 'MSIE ([0-9]|10)\\.'
        },
        resizeTimeout: 100,
        onGetDevices: undefined
    };

    $.DeviceDetect.prototype = {

        /**
         * Test un type de règle
         *
         * @param  string type Nom de la règle à tester
         * @return bool
         */
        checkUserAgent: function (type) {
            if (this.settings.rules[type] !== undefined) {
                var regex = new RegExp(this.settings.rules[type], 'i');

                return regex.test(this.userAgent);
            }

            return false;
        },

        /**
         * Test un device en fonction d'une règle

         * @return setDevices()
         */
        checkDevice: function () {
            // Modification du type
            if (this.checkUserAgent('mobile')) {
                this.type = 'mobile';
            } else if (this.checkUserAgent('tablet')) {
                this.type = 'tablet';
            } else {
                this.type = 'desktop';
            }

            // Définition des devices
            return this.setDevices();
        },

        /**
         * Test l'écran en fonction de la largeur
         *
         * @return setDevices()
         */
        checkScreen: function () {
            // Modification du type
            if (this.getWindowWidth() > this.settings.maxWidth.mobile && this.getWindowWidth() <= this.settings.maxWidth.tablet) {
                this.type = 'tablet';
            } else if (this.getWindowWidth() <= this.settings.maxWidth.mobile) {
                this.type = 'mobile';
            } else {
                this.type = 'desktop';
            }

            // Définition des devices
            return this.setDevices();
        },

        /**
         * Définition des devices en fonction du type
         *
         * @return object {mobile, tablet, desktop}
         */
        setDevices: function () {
            // En fonction du type, on défini les devices
            this.devices.mobile = (this.getType() === 'mobile');
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
                this.checkScreen();
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
         * Récupère le type du périphérique testé
         *
         * @return string
         */
        getType: function () {
            return this.type;
        },

        /**
         * Récupère la taille actuelle du navigateur
         * Attention, il faut exécuter onResize() pour mettre à jour la valeur
         *
         * @return int
         */
        getWindowWidth: function () {
            return parseInt(this.windowWidth);
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
                    // Mise à jour de la taille du navigateur
                    self.windowWidth = $(window).width();

                    // Mise à jour des formats
                    self.getDevices();

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
        },

        /**
         * Traitement sur les anciens navigateurs
         *
         * @param callback
         */
        onOldBrowser: function (callback) {
            if ((this.devices.oldbrowser = (this.checkUserAgent('oldbrowser'))) && callback !== undefined && typeof callback === 'function') {
                callback.call({
                    deviceDetect: this,
                    devices: this.devices
                });
            }
        }
    };
})(jQuery);