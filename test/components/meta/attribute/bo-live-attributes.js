const { monitor } = self.yozo;
await self.yozo.register('./bo-live-attributes.yz');
const element = document.createElement('mood-live-attributes');
document.body.append(element);


const call = monitor(['live'], () => {
	element.mood = 'happy'
})
console.log(call.live.cah)

let changes = 0
call.live.addEventListener('change', () => {
	changes++
});

element.mood = 'sad'

assert(changes == 0)
