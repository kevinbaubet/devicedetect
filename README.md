# Documentation DeviceDetect

Ce script permet de détecter le support utilisé (smartphone, tablet, desktop) en fonction du user-agent et/ou de la dimension du navigateur.


## Initialisation

    var DeviceDetect = new $.DeviceDetect();


## Options

| Option                             | Type     | Valeur par défaut | Description                                                              |
|------------------------------------|----------|-------------------|--------------------------------------------------------------------------|
| maxWidth                           | object   | Voir ci-dessous   | Liste les options ci-dessous                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;smartphone | integer  | 767               | Largeur max pour identifier le device en tant que smartphone             |
| &nbsp;&nbsp;&nbsp;&nbsp;tablet     | integer  | 1023              | Largeur max pour identifier le device en tant que tablette               |
| rules                              | object   | Voir src/         | Liste des règles regex par type                                          |
| resizeTimeout                      | integer  | 100               | Temps d'attente avant d'identifier le device lors d'un resize            |
| onGetDevices                       | function | undefined         | Callback lors de la récupération des devices depuis le user-agent        |


## Méthodes

| Méthode      | Arguments                                                              | Description                                                 |
|--------------|------------------------------------------------------------------------|-------------------------------------------------------------|
| getDevices   | -                                                                      | Récupération des périphériques via le User Agent            |
| getType      | -                                                                      | Récupération du périphérique testé                          |
| onResize     | **callback** *function* Callback executé lors du resize de l'écran     | Ajoute un événement de type resize                          |
| onOldBrowser | **callback** *function* Callback executé si c'est un ancien navigateur | Traitement sur les anciens navigateurs                      |