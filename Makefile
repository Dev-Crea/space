all: lint dist

deps:
  npm install -g jshint

lint:
  jshint *.js

dist:
  README.md\
  LICENSE\
  extension.js\
  metadata.json
  zip -j Space@dev-crea.com.zip $?

publish:
  .infra/smartfile/publish remove-dropdown-arrows@mpdeimos.com.zip

clean:
  rm -f *.zip
