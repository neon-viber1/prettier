const template = () => html`
		<${For} each=${() => this.items}>
			       ${() => this.content}
		   </${For}>
	`;

const template2 = () => html`
		<${For} each=${() => this.items}>
			       ${() => this.content}
		   </>
	`;

const selfClosing = html`<${Comp} a=${1} /><div><${A}><${B}>x</></${A}></div>`;

const unmatched = html`<div></></div>`;
