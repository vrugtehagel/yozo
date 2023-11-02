import { copy } from 'std/fs/mod.ts'


export async function mergeArchive(){
	await copy('archive', 'dist', {overwrite: true})
}
