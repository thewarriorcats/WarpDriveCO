var CoTouchButton = pc.createScript('coTouchButton');

CoTouchButton.attributes.add('identifier', {
    type: 'string',
    default: 'button0',
    title: 'Identifier',
    description: 'A unique name for the button to refer to it by in the API. Will give a warning in browser tools if the name is not unique.'
});

CoTouchButton.attributes.add('vibration', {
    type: 'number',
    default: 0,
    title: 'Vibration duration (ms)',
    description: 'If the device supports vibration with \'Navigator.vibrate\', it will vibrate for the duration set here on touch down.Set to 0 to disable.'
});

// initialize code called once per entity
CoTouchButton.prototype.initialize = function () {
    this.uiManager = this.app.root.findByName("UI Manager").script.coUiManager;
    if (window.touchJoypad && window.touchJoypad.buttonStates[this.identifier] !== undefined) {
        console.warn('Touch button identifier already used, please use another for Entity: ' + this.entity.name);
        return;
    }

    this._canVibrate = !!navigator.vibrate;

    this._setState(false);

    this.on('state', (state) => {
        this._setEvents(state ? 'on' : 'off');
    });

    this.on('destroy', () => {
        if (window.touchJoypad) {
            window.touchJoypad.buttonStates[this.identifier] = undefined;
        }
    });

    this._setEvents('on');
};

CoTouchButton.prototype.postUpdate = function (dt) {

    if (this.uiManager.backgroundScreen.enabled == true || this.uiManager.gameScreen.enabled == false)
        this._setState(false);
};

CoTouchButton.prototype._setEvents = function (offOn) {
    this._state = false;

    this.entity.element[offOn]('mousedown', this._onMouseDown, this);
    this.entity.element[offOn]('mouseup', this._onMouseUp, this);

    if (this.app.touch) {
        this.entity.element[offOn]('touchstart', this._onTouchDown, this);
        this.entity.element[offOn]('touchend', this._onTouchUp, this);
        this.entity.element[offOn]('touchcancel', this._onTouchUp, this);
    }
};

CoTouchButton.prototype._onMouseDown = function (e) {
    if (!this._state) {
        this._onPointerDown();
        e.stopPropagation();
    }
};

CoTouchButton.prototype._onMouseUp = function (e) {
    if (this._state) {
        this._onPointerUp();
        //e.stopPropagation();
    }
};

CoTouchButton.prototype._onTouchDown = function (e) {
    if (!this._state) {
        this._onPointerDown();
        //e.stopPropagation();
    }
};

CoTouchButton.prototype._onTouchUp = function (e) {
    if (this._state) {
        this._onPointerUp();
        //e.stopPropagation();
    }

    //e.event.preventDefault();
};

CoTouchButton.prototype._onPointerDown = function () {
    if (this._canVibrate && this.vibration !== 0) {
        navigator.vibrate(this.vibration);
    }

    this._setState(true);
};

CoTouchButton.prototype._onPointerUp = function () {
    this._setState(false);
};

CoTouchButton.prototype._setState = function (state) {
    if (window.touchJoypad) {
        window.touchJoypad.buttonStates[this.identifier] = state ? Date.now() : null;
    }

    this._state = state;
};