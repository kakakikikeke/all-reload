rm -rf dist/*
mkdir -p dist
zip -r -FS ./dist/all-reload.zip * --exclude '*.git*' '*package.json*' '*node_modules*' 'build.sh' '.eslintrc.js' '*dist*'
