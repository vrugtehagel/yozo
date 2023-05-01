#!/bin/bash

# This build script builds Yozo itself as well as the site.

# First, we build the site, since that sets up the general file structure.
# In big lines, we just clone the whole site into dist/, and
# then we run the CSML scripts, after which delete the .csml files.

	# First, we clean up dist/
	[ -d dist ] || mkdir dist
	rm -rf dist/*

	# We clone the whole site into dist/
	rsync -aq site/ dist/

	# We run the CSML build script
	deno run --allow-read --allow-write csml.config.js

	# Now, delete all the csml files, and the empty directories
	find dist -name "*.csml" -type f -delete
	find dist -type d -empty -delete

	# Show a sign of life
	echo "  Site build complete."

# Now, we build yozo itself. We provide a dev build as well as a production
# build, and they go under dist/lib.js and dist/dev,js.
# For the production file, we remove all lines in the source that have a
# comment in them. This makes it super easy to keep the dev and production
# scripts aligned while adding additional checks to the dev bundle.
# This means the original codebase (with comments) compiles to the dev bundle.

	# First, we clean up temp/
	[ -d temp ] || mkdir temp
	rm -rf temp/*

	# We clone the whole source into temp/
	rsync -aq src/ temp/

	# Now, we find all JS files and remove lines with //-style comments
	find temp -type f -name "*.js" -exec sed -i "" 's/^.*\/\/$//g' {} \;

	# Now bundle the thingies
	deno run -A https://deno.land/x/esbuild@v0.17.18/mod.js \
		lib=./temp/index.js \
		dev=./src/index.js \
		--outdir=dist --bundle --minify --log-level=warning

	# Save the exit status
	success=$?

	# Clean up temp/
	rm -rf temp

	# If the build failed, stop here
	if [[ $success -ne 0 ]]; then
	    echo "$(tput setaf 1)  Yozo build failed.$(tput sgr0)"
	    exit
	fi

	# Find out what size the build turned out to be
	size=$(gzip < ./dist/lib.js | wc -c | xargs)

	# We'll print the bundle size and assign it some color
	# <4750 is green, <5000 is yellow and >=5000 is red
	color=1
	[[ $size -lt 5000 ]] && color=3
	[[ $size -lt 4750 ]] && color=2

	# And echo some output
	echo "  Yozo build complete" \
		"($(tput setaf $color)$size$(tput init)b gzipped)."

# That's all!
