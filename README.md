# Documentation DeviceDetect

Ce script permet de détecter le support utilisé (mobile, tablet, desktop) en fonction du user-agent et/ou de la dimension du navigateur.


## Exemple

    var deviceDetect = new $.DeviceDetect();
    var devices = deviceDetect.getDevices();
    
    console.log(devices);
    
    if (devices.mobile) {
        // on mobile
    }
    if (devices.tablet) {
        // on tablet
    }
    if (devices.desktop) {
        // on desktop
    }
    if (!devices.desktop) {
        // on mobile or tablet
    }
   
    deviceDetect.onResize(function () {
        console.log(this.devices);
    });
    
    deviceDetect.onOldBrowser(function () {
        // show notice
    });


## Options

| Option                             | Type     | Valeur par défaut | Description                                                                        |
|------------------------------------|----------|-------------------|------------------------------------------------------------------------------------|
| maxWidth                           | object   | Voir ci-dessous   | Liste les options ci-dessous                                                       |
| &nbsp;&nbsp;&nbsp;&nbsp;mobile     | integer  | 767               | Largeur max pour identifier le device en tant que smartphone                       |
| &nbsp;&nbsp;&nbsp;&nbsp;tablet     | integer  | 1023              | Largeur max pour identifier le device en tant que tablette                         |
| rules                              | object   | {...}             | Liste des règles regex par type, voir le fichier source pour les règles par défaut |
| resizeTimeout                      | integer  | 100               | Temps d'attente avant d'identifier le device lors d'un resize                      |
| onGetDevices                       | function | undefined         | Callback lors de la récupération des devices depuis le user-agent                  |


## Méthodes

| Méthode        | Arguments                                                              | Description                                                                                            |
|----------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| getDevices     | -                                                                      | Récupération des périphériques via le User Agent                                                       |
| getType        | -                                                                      | Récupération du périphérique testé                                                                     |
| getWindowWidth | -                                                                      | Récupère la taille actuelle du navigateur (utilisez onResize() pour mettre à jour la valeur au resize) |
| checkUserAgent | **type** *string* Nom de la règle à utiliser (option "rules")          | Test un type de règle                                                                                  |
| onResize       | **callback** *function* Callback executé lors du resize de l'écran     | Ajoute un événement de type resize                                                                     |
| onOldBrowser   | **callback** *function* Callback executé si c'est un ancien navigateur | Traitement sur les anciens navigateurs                                                                 |


## Ajouter un périphérique personnalisé

    var deviceDetect = new $.DeviceDetect({
        rules: {
            'custom': 'custom regex'
        },
        onGetDevices: function () {
            this.devices.custom = this.deviceDetect.checkUserAgent('custom');
        }
    });
    
    var devices = deviceDetect.getDevices();
    console.log(devices); // {mobile: false, tablet: false, desktop: false, oldbrowser: false, custom: true/false)