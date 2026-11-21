/**
 * Content for /homelab and the featured Homelab1 card on /.
 * Public page: no IPs, hostnames, ports, paths, usernames or compose details.
 */

export type RoadmapStatus = "done" | "in-progress" | "planned";

/** `value` + " " + `label` reads as the stat sentence verbatim. */
export interface HomelabStat {
  value: string;
  label: string;
}

export interface StackRow {
  layer: string;
  tool: string;
  why: string;
}

export interface Decision {
  title: string;
  body: string;
}

export interface IncidentField {
  label: string;
  text: string;
}

export interface Incident {
  title: string;
  fields: IncidentField[];
}

export interface RoadmapItem {
  name: string;
  detail?: string;
  status: RoadmapStatus;
}

export const HOMELAB_META = {
  href: "/homelab",
  title: "Homelab1 — Emilio Arango",
  description:
    "How I run a 2018 Mac mini like production: declarative config, monitoring, backups, and changes I can roll back.",
};

export const HOMELAB_HERO = {
  kicker: "Case study",
  title: "Homelab1: a 2018 Mac mini, run like production.",
  subtitle:
    "I built a small self-hosted platform for media, monitoring and automation to practice the operations discipline I use at work: declarative config, monitoring, backups, and changes I can roll back.",
};

export const HOMELAB_STATS: HomelabStat[] = [
  { value: "14", label: "containers running" },
  { value: "16", label: "health monitors" },
  { value: "Weekly", label: "automated backups" },
  { value: "5-min", label: "external heartbeat" },
  { value: "Recovers unattended", label: "from a reboot in ~2 min" },
];

export const HOMELAB_ARCHITECTURE = {
  caption:
    "Internet to fiber router; a 10G link to the NAS and a 2.5G link to the Homelab1 Mac mini running Docker.",
  notes: [
    "Remote access is Tailscale only, with no open ports.",
    "Alerts: Uptime Kuma + healthchecks.io → Discord.",
  ],
};

export const HOMELAB_STACK: StackRow[] = [
  {
    layer: "Runtime",
    tool: "Docker Compose, one project per stack",
    why: "A failure stays inside its own stack, and each stack can be redeployed on its own",
  },
  {
    layer: "Media",
    tool: "Plex + Jellyfin",
    why: "Serves my Blu-ray collection; Jellyfin is the open-source fallback",
  },
  {
    layer: "Monitoring",
    tool: "Uptime Kuma, Prometheus, Grafana",
    why: "Service health, metrics and history",
  },
  {
    layer: "Alerting",
    tool: "Discord + healthchecks.io",
    why: "Alerts reach me in a channel I actually watch",
  },
  {
    layer: "Access",
    tool: "Tailscale",
    why: "Remote admin without exposing anything to the internet",
  },
  {
    layer: "Config",
    tool: "Private Git repo",
    why: "The repo is the source of truth for the box",
  },
];

export const HOMELAB_DECISIONS: Decision[] = [
  {
    title: "No auto-deploy.",
    body: "Changes go out from my workstation over SSH, one stack at a time, as a dry run by default. The server holds no Git credentials. Tradeoff: slower than CI, and nothing changes without my approval.",
  },
  {
    title: "A heartbeat that can't lie.",
    body: "Every 5 minutes a cron job pings an external service, but only if local monitoring answers. If the box, the network or the monitor dies, I get paged from outside. A watchdog running on the box it watches can't report its own death.",
  },
  {
    title: "Monitors tiered by impact.",
    body: "Every check is tagged critical, standard or family-facing, so I know what's actually urgent when something goes red.",
  },
  {
    title: "Backups with rotation.",
    body: "Weekly jobs stop the affected containers for a moment, archive config and data, and keep the last four. Known gap: they still live on the same disk until the NAS migration is done.",
  },
  {
    title: "Built to recover unattended.",
    body: "Auto-restart after power failure plus container restart policies. A planned reboot to test it brought the full stack back in about 2 minutes, with no hands on it.",
  },
  {
    title: "Secrets out of the repo.",
    body: "Credentials live in .env files that are never committed.",
  },
];

export const HOMELAB_INCIDENT: Incident = {
  title: "The DNS outage",
  fields: [
    {
      label: "What happened",
      text: "An update to my Pi-hole (network DNS) broke resolution for the whole house.",
    },
    {
      label: "Impact",
      text: "Total network outage; recovering meant removing it and resetting network settings.",
    },
    {
      label: "Root cause",
      text: "A single point of failure. Every device depended on one DNS box, with no fallback.",
    },
    {
      label: "What I changed",
      text: "The redesign keeps DNS isolated from the rest of the lab, puts a fallback resolver in place, and was written and reviewed as a plan before anything was deployed.",
    },
  ],
};

export const HOMELAB_ROADMAP: RoadmapItem[] = [
  {
    name: "NAS migration",
    detail: "Move media and storage off the mini, take backups off the box",
    status: "in-progress",
  },
  { name: "UPS + graceful shutdown", status: "planned" },
  { name: "Isolated Pi-hole with failover DNS", status: "planned" },
  { name: "Mini rack", status: "planned" },
  { name: "Home Assistant", status: "planned" },
  { name: "UniFi networking", status: "planned" },
];

export const ROADMAP_STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: "Done",
  "in-progress": "In progress",
  planned: "Planned",
};

export const HOMELAB_FOOTER_LINE =
  "Config lives in a private repository. Happy to walk through it in an interview.";

export const HOMELAB_CARD = {
  title: "Homelab1",
  summary: "A self-hosted platform run like production.",
  stats: "14 containers · 16 health monitors · 5-min external heartbeat",
  tags: ["Docker", "Monitoring", "Automation", "Networking"],
  linkLabel: "Read the case study",
  href: "/homelab",
};
