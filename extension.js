
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const PopupMenu = imports.ui.popupMenu;

let text, button;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
	/*
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world !!" });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;
	*/
    let monitor = Main.layoutManager.primaryMonitor;
    let button = new St.Bin({ style_class: 'panel-button',
		                      reactive: true,
		                      can_focus: true,
		                      x_fill: true,
		                      y_fill: false,
		                      track_hover: true });
	let icon = new St.Icon({ icon_name: 'drive-harddisk-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);

    //text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
    //                  monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    /*
    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
	*/

	this.actor.set_child(button);
	this._vbox = new St.BoxLayout({vertical: true});
	this.menu.addActor(this._vbox);
	item = new PopupMenu.PopupMenuItem("Take a shot !!");
	this._vbox.add(item.actor);
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'drive-harddisk-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _showHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
    Main.panel.addToStatusArea(IndicatorName, _indicator);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
