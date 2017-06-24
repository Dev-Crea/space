/* jshint esversion: 6 */

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const SETTINGS_SCHEMA = "org.gnome.shell.extensions.space";
const NAME_APPLICATION = "Space";

const SpaceSettings = new GObject.Class({
  Name: 'Space-Settings',
  Extends: Gtk.Notebook,

  _init: function(params) {
    /** Open Settings *********************************************************/
    this._settings = Convenience.getSettings(SETTINGS_SCHEMA);
    // this._settings.connect('changed', Lang.bind(this, this._refresh));

    /** GUI General ***********************************************************/
    this.parent(params);
    this.set_tab_pos(Gtk.PositionType.TOP);

    /** GUI Disk **************************************************************/
    this._page_disk();

    /** GUI Option ************************************************************/
    this._page_setting();
  },

  _page_disk: function() {
    let disk_page = new Gtk.Grid();
    disk_page.set_orientation(Gtk.Orientation.VERTICAL);
    disk_page.margin = 20;

    let title_label = new Gtk.Label({label: '<b>'+"List disk survey :"+'</b>', use_markup: true, halign: Gtk.Align.START});

    this._store = new Gtk.ListStore();
    this._store.set_column_types([GObject.TYPE_STRING, GObject.TYPE_STRING]);
    this._tree_view = new Gtk.TreeView({ model: this._store, hexpand: true, vexpand: true });

    let selection = this._tree_view.get_selection();
    selection.set_mode(Gtk.SelectionMode.SINGLE);
    // selection.connect ('changed', Lang.bind (this, this._onSelectionChanged));

    let column_name = new Gtk.TreeViewColumn({ expand: true, title: "Name" });

    let label_renderer = new Gtk.CellRendererText();
    column_name.pack_start(label_renderer, true);
    column_name.add_attribute(label_renderer, "text", 0);
    this._tree_view.append_column(column_name);

    let column_path = new Gtk.TreeViewColumn({ expand: true, title: "Path" });
    let path_renderer = new Gtk.CellRendererText();
    column_path.pack_start(path_renderer, true);
    column_path.add_attribute(path_renderer, "text", 1);
    this._tree_view.append_column(column_path);

    // Add page to window
    this.append_page(disk_page, new Gtk.Label({label: "Disks"}));

    // Add element to page
    disk_page.add(title_label);
    disk_page.add(this._tree_view);

    // Add data
    let data_root = JSON.stringify({ "name": "Root", "path": "/" });
    let widget = new Gtk.Label();
    widget.set_label("dlkfjnl");

    this._tree_view.add(widget);
  },

  _page_setting: function() {
    let setting_page = new Gtk.Grid();
    setting_page.set_orientation(Gtk.Orientation.VERTICAL);
    setting_page.margin = 20;

    // Add page to window
    this.append_page(setting_page, new Gtk.Label({label: "Settings"}));

    // Add element to page
  },

  _default_mout: function() {
  }
});

function init() {
}

function buildPrefsWidget() {
  let widget = new SpaceSettings();

  widget.show_all();

  return widget;
}
