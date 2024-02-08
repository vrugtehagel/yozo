import { green, yellow, red, gray } from 'std/fmt/colors.ts'


export function getSizeInfo(){
	const gzip = getGzipInfo()
	const brotli = getBrotliInfo()
	const types = [gzip, brotli].filter(algorithm => algorithm != null)
	const status = gzip.size >= 5000 ? 'fail' : 'ok'
	return {types, status}
}

function getGzipInfo(){
	const size = compressedSize('gzip')
	if(!size) throw Error('Could not gzip dist/lib-latest.js')
	const color = size >= 5000 ? red : size >= 4750 ? yellow : green
	const text = `${color(size.toString())}b gzipped`
	const algorithm = 'gzip'
	return {algorithm, size, text}
}

function getBrotliInfo(){
	const size = compressedSize('brotli')
	if(!size) return null
	const text = `${gray(size.toString())}b brotli'd`
	const algorithm = 'brotli'
	return {algorithm, size, text}
}

function compressedSize(algorithm){
	const args = ['--stdout', 'dist/lib-latest.js']
	const command = new Deno.Command(algorithm, {args})
	try {
		return command.outputSync().stdout.length
	} catch {
		return 0
	}
}

