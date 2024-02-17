class ClickCounter extends HTMLElement {
	static get observedAttributes(){
		return ['amount'];
	}

	get amount(){
		const value = this.getAttribute('amount');
		return Number(value);
	}
	set amount(value){
		this.setAttribute('amount', value);
	}

	#button;
	#controller;

	constructor(){
		super();
		const shadow = this.attachShadow({
			mode: 'closed'
		});
		shadow.innerHTML = `
			<button>clicks: 0</button>
			<style>
				button {
					padding: .75rem 1.5rem;
					border: none;
					font-size: 1rem;
					line-height: 1.5;
					border-radius: .75rem;
					color: #181823;
					background-color: #FFB86C;
					cursor: pointer;
				}
			</style>
		`;
		this.#button = shadow
			.querySelector('button');
	}

	#increment(){
		this.amount += 1;
	}

	reset(){
		this.amount = 0;
	}

	connectedCallback(){
		const button = this.#button;
		this.#controller?.abort();
		this.#controller = new AbortController();
		const {signal} = this.#controller;
		button.addEventListener('click', () => {
			this.#increment();
		}, {signal});
	}

	disconnectedCallback(){
		this.#controller?.abort();
	}

	attributeChangedCallback(attribute, from, to){
		if(attribute == 'amount'){
			this.#updateAmount(to, from);
		}
	}

	#updateAmount(value, oldValue){
		const button = this.#button;
		button.textContent = `clicks: ${value}`;
	}
};

customElements.define(
	'click-counter',
	ClickCounter
);
