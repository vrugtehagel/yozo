rm -rf dist
rm -rf temp
mkdir dist
rsync -avq --progress --exclude="temp" --exclude=".build" --exclude=".git" --exclude="dist" . ./temp
find ./temp -type f -name '*.js' -exec sed -i '' 's/^.*\/\/$//g' {} \;
esbuild index.min=./temp/index.js index.dev=./index.js --bundle --outdir=dist --minify
rm -rf temp
SIZE=$(gzip < ./dist/index.min.js | wc -c | xargs)
RED=`tput setaf 1`
GREEN=`tput setaf 2`
YELLOW=`tput setaf 3`
echo ""
if [ $SIZE -lt 4750 ]
then
    echo "Gzipped size is ${GREEN}$SIZE"
elif [ $SIZE -lt 5000 ]
then
    echo "Gzipped size is ${YELLOW}$SIZE"
else
    echo "Gzipped size is ${RED}$SIZE"
fi
echo ""
