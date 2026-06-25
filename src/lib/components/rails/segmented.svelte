<script lang="ts">
  import type { SelectOption } from "$lib/rails/options";

  /**
   * A compact segmented control for small, mutually-exclusive choice sets
   * (stack posture, Rails source). The selected segment fills with crimson;
   * the active option's {@link SelectOption.hint} is surfaced beneath.
   */

  interface Props {
    /** Accessible label describing the group. */
    label: string;
    /** The available segments. */
    options: SelectOption[];
    /** Bindable selected value. */
    value: string;
  }

  let { label, options, value = $bindable() }: Props = $props();

  const activeHint = $derived(options.find(o => o.value === value)?.hint);
</script>

<div class="space-y-2">
  <div
    class="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-card/80 p-1"
    role="radiogroup"
    aria-label={label}
  >
    {#each options as option (option.value)}
      <button
        type="button"
        role="radio"
        aria-checked={value === option.value}
        onclick={() => (value = option.value)}
        class="rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors {value ===
        option.value
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
      >
        {option.label}
      </button>
    {/each}
  </div>
  {#if activeHint}
    <p class="text-xs text-muted-foreground">{activeHint}</p>
  {/if}
</div>
