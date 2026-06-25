<script lang="ts">
  import { Switch } from "$lib/components/ui/switch/index.js";
  import type { FeatureFlag } from "$lib/rails/options";

  /**
   * One feature toggle, rendered as a ledger row.
   *
   * The switch state means "is this feature present in the resulting app". For
   * omakase features (`emitWhenOff`) that means ON = included; turning it off
   * emits a crimson `--skip-*` flag and strikes through the label. For opt-in
   * features, turning it on emits a gold additive flag instead.
   */

  interface Props {
    /** The feature definition driving this row. */
    feature: FeatureFlag;
    /** Bindable toggle state. */
    checked: boolean;
    /** When true the control is dimmed and non-interactive. */
    disabled?: boolean;
  }

  let { feature, checked = $bindable(), disabled = false }: Props = $props();

  /** Whether the current state contributes a flag to the command. */
  const emitting = $derived(feature.emitWhenOff ? !checked : checked);
  /** A contributed `--skip-*` flag reads as a removal from the stack. */
  const skipping = $derived(emitting && feature.flag.startsWith("--skip-"));
</script>

<label
  class="group flex cursor-pointer items-center justify-between gap-4 border-b border-border/70 py-3.5 transition-opacity last:border-b-0 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45"
  data-disabled={disabled}
>
  <div class="min-w-0">
    <div class="flex items-center gap-2">
      <span
        class="text-sm font-medium transition-colors {skipping
          ? 'text-muted-foreground line-through decoration-primary/50'
          : 'text-foreground'}"
      >
        {feature.label}
      </span>
      {#if emitting}
        <span
          class="font-mono text-[10.5px] leading-none {skipping
            ? 'text-primary'
            : 'text-gold-ink'}"
        >
          {feature.flag}
        </span>
      {/if}
    </div>
    <p class="mt-1 truncate text-xs text-muted-foreground">
      {feature.description}
    </p>
  </div>

  <Switch bind:checked {disabled} class="data-checked:bg-primary" />
</label>
