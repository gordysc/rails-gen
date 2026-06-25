/**
 * Domain model + `rails new` command builder for the generator UI.
 *
 * Rails ships "omakase": every framework, tool and integration is included by
 * default and you opt **out** with `--skip-*` flags. A handful of choices are
 * opt **in** instead (`--api`, `--devcontainer`, a database driver, …). This
 * module encodes that asymmetry once so the UI and the generated command stay
 * in sync.
 */

/** The overall stack posture passed to `rails new`. */
export type Posture = "standard" | "api" | "minimal";

/** Which Rails source the generated Gemfile should point at. */
export type Source = "stable" | "edge" | "main";

/** A single choice in a `<Select>` or segmented control. */
export interface SelectOption {
  /** Value emitted into the command (e.g. `"postgresql"`). */
  value: string;
  /** Human label shown in the UI. */
  label: string;
  /** Optional one-line elaboration shown beneath segmented controls. */
  hint?: string;
}

/**
 * A toggleable Rails feature backed by a single CLI flag.
 *
 * `emitWhenOff` captures the omakase asymmetry: "included by default" features
 * emit their flag when the switch is **off**, while "opt-in" features emit
 * their flag when the switch is **on**.
 */
export interface FeatureFlag {
  /** Stable identifier, also used as the toggle-state key. */
  id: string;
  /** Short title, e.g. `"Active Record"`. */
  label: string;
  /** One-line description of what the feature provides. */
  description: string;
  /** The CLI flag this feature contributes, e.g. `"--skip-active-record"`. */
  flag: string;
  /** When `true`, the flag is emitted while the toggle is OFF. */
  emitWhenOff: boolean;
  /** The toggle's initial state. */
  defaultOn: boolean;
}

/** A titled cluster of related {@link FeatureFlag}s. */
export interface FeatureGroup {
  /** Stable identifier. */
  id: string;
  /** Two-digit ledger index shown in the section heading. */
  index: string;
  /** Section title. */
  title: string;
  /** Short editorial blurb under the title. */
  blurb: string;
  /** The features belonging to this group. */
  features: FeatureFlag[];
}

/** Database drivers supported by `rails new -d`. */
export const DATABASES: SelectOption[] = [
  { value: "sqlite3", label: "SQLite 3" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "trilogy", label: "Trilogy" },
  { value: "mariadb-mysql", label: "MariaDB · MySQL" },
  { value: "mariadb-trilogy", label: "MariaDB · Trilogy" }
];

/** JavaScript bundling approaches supported by `rails new -j`. */
export const JS_APPROACHES: SelectOption[] = [
  { value: "importmap", label: "Importmap" },
  { value: "bun", label: "Bun" },
  { value: "esbuild", label: "esbuild" },
  { value: "webpack", label: "Webpack" },
  { value: "rollup", label: "Rollup" }
];

/** CSS processors supported by `rails new -c` (plus a "none" default). */
export const CSS_PROCESSORS: SelectOption[] = [
  { value: "none", label: "None · plain CSS" },
  { value: "tailwind", label: "Tailwind CSS" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "bulma", label: "Bulma" },
  { value: "postcss", label: "PostCSS" },
  { value: "sass", label: "Sass" }
];

/** Stack posture options surfaced as a segmented control. */
export const POSTURES: SelectOption[] = [
  { value: "standard", label: "Standard", hint: "The full omakase stack." },
  {
    value: "api",
    label: "API only",
    hint: "Trimmed stack for JSON APIs · --api"
  },
  {
    value: "minimal",
    label: "Minimal",
    hint: "Bare essentials, skips most extras · --minimal"
  }
];

/** Rails source options surfaced as a segmented control. */
export const SOURCES: SelectOption[] = [
  { value: "stable", label: "Stable", hint: "The released Rails gem." },
  {
    value: "edge",
    label: "Edge",
    hint: "Tracks the 8-1-stable branch · --edge"
  },
  { value: "main", label: "Main", hint: "Tracks Rails main · --main" }
];

/** The full, grouped catalogue of toggleable features. */
export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "stack",
    index: "03",
    title: "The Stack",
    blurb:
      "The frameworks baked into every Rails app. Switch off what you won't ship.",
    features: [
      {
        id: "active_record",
        label: "Active Record",
        description: "ORM, migrations & queries",
        flag: "--skip-active-record",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "active_job",
        label: "Active Job",
        description: "Background job framework",
        flag: "--skip-active-job",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "active_storage",
        label: "Active Storage",
        description: "File uploads & attachments",
        flag: "--skip-active-storage",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "action_mailer",
        label: "Action Mailer",
        description: "Outbound email",
        flag: "--skip-action-mailer",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "action_mailbox",
        label: "Action Mailbox",
        description: "Inbound email routing",
        flag: "--skip-action-mailbox",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "action_text",
        label: "Action Text",
        description: "Rich text content",
        flag: "--skip-action-text",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "action_cable",
        label: "Action Cable",
        description: "WebSockets & real-time",
        flag: "--skip-action-cable",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "hotwire",
        label: "Hotwire",
        description: "Turbo + Stimulus",
        flag: "--skip-hotwire",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "jbuilder",
        label: "Jbuilder",
        description: "JSON view templates",
        flag: "--skip-jbuilder",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "asset_pipeline",
        label: "Asset Pipeline",
        description: "Propshaft asset serving",
        flag: "--skip-asset-pipeline",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "javascript",
        label: "JavaScript",
        description: "Bundling & importmaps",
        flag: "--skip-javascript",
        emitWhenOff: true,
        defaultOn: true
      }
    ]
  },
  {
    id: "tooling",
    index: "04",
    title: "Quality & Tooling",
    blurb: "The default toolbelt for tests, linting and security.",
    features: [
      {
        id: "test",
        label: "Test Suite",
        description: "Minitest scaffolding",
        flag: "--skip-test",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "system_test",
        label: "System Tests",
        description: "Capybara browser tests",
        flag: "--skip-system-test",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "rubocop",
        label: "RuboCop",
        description: "Omakase linting rules",
        flag: "--skip-rubocop",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "brakeman",
        label: "Brakeman",
        description: "Static security analysis",
        flag: "--skip-brakeman",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "bundler_audit",
        label: "Bundler Audit",
        description: "Dependency CVE checks",
        flag: "--skip-bundler-audit",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "ci",
        label: "GitHub CI",
        description: "Actions workflow files",
        flag: "--skip-ci",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "bootsnap",
        label: "Bootsnap",
        description: "Boot-time caching",
        flag: "--skip-bootsnap",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "dev_gems",
        label: "Dev Gems",
        description: "web-console & friends",
        flag: "--skip-dev-gems",
        emitWhenOff: true,
        defaultOn: true
      }
    ]
  },
  {
    id: "deploy",
    index: "05",
    title: "Deploy & Infrastructure",
    blurb: "How the app boots, containerises and ships to production.",
    features: [
      {
        id: "docker",
        label: "Docker",
        description: "Dockerfile & entrypoint",
        flag: "--skip-docker",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "kamal",
        label: "Kamal",
        description: "Zero-downtime deploys",
        flag: "--skip-kamal",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "thruster",
        label: "Thruster",
        description: "HTTP/2 asset proxy",
        flag: "--skip-thruster",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "solid",
        label: "Solid Stack",
        description: "Cache, Queue & Cable on the DB",
        flag: "--skip-solid",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "devcontainer",
        label: "Dev Container",
        description: "VS Code dev container files",
        flag: "--devcontainer",
        emitWhenOff: false,
        defaultOn: false
      }
    ]
  },
  {
    id: "repo",
    index: "06",
    title: "Repository & Bundle",
    blurb: "What happens to source control and gems once files are written.",
    features: [
      {
        id: "git",
        label: "Git",
        description: "git init + .gitignore",
        flag: "--skip-git",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "bundle",
        label: "Bundle Install",
        description: "Run bundler after generating",
        flag: "--skip-bundle",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "keeps",
        label: ".keep Files",
        description: "Track otherwise-empty dirs",
        flag: "--skip-keeps",
        emitWhenOff: true,
        defaultOn: true
      },
      {
        id: "decrypted_diffs",
        label: "Decrypted Diffs",
        description: "git diff of encrypted credentials",
        flag: "--skip-decrypted-diffs",
        emitWhenOff: true,
        defaultOn: true
      }
    ]
  }
];

/** Flat lookup of every feature by id, built once at module load. */
const FEATURE_INDEX: Map<string, FeatureFlag> = new Map(
  FEATURE_GROUPS.flatMap(group => group.features).map(f => [f.id, f])
);

/** Looks up a feature definition by its id. */
export function featureById(id: string): FeatureFlag | undefined {
  return FEATURE_INDEX.get(id);
}

/**
 * Builds the initial toggle state: every feature set to its {@link
 * FeatureFlag.defaultOn} value.
 */
export function defaultToggles(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const feature of FEATURE_INDEX.values()) {
    state[feature.id] = feature.defaultOn;
  }
  return state;
}

/** Resolves the label for a `value` within a list of {@link SelectOption}s. */
export function labelOf(options: SelectOption[], value: string): string {
  return options.find(o => o.value === value)?.label ?? value;
}

/**
 * Normalises a raw app-name input into a valid Rails application name.
 * Whitespace collapses to underscores; an empty value falls back to `my_app`.
 */
export function normalizeAppName(raw: string): string {
  const cleaned = raw.trim().replace(/\s+/g, "_");
  return cleaned.length > 0 ? cleaned : "my_app";
}

/** Whether a flag reads as an opt-out (`--skip-*`) or an opt-in addition. */
export type FlagKind = "config" | "skip";

/** A coloured token in the rendered command line. */
export interface CommandToken {
  /** The literal text of the token. */
  value: string;
  /** Syntax role used to colour the token. */
  kind: "base" | "name" | FlagKind;
}

/** A single active deviation from the omakase defaults, shown as a chip. */
export interface ActiveFlag {
  /** Identifier understood by the page's `clearFlag` handler. */
  id: string;
  /** Human label for the chip. */
  label: string;
  /** The literal flag text. */
  flag: string;
  /** Whether this is an opt-out skip or an additive config flag. */
  kind: FlagKind;
}

/** The fully-derived result of {@link buildCommand}. */
export interface CommandBuild {
  /** Coloured tokens for rendering the command line. */
  tokens: CommandToken[];
  /** The plain-text command, ready to copy. */
  command: string;
  /** Every active deviation from defaults, in command order. */
  flags: ActiveFlag[];
}

/** All user-selected inputs needed to build a command. */
export interface GeneratorState {
  /** Raw application name from the text field. */
  name: string;
  /** Selected database driver. */
  database: string;
  /** Selected JavaScript approach. */
  javascript: string;
  /** Selected CSS processor. */
  css: string;
  /** Selected stack posture. */
  posture: Posture;
  /** Selected Rails source. */
  source: Source;
  /** Per-feature toggle state keyed by {@link FeatureFlag.id}. */
  toggles: Record<string, boolean>;
}

/** Classifies a flag string as a skip opt-out or an additive config flag. */
function flagKind(flag: string): FlagKind {
  return flag.startsWith("--skip-") ? "skip" : "config";
}

/**
 * Builds the `rails new` command from the current generator state.
 *
 * Defaults are omitted for a clean, idiomatic command: SQLite, importmap,
 * no CSS processor, the standard stack and the stable gem all produce no
 * flags. Database and JavaScript flags are suppressed when their underlying
 * framework is skipped, since Rails would ignore them.
 *
 * @param state - The current UI selections.
 * @returns Coloured tokens, the copyable string, and the active-flag list.
 * @example
 * buildCommand({ name: "blog", database: "postgresql", javascript: "importmap",
 *   css: "tailwind", posture: "standard", source: "stable", toggles }).command
 * // "rails new blog -d postgresql -c tailwind"
 */
export function buildCommand(state: GeneratorState): CommandBuild {
  const tokens: CommandToken[] = [
    { value: "rails", kind: "base" },
    { value: "new", kind: "base" }
  ];
  const flags: ActiveFlag[] = [];

  tokens.push({ value: normalizeAppName(state.name), kind: "name" });

  const activeRecordOn = state.toggles.active_record !== false;
  const javascriptOn = state.toggles.javascript !== false;

  /** Pushes a flag as both a coloured token and an {@link ActiveFlag} chip. */
  const add = (id: string, flag: string, label: string): void => {
    const kind = flagKind(flag);
    tokens.push({ value: flag, kind });
    flags.push({ id, flag, label, kind });
  };

  if (activeRecordOn && state.database !== "sqlite3") {
    add(
      "db",
      `-d ${state.database}`,
      `Database · ${labelOf(DATABASES, state.database)}`
    );
  }

  if (javascriptOn && state.javascript !== "importmap") {
    add(
      "js",
      `-j ${state.javascript}`,
      `JavaScript · ${labelOf(JS_APPROACHES, state.javascript)}`
    );
  }

  if (state.css !== "none") {
    add(
      "css",
      `-c ${state.css}`,
      `CSS · ${labelOf(CSS_PROCESSORS, state.css)}`
    );
  }

  if (state.posture !== "standard") {
    add(
      "posture",
      `--${state.posture}`,
      `Posture · ${labelOf(POSTURES, state.posture)}`
    );
  }

  if (state.source !== "stable") {
    add(
      "source",
      `--${state.source}`,
      `Source · ${labelOf(SOURCES, state.source)}`
    );
  }

  for (const group of FEATURE_GROUPS) {
    for (const feature of group.features) {
      const on = state.toggles[feature.id] ?? feature.defaultOn;
      const emit = feature.emitWhenOff ? !on : on;

      if (emit) add(feature.id, feature.flag, feature.label);
    }
  }

  const command = tokens.map(token => token.value).join(" ");
  return { tokens, command, flags };
}
