# Documentation DeviceDetect

Ce script permet de détecter le support utilisé (smartphone, tablet, desktop) en fonction du user-agent ou de la dimension du navigateur.


## Initialisation

    var DeviceDetect = new $.DeviceDetect();


## Options

| Option                             | Type     | Valeur par défaut | Description                                                              |
|------------------------------------|----------|-------------------|--------------------------------------------------------------------------|
| maxWidth                           | object   | Voir ci-dessous   | Liste les options ci-dessous                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;smartphone | integer  | 767               | Largeur max pour identifier le device en tant que smartphone             |
| &nbsp;&nbsp;&nbsp;&nbsp;tablet     | integer  | 1023              | Largeur max pour identifier le device en tant que tablette               |
| resizeTimeout                      | integer  | 100               | Temps d'attente avant d'identifier le device lors d'un resize            |
| onCheckDevice                      | function | undefined         | Callback lors d'un test sur le user-agent                                |
| onGetDevices                       | function | undefined         | Callback lors de la récupération des devices depuis le user-agent        |
| onCheckScreen                      | function | undefined         | Callback lors d'un test sur la largeur de l'écran                        |
| onGetFormats                       | function | undefined         | Callback lors de la récupération des devices depuis la taille de l'écran |


## Méthodes

| Méthode     | Arguments                                                          | Description                                                 |
|-------------|--------------------------------------------------------------------|-------------------------------------------------------------|
| checkDevice | -                                                                  | Test le device depuis le user-agent                         |
| checkScreen | **width** *integer* Largeur d'écran                                | Test l'écran en fonction de la largeur                      |
| getDevices  | -                                                                  | Récupération des périphériques via le User Agent            |
| getFormats  | -                                                                  | Récupération des périphériques via la largeur de la fenêtre |
| onResize    | **callback** *function* Callback utilisé lors du resize de l'écran | Ajoute un événement de type resize                          |