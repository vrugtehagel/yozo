const base64Map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

export default function vlqEncode(number){
	let result = '';
    number <<= 1;
	while(true){
		const cut = number & 0b011111
		number >>>= 5
        if(number) result += base64Map[cut | 0b100000]
        else return result + base64Map[cut]
	}
}
