import * as storageLink from '/-/js/storage-link/index.js'

const {live, when} = self.yozo

window.$site.settings = {}
export const $settings = window.$site.$settings

storageLink.local($settings.$semicolons, 'settings:semicolons',
	{type: 'boolean', fallback: true})
storageLink.local($settings.$useTabs, 'settings:use-tabs',
	{type: 'boolean', fallback: true})
storageLink.local($settings.$tabSize, 'settings:tab-size',
	{type: 'number', fallback: 4})


live.link($settings.$indent, () => {
	if($settings.useTabs) return '\t'
	return ' '.repeat($settings.tabSize)
})
