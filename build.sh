# We use /temp/ to duplicate the entire codebase, then remove lines with a // in it
# Lines with a // in it are lines we only want in the development bundle
# Anyway, this means the original codebase compiles to the dev bundle
# and the cloned version in /temp/ compiles to the minified production version

# First, remove /dist/ and /temp/
rm -rf dist
rm -rf temp

# Clone the entire codebase into /temp/
rsync -aq ./src ./temp

# Then, find all JavaScript files and empty the lines that include //
find ./temp -type f -name '*.js' -exec sed -i '' 's/^.*\/\/$//g' {} \;

# Everything is ready, bundle and minify both the original and copied codebase
esbuild \
    index.min=./temp/index.js \
    index.dev=./src/index.js \
    --outdir=dist --bundle --minify --log-level=warning

# Now we can get rid of the copied codebase, we no longer need it
rm -rf temp

# Find out what size the production bundle is, gzipped
size=$(gzip < ./dist/index.min.js | wc -c | xargs)

# We'll print the bundle size and assign it some color
# <4750kb is green, <5000kb is yellow and >=5000kb is red
[[ $size -lt 4750 ]] && color=2 || \
[[ $size -lt 5000 ]] && color=3 || \
                        color=1

# And echo some output
echo "  Build complete."
echo "  Gzipped size: $(tput setaf $color)$size"
