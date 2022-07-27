rm -rf dist
rm -rf temp
mkdir dist
rsync -avq --progress --exclude="temp" --exclude=".build" --exclude=".git" --exclude="dist" . ./temp
find ./temp -type f -name '*.js' -exec sed -i '' 's/^.*\/\/$//g' {} \;
deno bundle ./temp/index.js | esbuild --minify > ./dist/index.min.js
deno bundle ./index.js | esbuild --minify > ./dist/index.dev.js
sed -i '' 's/{url.*main:[^}]*}/import.meta/g' ./dist/index.min.js
sed -i '' 's/{url.*main:[^}]*}/import.meta/g' ./dist/index.dev.js
rm -rf temp
