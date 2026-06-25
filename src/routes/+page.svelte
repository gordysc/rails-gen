<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import SectionHeading from "$lib/components/rails/section-heading.svelte";
  import OptionRow from "$lib/components/rails/option-row.svelte";
  import Segmented from "$lib/components/rails/segmented.svelte";
  import CommandPanel from "$lib/components/rails/command-panel.svelte";
  import {
    buildCommand,
    defaultToggles,
    featureById,
    labelOf,
    DATABASES,
    JS_APPROACHES,
    CSS_PROCESSORS,
    POSTURES,
    SOURCES,
    FEATURE_GROUPS,
    type Posture,
    type Source
  } from "$lib/rails/options";

  /** Versions of the locally installed toolchain this generator targets. */
  const RAILS_VERSION = "8.1.3";
  const RUBY_VERSION = "4.0.5";

  /**
   * Literal animation-delay classes so Tailwind can statically emit them; one
   * per staggered section in source order.
   */
  const RISE_DELAYS = [
    "[animation-delay:80ms]",
    "[animation-delay:140ms]",
    "[animation-delay:200ms]",
    "[animation-delay:260ms]",
    "[animation-delay:320ms]",
    "[animation-delay:380ms]"
  ];

  let appName = $state("");
  let database = $state("sqlite3");
  let javascript = $state("importmap");
  let css = $state("none");
  let posture = $state("standard");
  let source = $state("stable");
  let toggles = $state<Record<string, boolean>>(defaultToggles());
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  /** The live command + coloured tokens + active-flag chips. */
  const build = $derived(
    buildCommand({
      name: appName,
      database,
      javascript,
      css,
      posture: posture as Posture,
      source: source as Source,
      toggles
    })
  );

  /** Active Record drives whether a database driver is meaningful. */
  const activeRecordOn = $derived(toggles.active_record);
  /** JavaScript bundling drives whether the `-j` choice is meaningful. */
  const javascriptOn = $derived(toggles.javascript);

  const namePreview = $derived(appName.trim() || "my_app");
  const isPlaceholderName = $derived(appName.trim() === "");

  /** Copies the generated command to the clipboard with feedback. */
  async function copyCommand(): Promise<void> {
    try {
      await navigator.clipboard.writeText(build.command);
      copied = true;
      if (copyTimer) clearTimeout(copyTimer);
      copyTimer = setTimeout(() => (copied = false), 2200);
      toast.success("Command copied", {
        description: "Paste it into your terminal to scaffold the app."
      });
    } catch {
      toast.error("Couldn’t reach the clipboard", {
        description: "Select the command text and copy it manually."
      });
    }
  }

  /** Reverts a single deviation back to its omakase default. */
  function clearFlag(id: string): void {
    switch (id) {
      case "db":
        database = "sqlite3";
        break;
      case "js":
        javascript = "importmap";
        break;
      case "css":
        css = "none";
        break;
      case "posture":
        posture = "standard";
        break;
      case "source":
        source = "stable";
        break;
      default: {
        const feature = featureById(id);
        if (feature) toggles[id] = feature.defaultOn;
      }
    }
  }

  /** Restores every selection to the Rails defaults. */
  function resetAll(): void {
    appName = "";
    database = "sqlite3";
    javascript = "importmap";
    css = "none";
    posture = "standard";
    source = "stable";
    toggles = defaultToggles();
  }
</script>

<svelte:head>
  <title>rails new — app generator</title>
  <meta
    name="description"
    content="Compose a rails new command by toggling the omakase stack, then copy it."
  />
</svelte:head>

<div class="paper-grid min-h-svh w-full">
  <div class="mx-auto max-w-6xl px-5 pt-12 pb-20 sm:px-8 lg:pt-16">
    <!-- Masthead -->
    <header class="rise">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="font-display flex size-9 items-center justify-center rounded-md bg-primary text-lg text-primary-foreground shadow-sm"
          >
            R
          </div>
          <span
            class="font-mono text-xs tracking-[0.2em] text-primary uppercase"
          >
            Rails · App Generator
          </span>
        </div>
        <span class="font-mono text-xs text-muted-foreground"
          >ruby {RUBY_VERSION}</span
        >
      </div>

      <h1
        class="font-display mt-8 text-4xl text-foreground sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]"
      >
        rails new
        <span class={isPlaceholderName ? "text-primary/45" : "text-primary"}
          >{namePreview}</span
        ><span class="caret text-primary">▍</span>
      </h1>

      <p class="mt-4 max-w-xl text-base text-muted-foreground">
        Rails is served omakase — everything's included by default. Dish out the
        stack you actually want, then copy the command.
      </p>

      <div class="mt-6 flex flex-wrap gap-2">
        {#each ["Rails " + RAILS_VERSION, "Convention over configuration", "The one-person framework"] as chip (chip)}
          <span
            class="inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-[11px] text-muted-foreground"
          >
            {chip}
          </span>
        {/each}
      </div>
    </header>

    <div
      class="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16"
    >
      <!-- Form -->
      <main class="order-2 space-y-14 lg:order-none">
        <!-- 01 · Identity -->
        <section class="rise {RISE_DELAYS[0]}">
          <SectionHeading
            index="01"
            title="Identity"
            blurb="What's the application called? Spaces become underscores."
          />
          <div class="mt-5 space-y-2">
            <Label
              for="app-name"
              class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
            >
              Application name
            </Label>
            <Input
              id="app-name"
              bind:value={appName}
              placeholder="my_app"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              class="h-12 max-w-md bg-card font-mono text-base shadow-sm"
            />
            <p class="font-mono text-[11px] text-muted-foreground">
              → generates into ./{namePreview}
            </p>
          </div>
        </section>

        <!-- 02 · Foundations -->
        <section class="rise {RISE_DELAYS[1]}">
          <SectionHeading
            index="02"
            title="Foundations"
            blurb="The database, front-end pipeline and overall shape of the stack."
          />

          <div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Database -->
            <div class="space-y-2 {activeRecordOn ? '' : 'opacity-50'}">
              <Label
                for="database"
                class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                Database
              </Label>
              <Select.Root
                type="single"
                bind:value={database}
                disabled={!activeRecordOn}
              >
                <Select.Trigger
                  id="database"
                  class="w-full justify-between bg-card font-mono"
                >
                  {labelOf(DATABASES, database)}
                </Select.Trigger>
                <Select.Content>
                  {#each DATABASES as option (option.value)}
                    <Select.Item value={option.value} label={option.label}>
                      {option.label}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <p class="font-mono text-[11px] text-muted-foreground">
                {#if !activeRecordOn}
                  needs Active Record
                {:else if database === "sqlite3"}
                  default
                {:else}
                  <span class="text-gold-ink">-d {database}</span>
                {/if}
              </p>
            </div>

            <!-- JavaScript -->
            <div class="space-y-2 {javascriptOn ? '' : 'opacity-50'}">
              <Label
                for="javascript"
                class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                JavaScript
              </Label>
              <Select.Root
                type="single"
                bind:value={javascript}
                disabled={!javascriptOn}
              >
                <Select.Trigger
                  id="javascript"
                  class="w-full justify-between bg-card font-mono"
                >
                  {labelOf(JS_APPROACHES, javascript)}
                </Select.Trigger>
                <Select.Content>
                  {#each JS_APPROACHES as option (option.value)}
                    <Select.Item value={option.value} label={option.label}>
                      {option.label}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <p class="font-mono text-[11px] text-muted-foreground">
                {#if !javascriptOn}
                  JavaScript skipped
                {:else if javascript === "importmap"}
                  default
                {:else}
                  <span class="text-gold-ink">-j {javascript}</span>
                {/if}
              </p>
            </div>

            <!-- CSS -->
            <div class="space-y-2">
              <Label
                for="css"
                class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                CSS processor
              </Label>
              <Select.Root type="single" bind:value={css}>
                <Select.Trigger
                  id="css"
                  class="w-full justify-between bg-card font-mono"
                >
                  {labelOf(CSS_PROCESSORS, css)}
                </Select.Trigger>
                <Select.Content>
                  {#each CSS_PROCESSORS as option (option.value)}
                    <Select.Item value={option.value} label={option.label}>
                      {option.label}
                    </Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
              <p class="font-mono text-[11px] text-muted-foreground">
                {#if css === "none"}
                  default
                {:else}
                  <span class="text-gold-ink">-c {css}</span>
                {/if}
              </p>
            </div>
          </div>

          <div class="mt-7 grid gap-6 sm:grid-cols-2">
            <div class="space-y-2.5">
              <span
                class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                Stack posture
              </span>
              <Segmented
                label="Stack posture"
                options={POSTURES}
                bind:value={posture}
              />
            </div>
            <div class="space-y-2.5">
              <span
                class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
              >
                Rails source
              </span>
              <Segmented
                label="Rails source"
                options={SOURCES}
                bind:value={source}
              />
            </div>
          </div>
        </section>

        <!-- 03–06 · Feature groups -->
        {#each FEATURE_GROUPS as group, index (group.id)}
          <section class="rise {RISE_DELAYS[index + 2]}">
            <SectionHeading
              index={group.index}
              title={group.title}
              blurb={group.blurb}
            />
            <div class="mt-3 grid gap-x-10 sm:grid-cols-2">
              {#each group.features as feature (feature.id)}
                <OptionRow {feature} bind:checked={toggles[feature.id]} />
              {/each}
            </div>
          </section>
        {/each}

        <footer
          class="border-t border-rule pt-6 font-mono text-[11px] text-muted-foreground"
        >
          Flags mirror <span class="text-foreground">rails new --help</span> ·
          Rails {RAILS_VERSION}
        </footer>
      </main>

      <!-- Output -->
      <aside class="order-1 lg:sticky lg:top-8 lg:order-none lg:self-start">
        <CommandPanel
          tokens={build.tokens}
          command={build.command}
          flags={build.flags}
          {copied}
          oncopy={copyCommand}
          onremove={clearFlag}
          onreset={resetAll}
        />
      </aside>
    </div>
  </div>
</div>
