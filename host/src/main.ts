/// <reference types="types-for-adobe/Premiere/2018" />

declare class Application extends App {}

class Main {
    showBuildName() {
        alert(`${app.build} build`);
    }
}

$.global._daihon = new Main();
//_daihon.showBuildName();