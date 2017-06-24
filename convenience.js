/* jshint esversion: 6 */

const Gettext = imports.gettext;
const Gio = imports.gi.Gio;

const Config = imports.misc.config;
const ExtensionUtils = imports.misc.extensionUtils;


function initTranslations(domain) {
  let extension = ExtensionUtils.getCurrentExtension();

  domain = domain || extension.metadata['gettext-domain'];

  // check if this extension was built with "make zip-file", and thus
  // has the locale files in a subfolder
  // otherwise assume that extension has been installed in the
  // same prefix as gnome-shell
  let localeDir = extension.dir.get_child('locale');
  if (localeDir.query_exists(null)) {
    Gettext.bindtextdomain(domain, localeDir.get_path());
  } else {
    Gettext.bindtextdomain(domain, Config.LOCALEDIR);
  }
}

function getSettings(schema) {
  let extension = ExtensionUtils.getCurrentExtension();

  schema = schema || extension.metadata['settings-schema'];

  const GioSSS = Gio.SettingsSchemaSource;

  // check if this extension was built with "make zip-file", and thus
  // has the schema files in a subfolder
  // otherwise assume that extension has been installed in the
  // same prefix as gnome-shell (and therefore schemas are available
  // in the standard folders)
  let schemaDir = extension.dir.get_child('schemas');
  let schemaSource;
  if (schemaDir.query_exists(null)) {
    schemaSource = GioSSS.new_from_directory(schemaDir.get_path(), GioSSS.get_default(), false);
  } else {
    schemaSource = GioSSS.get_default();
  }

  let schemaObj = schemaSource.lookup(schema, true);

  if (!schemaObj) {
    throw new Error('Schema ' + schema + ' could not be found for extension ' + extension.metadata.uuid + '. Please check your installation.');
  }

  return new Gio.Settings({settings_schema: schemaObj});
}

function getListDisks() {
  schema = schema || extension.metadata['settings-schema'];

  return schema.get_array('list-disk');
}
