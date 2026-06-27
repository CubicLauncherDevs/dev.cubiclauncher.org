<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Features from '$lib/components/Features.svelte';
  import Philosophy from '$lib/components/Philosophy.svelte';
  import CTA from '$lib/components/CTA.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
  <title>CubicLauncher - For Developers</title>
  <meta name="description" content="Contribute to CubicLauncher, a modern open-source Minecraft launcher built for developers." />
</svelte:head>

<Header />
<Hero />
<Features />
<Philosophy />
<CTA />
<Footer />

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
  }
</style>
