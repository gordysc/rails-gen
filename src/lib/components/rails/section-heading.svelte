<script lang="ts">
  /**
   * A numbered ledger-style section heading: a monospace index, a Fraunces
   * title, a hairline rule that fills the row, and an optional blurb beneath.
   */

  interface Props {
    /** Two-digit index, e.g. `"03"`. */
    index: string;
    /** Section title. */
    title: string;
    /** Optional supporting blurb. */
    blurb?: string;
  }

  let { index, title, blurb }: Props = $props();
</script>

<div class="space-y-2">
  <div class="flex items-center gap-4">
    <span class="font-mono text-xs tracking-[0.18em] text-primary tabular-nums"
      >{index}</span
    >
    <h2 class="font-display text-2xl text-foreground sm:text-[1.75rem]">
      {title}
    </h2>
    <span class="h-px flex-1 bg-rule" aria-hidden="true"></span>
  </div>
  {#if blurb}
    <p class="max-w-prose pl-9 text-sm text-muted-foreground">{blurb}</p>
  {/if}
</div>
