(function ($) {
    'use strict';

    /**
     * DeviceDetect
     *
     * @param {object=undefined} options
     *
     * @return {$.DeviceDetect}
     */
    $.DeviceDetect = function (options) {
        // Config
        $.extend(true, this.settings = {}, $.DeviceDetect.defaults, options);

        // Variables
        this.userAgent = window.navigator.userAgent;
        this.devices = {
            mobile: false,
            tablet: false,
            desktop: false,
            oldbrowser: false
        };
        this.type = null;
        this.windowWidth = window.innerWidth;

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
            'oldbrowser': 'MSIE ([0-9]|10)\\.|Trident\\/7\\.0;(.*)rv:11\\.0'
        },
        resizeTimeout: 100,
        onGetDevices: undefined
    };

    $.DeviceDetect.prototype = {

        /**
         * Test un type de règle
         *
         * @param  {string} type
         *
         * @return {boolean}
         */
        checkUserAgent: function (type) {
            var regex;

            if (this.settings.rules[type] !== undefined) {
                regex = new RegExp(this.settings.rules[type], 'i');

                return regex.test(this.userAgent);
            }

            return false;
        },

        /**
         * Test un device en fonction d'une règle
         */
        checkDevice: function () {
            // Modification du type
            if (this.checkUserAgent('mobile')) {
                this.setType('mobile');
            } else if (this.checkUserAgent('tablet')) {
                this.setType('tablet');
            } else {
                this.setType('desktop');
            }

            // Définition des devices
            return this.setDevices();
        },

        /**
         * Test l'écran en fonction de la largeur
         */
        checkScreen: function () {
            // Modification du type
            if (this.getWindowWidth() <= this.settings.maxWidth.mobile) {
                this.setType('mobile');
            } else if (this.getWindowWidth() <= this.settings.maxWidth.tablet) {
                this.setType('tablet');
            } else {
                this.setType('desktop');
            }

            // Définition des devices
            return this.setDevices();
        },

        /**
         * Définition des devices en fonction du type
         */
        setDevices: function () {
            this.devices.mobile = this.is('mobile');
            this.devices.tablet = this.is('tablet');
            this.devices.desktop = this.is('desktop');

            return this;
        },

        /**
         * Récupération des périphériques via le User Agent
         *
         * @return {object}
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
         * Définition du type courant
         *
         * @param {string} type
         */
        setType: function (type) {
            this.type = type;

            return this;
        },

        /**
         * Récupère le type du périphérique testé
         *
         * @return {string}
         */
        getType: function () {
            return this.type;
        },

        /**
         * Détermine si le type de périphérique est l'actuel
         *
         * @param {string} type
         *
         * @return {boolean}
         */
        is: function (type) {
            return this.getType() === type;
        },

        /**
         * Récupère la taille actuelle du navigateur
         * Attention, il faut exécuter onResize() pour mettre à jour la valeur
         *
         * @return {int}
         */
        getWindowWidth: function () {
            return this.windowWidth;
        },

        /**
         * Ajoute un événement de type resize
         *
         * @param {function} callback
         */
        onResize: function (callback) {
            var self = this;
            var timeout;

            $(window).on('resize.devicedetect orientationchange.devicedetect', function (event) {
                clearTimeout(timeout);

                timeout = setTimeout(function () {
                    // Mise à jour de la taille du navigateur
                    self.windowWidth = window.innerWidth;

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

            return self;
        },

        /**
         * Traitement sur les anciens navigateurs
         *
         * @param {function} callback
         */
        onOldBrowser: function (callback) {
            if ((this.devices.oldbrowser = this.checkUserAgent('oldbrowser')) && callback !== undefined && typeof callback === 'function') {
                callback.call({
                    deviceDetect: this,
                    devices: this.devices
                });
            }

            return this;
        },

        /**
         * Execute le callback à chaque changement des devices (load, resize, old browser)
         *
         * @param {function} callback
         */
        onChange: function (callback) {
            if (callback !== undefined && typeof callback === 'function') {
                callback.call({
                    deviceDetect: this,
                    devices: this.devices
                });
                this.onOldBrowser(callback);
                this.onResize(callback);
            }

            return this;
        }
    };
})(jQuery);