import { C as escape_html, S as attr, a as head, c as stringify, i as ensure_array_like, n as bind_props, ot as fallback, s as slot, t as attr_class, u as html } from "../../chunks/server.js";
//#region src/lib/components/Button.svelte
function Button($$renderer, $$props) {
	let href = $$props["href"];
	let variant = fallback($$props["variant"], "primary");
	let size = fallback($$props["size"], "md");
	$$renderer.push(`<a${attr("href", href)}${attr_class(`button button--${stringify(variant)} button--${stringify(size)}`, "svelte-18sv61c")}><!--[-->`);
	slot($$renderer, $$props, "default", {}, null);
	$$renderer.push(`<!--]--></a>`);
	bind_props($$props, {
		href,
		variant,
		size
	});
}
//#endregion
//#region src/lib/components/Header.svelte
function Header($$renderer) {
	$$renderer.push(`<header class="header svelte-1elxaub"><div class="container svelte-1elxaub"><div class="header-content svelte-1elxaub"><a href="/" class="logo svelte-1elxaub" aria-label="CubicLauncher Home"><span class="logo-text svelte-1elxaub">CubicLauncher</span></a> <nav class="nav svelte-1elxaub" aria-label="Main navigation"><a href="#" class="nav-link svelte-1elxaub">Home</a> <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="nav-link svelte-1elxaub">GitHub</a> <a href="#" class="nav-link svelte-1elxaub">Documentation</a></nav></div></div></header>`);
}
//#endregion
//#region src/lib/components/Hero.svelte
function Hero($$renderer) {
	$$renderer.push(`<section class="hero svelte-1q37ri0"><div class="container svelte-1q37ri0"><div class="hero-grid svelte-1q37ri0"><div class="hero-content svelte-1q37ri0"><h1 class="hero-title svelte-1q37ri0">Build the next generation Minecraft Launcher</h1> <p class="hero-description svelte-1q37ri0">Contribute to CubicLauncher, a modern, open-source launcher built by developers, for developers.
          Join the community and help shape the future of Minecraft launching.</p> <div class="hero-buttons svelte-1q37ri0">`);
	Button($$renderer, {
		href: "https://github.com/CubicLauncherDevs/CubicLauncher",
		variant: "primary",
		children: ($$renderer) => {
			$$renderer.push(`<!---->View on GitHub`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Button($$renderer, {
		href: "#",
		variant: "secondary",
		children: ($$renderer) => {
			$$renderer.push(`<!---->Read Documentation`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div></div> <div class="hero-visual svelte-1q37ri0" aria-hidden="true"><div class="code-window svelte-1q37ri0"><div class="code-header svelte-1q37ri0"><span>main.rs</span></div> <div class="code-content svelte-1q37ri0"><pre class="svelte-1q37ri0"><code class="svelte-1q37ri0">// Modern architecture
// Open source
// Fast development
// Built for contributors

mod launcher {
  pub fn start() {
    println!("Ready");
  }
}
</code></pre></div></div></div></div></div></section>`);
}
//#endregion
//#region src/lib/components/Card.svelte
function Card($$renderer, $$props) {
	let icon = $$props["icon"];
	let title = $$props["title"];
	let description = $$props["description"];
	$$renderer.push(`<article class="card svelte-1udyrqm"><div class="card-icon svelte-1udyrqm" aria-hidden="true">${html(icon)}</div> <div class="card-content svelte-1udyrqm"><h3 class="svelte-1udyrqm">${escape_html(title)}</h3> <p class="svelte-1udyrqm">${escape_html(description)}</p></div></article>`);
	bind_props($$props, {
		icon,
		title,
		description
	});
}
//#endregion
//#region src/lib/components/Features.svelte
function Features($$renderer) {
	const features = [
		{
			title: "Modern Architecture",
			description: "Built with clean, maintainable code that follows Rust best practices and modern design patterns.",
			icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
      </svg>`
		},
		{
			title: "Open Source",
			description: "Completely open-source project that welcomes contributions from developers of all skill levels.",
			icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/>
        <path d="M12 15c2.21 0 4 1.79 4 4"/>
      </svg>`
		},
		{
			title: "Fast Development",
			description: "Quick iteration cycles with comprehensive tooling and documentation for developers.",
			icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>`
		},
		{
			title: "Built for Contributors",
			description: "Thoughtfully designed to make contributing rewarding and straightforward for everyone.",
			icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>`
		}
	];
	$$renderer.push(`<section class="features svelte-1dpem8h"><div class="container svelte-1dpem8h"><div class="features-header svelte-1dpem8h"><h2 class="svelte-1dpem8h">Why contribute?</h2> <p class="svelte-1dpem8h">CubicLauncher is built on principles that make development enjoyable and sustainable.</p></div> <div class="features-grid svelte-1dpem8h"><!--[-->`);
	const each_array = ensure_array_like(features);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let feature = each_array[$$index];
		Card($$renderer, {
			icon: feature.icon,
			title: feature.title,
			description: feature.description
		});
	}
	$$renderer.push(`<!--]--></div></div></section>`);
}
//#endregion
//#region src/lib/components/Philosophy.svelte
function Philosophy($$renderer) {
	$$renderer.push(`<section class="philosophy svelte-kbl6yx"><div class="container svelte-kbl6yx"><h2 class="svelte-kbl6yx">Our Philosophy</h2> <div class="philosophy-grid svelte-kbl6yx"><div class="philosophy-item svelte-kbl6yx"><h3 class="svelte-kbl6yx">Clean Code</h3> <p class="svelte-kbl6yx">We believe code should be readable, maintainable, and a pleasure to work with. Every line is an investment in the future.</p></div> <div class="philosophy-item svelte-kbl6yx"><h3 class="svelte-kbl6yx">Simplicity First</h3> <p class="svelte-kbl6yx">Complex problems deserve elegant solutions. We avoid unnecessary abstraction and over-engineering at all costs.</p></div> <div class="philosophy-item svelte-kbl6yx"><h3 class="svelte-kbl6yx">Community Driven</h3> <p class="svelte-kbl6yx">Your voice matters. We actively listen to contributors and make decisions that benefit the entire project ecosystem.</p></div> <div class="philosophy-item svelte-kbl6yx"><h3 class="svelte-kbl6yx">Open Development</h3> <p class="svelte-kbl6yx">Everything happens in the open. Discussions, decisions, and code are transparent and accessible to everyone.</p></div></div></div></section>`);
}
//#endregion
//#region src/lib/components/CTA.svelte
function CTA($$renderer) {
	$$renderer.push(`<section class="cta svelte-1qdygc6"><div class="container svelte-1qdygc6"><div class="cta-content svelte-1qdygc6"><h2 class="svelte-1qdygc6">Ready to make an impact?</h2> <p class="svelte-1qdygc6">Join thousands of developers contributing to CubicLauncher. Whether you're fixing bugs, adding features, or improving documentation, your contributions matter.</p> `);
	Button($$renderer, {
		href: "https://github.com/CubicLauncherDevs/CubicLauncher",
		variant: "primary",
		size: "lg",
		children: ($$renderer) => {
			$$renderer.push(`<!---->Start Contributing`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div></div></section>`);
}
//#endregion
//#region src/lib/components/Footer.svelte
function Footer($$renderer) {
	$$renderer.push(`<footer class="footer svelte-jz8lnl"><div class="container svelte-jz8lnl"><div class="footer-content svelte-jz8lnl"><div class="footer-section svelte-jz8lnl"><h4 class="svelte-jz8lnl">CubicLauncher</h4> <p class="svelte-jz8lnl">Build the next generation Minecraft Launcher.</p></div> <div class="footer-links svelte-jz8lnl"><a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="svelte-jz8lnl">GitHub</a> <a href="https://github.com/CubicLauncherDevs/CubicLauncher/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="svelte-jz8lnl">License</a> <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" class="svelte-jz8lnl">Discord</a></div></div> <div class="footer-bottom svelte-jz8lnl"><p class="svelte-jz8lnl">© 2024 CubicLauncher. All rights reserved.</p></div></div></footer>`);
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer) {
	head("1uha8ag", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>CubicLauncher - For Developers</title>`);
		});
		$$renderer.push(`<meta name="description" content="Contribute to CubicLauncher, a modern open-source Minecraft launcher built for developers."/>`);
	});
	Header($$renderer, {});
	$$renderer.push(`<!----> `);
	Hero($$renderer, {});
	$$renderer.push(`<!----> `);
	Features($$renderer, {});
	$$renderer.push(`<!----> `);
	Philosophy($$renderer, {});
	$$renderer.push(`<!----> `);
	CTA($$renderer, {});
	$$renderer.push(`<!----> `);
	Footer($$renderer, {});
	$$renderer.push(`<!---->`);
}
//#endregion
export { _page as default };
