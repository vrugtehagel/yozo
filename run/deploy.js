import { green, yellow, red, gray } from 'std/fmt/colors.ts'

import { build } from './build.js'


await build().catch(() => Deno.exit(1))

const cwd = 'dist'
const user = 'yozodeploy'
const domain = 'yozo.ooo'
const remoteDirectory = '/var/www/yozo.ooo/'
const args = ['-r', '.', `${user}@${domain}:${remoteDirectory}`]
const command = new Deno.Command('scp', {args, cwd})
const {success} = await command.output()

if(success) console.log(`${green('✓')} Deployed successfully.`)
else console.log(`${red('✘')} Deploy failed!`)
