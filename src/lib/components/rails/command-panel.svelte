<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import CheckIcon from "@lucide/svelte/icons/check";
  import XIcon from "@lucide/svelte/icons/x";
  import RotateIcon from "@lucide/svelte/icons/rotate-ccw";
  import SparkleIcon from "@lucide/svelte/icons/sparkles";
  import type { ActiveFlag, CommandToken } from "$lib/rails/options";

  /**
   * The sticky output panel: a terminal slab rendering the live command with
   * syntax-coloured tokens, a copy action, and the set of active deviations as
   * removable chips. Purely presentational — all state lives in the page.
   */

  interface Props {
    /** Syntax-coloured command tokens. */
    tokens: CommandToken[];
    /** The plain-text command (used by the copy handler). */
    command: string;
    /** Active deviations from the omakase defaults. */
    flags: ActiveFlag[];
    /** Whether the command was just copied (drives the button affordance). */
    copied: boolean;
    /** Invoked when the copy button is pressed. */
    oncopy: () => void;
    /** Invoked to clear a single flag by id. */
    onremove: (id: string) => void;
    /** Invoked to restore every default. */
    onreset: () => void;
  }

  let { tokens, command, flags, copied, oncopy, onremove, onreset }: Props =
    $props();

  const skipped = $derived(flags.filter(f => f.kind === "skip").length);
  const configured = $derived(flags.filter(f => f.kind === "config").length);

  /** Maps a token's syntactic role to its slab colour treatment. */
  function tokenClass(kind: CommandToken["kind"]): string {
    switch (kind) {
      case "name":
        return "font-semibold text-slab-foreground underline decoration-primary/70 decoration-2 underline-offset-[5px]";
      case "config":
        return "text-gold-bright";
      case "skip":
        return "text-crimson-bright";
      default:
        return "text-slab-foreground/70";
    }
  }
</script>

<div class="space-y-5">
  <div class="flex items-baseline justify-between">
    <span
      class="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase"
    >
      The Command
    </span>
    <Badge variant="outline" class="border-primary/30 font-mono text-primary">
      {flags.length}
      {flags.length === 1 ? "flag" : "flags"}
    </Badge>
  </div>

  <!-- Terminal slab -->
  <div
    class="relative overflow-hidden rounded-xl bg-slab p-5 shadow-[0_22px_50px_-28px_rgba(38,18,12,0.7)]"
  >
    <span
      class="pointer-events-none absolute top-2.5 left-2.5 size-2.5 border-t border-l border-slab-border"
    ></span>
    <span
      class="pointer-events-none absolute top-2.5 right-2.5 size-2.5 border-t border-r border-slab-border"
    ></span>
    <span
      class="pointer-events-none absolute bottom-2.5 left-2.5 size-2.5 border-b border-l border-slab-border"
    ></span>
    <span
      class="pointer-events-none absolute right-2.5 bottom-2.5 size-2.5 border-r border-b border-slab-border"
    ></span>

    <div class="mb-4 flex items-center justify-between">
      <div class="flex gap-1.5">
        <span class="size-2.5 rounded-full bg-primary/90"></span>
        <span class="size-2.5 rounded-full bg-gold/80"></span>
        <span class="size-2.5 rounded-full bg-slab-foreground/25"></span>
      </div>
      <span
        class="font-mono text-[10px] tracking-[0.15em] text-slab-muted uppercase"
      >
        rails-new · zsh
      </span>
    </div>

    <code
      class="block font-mono text-[13px] leading-7 break-words text-slab-foreground"
    >
      <span class="mr-0.5 text-primary select-none">❯</span
      >{#each tokens as token, i (i)}{" "}<span class={tokenClass(token.kind)}
          >{token.value}</span
        >{/each}<span
        class="caret ml-0.5 inline-block text-slab-foreground/80 select-none"
        >▍</span
      >
    </code>
  </div>

  <Button class="h-11 w-full text-sm" onclick={oncopy}>
    {#if copied}
      <CheckIcon class="size-4" />
      Copied to clipboard
    {:else}
      <CopyIcon class="size-4" />
      Copy command
    {/if}
  </Button>

  <!-- Deviation ledger -->
  <div class="space-y-3 rounded-lg border border-border bg-card/60 p-4">
    <div class="flex items-center justify-between">
      <span
        class="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase"
      >
        Active flags
      </span>
      <div
        class="flex items-center gap-3 font-mono text-[11px] text-muted-foreground"
      >
        <span><span class="text-primary">{skipped}</span> skipped</span>
        <span><span class="text-gold-ink">{configured}</span> configured</span>
      </div>
    </div>

    {#if flags.length === 0}
      <p class="flex items-center gap-2 text-xs text-muted-foreground">
        <SparkleIcon class="size-3.5 text-gold-ink" />
        Pure omakase — every Rails default left intact.
      </p>
    {:else}
      <div class="flex flex-wrap gap-1.5">
        {#each flags as flag (flag.id)}
          <button
            type="button"
            onclick={() => onremove(flag.id)}
            title={`Remove ${flag.flag}`}
            class="group inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition-colors {flag.kind ===
            'skip'
              ? 'border-primary/35 text-primary hover:bg-primary/10'
              : 'border-gold-ink/40 text-gold-ink hover:bg-gold/15'}"
          >
            {flag.flag}
            <XIcon
              class="size-3 opacity-50 transition-opacity group-hover:opacity-100"
            />
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <button
    type="button"
    onclick={onreset}
    class="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
  >
    <RotateIcon class="size-3.5" />
    Reset to omakase defaults
  </button>

  <p class="sr-only" aria-live="polite">{command}</p>
</div>
