// Ubuntu Competitive Dashboard — prototype data
// Representative competitive-intelligence content for a Canonical PMM view.
// Ubuntu Platform tab is aimed at DESKTOP competitors (Windows, Fedora
// Workstation, Pop!_OS, Linux Mint, ChromeOS Flex). Content is illustrative
// but grounded in real 2025-2026 trends; treat timestamps as placeholders.

export type PulseItem = {
  competitor: string;
  move: string;
  impact: string;
  freshness: string;
};

export type Highlight = {
  claim: string;
  breakdown: string[];
};

export type SignalCard = {
  tag: string; // competitor name OR trend tag
  isTrend?: boolean;
  sourceType: string;
  sourceDomain: string;
  sourceUrl: string;
  freshness: string;
  ageDays: number; // for sorting
  headline: string;
  highlights: Highlight[];
};

export type TabData = {
  pulse: PulseItem[];
  signals: SignalCard[];
  pmm: {
    header: string;
    actions: string[];
  };
};

const intelligenceData: Record<"Ubuntu Platform" | "IoT & Devices", TabData> = {
  "Ubuntu Platform": {
    pulse: [
      {
        competitor: "Microsoft Windows 11",
        move: "Windows 10 end-of-support drives enterprise desktop migration reviews",
        impact:
          "Widest Linux-desktop evaluation window in years; Ubuntu Desktop + ADsys is the managed answer",
        freshness: "6h ago",
      },
      {
        competitor: "Pop!_OS (System76)",
        move: "COSMIC desktop ships stable in Pop!_OS 24.04 LTS, now on point releases",
        impact:
          "A polished Rust dev-workstation rival — but still no fleet-management or MDM story",
        freshness: "1 day ago",
      },
      {
        competitor: "Fedora Workstation",
        move: "Stays GNOME-first with no managed-desktop tooling for fleets",
        impact:
          "Ubuntu Desktop + ADsys / Landscape remains the only turnkey managed Linux desktop",
        freshness: "2 days ago",
      },
      {
        competitor: "Linux Mint",
        move: "Holds the top DistroWatch spot as the default Windows alternative",
        impact:
          "Built on Ubuntu LTS — validates the base; Canonical still owns the enterprise + support tier",
        freshness: "3 days ago",
      },
    ],
    signals: [
      {
        tag: "Microsoft Windows 11",
        sourceType: "Sysadmin Forum",
        sourceDomain: "reddit.com/r/sysadmin",
        sourceUrl: "https://www.reddit.com/r/sysadmin",
        freshness: "5h ago",
        ageDays: 0,
        headline: "Windows 10 EOL pushes teams to trial Linux desktops for dev fleets",
        highlights: [
          {
            claim: "End of Windows 10 support is forcing hardware and OS decisions",
            breakdown: [
              "Machines that fail Windows 11's TPM / CPU requirements face replacement or a switch",
              "Engineering orgs piloting Ubuntu Desktop instead of buying new Windows hardware",
            ],
          },
          {
            claim: "Managed-desktop parity is the deciding question before standardizing",
            breakdown: [
              "Teams need AD / Group Policy enforcement before they'll commit a fleet to Linux",
              "Ubuntu's ADsys ships native GPO / AD integration — the differentiator vs other distros",
            ],
          },
          {
            claim: "Certified hardware lowers the perceived switching risk",
            breakdown: [
              "Ubuntu Desktop is certified across Dell, Lenovo, and HP with one image",
              "A single supported LTS image beats per-machine Windows licensing math",
            ],
          },
        ],
      },
      {
        tag: "Pop!_OS (System76)",
        sourceType: "Rival Dev Hub",
        sourceDomain: "system76.com/blog",
        sourceUrl: "https://system76.com/blog",
        freshness: "1 day ago",
        ageDays: 1,
        headline: "COSMIC ships stable, raising the bar on the Linux dev workstation",
        highlights: [
          {
            claim: "COSMIC left alpha and shipped in Pop!_OS 24.04 LTS, now on stable releases",
            breakdown: [
              "Rust-based, tiling-first desktop that is winning real developer mindshare",
              "This is a genuine dev-workstation competitor now, not a roadmap promise",
            ],
          },
          {
            claim: "Still no enterprise-management or MDM story",
            breakdown: [
              "No AD / LDAP policy layer, no fleet-management hooks, no Group Policy equivalent",
              "Ubuntu Desktop + ADsys + Landscape remains the only managed-desktop path",
            ],
          },
          {
            claim: "Hardware coupling limits enterprise reach",
            breakdown: [
              "Best experience is tied to System76 hardware; enterprise fleets are heterogeneous",
              "Certified Ubuntu Desktop spans Dell / Lenovo / HP with the same supported image",
            ],
          },
        ],
      },
      {
        tag: "Fedora Workstation",
        sourceType: "Rival Dev Hub",
        sourceDomain: "fedoramagazine.org",
        sourceUrl: "https://fedoramagazine.org",
        freshness: "2 days ago",
        ageDays: 2,
        headline: "Fedora doubles down on desktop-first, leaves the fleet-management gap open",
        highlights: [
          {
            claim: "Roadmap centers on GNOME, Wayland, and immutable Atomic variants",
            breakdown: [
              "No managed-desktop or Group Policy tooling for the free workstation",
              "Nothing landing that closes the ADsys / Landscape gap for AD-joined fleets",
            ],
          },
          {
            claim: "Immutable Atomic variants stay niche in enterprise pilots",
            breakdown: [
              "rpm-ostree image builds still need bespoke CI plumbing",
              "Ubuntu's snap delivery is signed, delta-updated, and atomic without that overhead",
            ],
          },
          {
            claim: "Independent-vendor positioning is still an opening",
            breakdown: [
              "Post-IBM neutrality questions recur in community threads",
              "Canonical's independent stewardship is a trust talking point for regulated buyers",
            ],
          },
        ],
      },
      {
        tag: "Linux Mint",
        sourceType: "Infra Outlet",
        sourceDomain: "distrowatch.com",
        sourceUrl: "https://distrowatch.com",
        freshness: "3 days ago",
        ageDays: 3,
        headline: "Mint holds the top DistroWatch spot as the go-to Windows alternative",
        highlights: [
          {
            claim: "Mint stays the default recommendation for Windows switchers",
            breakdown: [
              "Cinnamon's familiar layout lowers the retraining cost coming from Windows",
              "Consistently near the top of DistroWatch page-hit rankings",
            ],
          },
          {
            claim: "Built on Ubuntu LTS — a competitor that validates the base",
            breakdown: [
              "Mint tracks Ubuntu 24.04 LTS packages and kernels underneath",
              "Every Mint install is downstream proof of Ubuntu's desktop foundation",
            ],
          },
          {
            claim: "No commercial support or managed-fleet layer",
            breakdown: [
              "Mint targets individuals, not AD-joined enterprise desktops",
              "Ubuntu Desktop + Pro + Landscape owns the enterprise tier Mint doesn't serve",
            ],
          },
        ],
      },
      {
        tag: "ChromeOS Flex",
        sourceType: "Rival Dev Hub",
        sourceDomain: "blog.google",
        sourceUrl: "https://blog.google",
        freshness: "4 days ago",
        ageDays: 4,
        headline: "ChromeOS Flex courts fleets repurposing aging Windows 10 hardware",
        highlights: [
          {
            claim: "Flex pitched as a managed second life for Windows-10-EOL machines",
            breakdown: [
              "Cloud-managed via the Google Admin console, strong in education and kiosks",
              "Competes for the same repurposed-hardware budget as Ubuntu Desktop",
            ],
          },
          {
            claim: "Locked to Google's cloud and app model",
            breakdown: [
              "Limited local and dev workflows next to a full Ubuntu Desktop",
              "No native Linux dev-workstation story for engineering teams",
            ],
          },
          {
            claim: "Ubuntu Desktop wins the developer and on-prem-managed seat",
            breakdown: [
              "Full local toolchains, snaps, and offline capability",
              "ADsys / Landscape give AD-native management without mandatory cloud lock-in",
            ],
          },
        ],
      },
      {
        tag: "Linux Desktop Momentum",
        isTrend: true,
        sourceType: "Infra Outlet",
        sourceDomain: "phoronix.com",
        sourceUrl: "https://www.phoronix.com",
        freshness: "5 days ago",
        ageDays: 5,
        headline: "Trackers show Linux desktop share ticking up through 2025-2026",
        highlights: [
          {
            claim: "Linux desktop share is crossing notable thresholds in market trackers",
            breakdown: [
              "Windows 10 EOL and Proton / gaming maturity cited as tailwinds",
              "Broadens the total addressable market for a managed Linux desktop",
            ],
          },
          {
            claim: "Developer workstations are leading the shift",
            breakdown: [
              "Container-native workflows and WSL fatigue favor native Linux",
              "Ubuntu's default-choice status among developers compounds the trend",
            ],
          },
          {
            claim: "A window to convert mindshare into managed deployments",
            breakdown: [
              "Individual adoption sits upstream of enterprise standardization",
              "ADsys + Landscape turn enthusiast installs into supported fleets",
            ],
          },
        ],
      },
    ],
    pmm: {
      header: "🎯 PORTFOLIO ACTION MOVE:",
      actions: [
        "Launch a 'Windows 10 EOL → managed Ubuntu Desktop' migration play: pair ADsys AD / Group-Policy parity with certified Dell, Lenovo, and HP hardware, targeting orgs replacing machines that fail Windows 11 requirements.",
        "Arm field engineers with a managed-desktop battle card against Pop!_OS, Fedora Workstation, and Linux Mint — lead with ADsys + Landscape as the only turnkey fleet-management and AD-integration story.",
        "Position Ubuntu Desktop + Pro against ChromeOS Flex for repurposed-hardware fleets: full local dev workflows and AD-native management without mandatory cloud lock-in.",
      ],
    },
  },

  "IoT & Devices": {
    pulse: [
      {
        competitor: "Wind River Linux",
        move: "Renews VxWorks-to-Linux migration push aimed at aerospace primes",
        impact: "Ubuntu Core's certified 10-yr lifecycle competes directly on safety-critical bids",
        freshness: "5h ago",
      },
      {
        competitor: "BalenaOS",
        move: "Pricing tiers restructured; free tier device cap tightened",
        impact: "Opens door for Landscape + Ubuntu Core in mid-scale fleet accounts",
        freshness: "1 day ago",
      },
      {
        competitor: "Microsoft Windows IoT",
        move: "IoT Enterprise LTSC 2024 slots into industrial edge refresh cycles",
        impact: "Ubuntu Core answers with lower footprint, snap delta updates, no CAL fees",
        freshness: "2 days ago",
      },
      {
        competitor: "AWS IoT Greengrass",
        move: "New Greengrass component model still assumes bespoke base OS",
        impact: "Ubuntu Core + snaps ships the missing signed, atomic OS layer underneath",
        freshness: "4 days ago",
      },
    ],
    signals: [
      {
        tag: "Wind River Linux",
        sourceType: "Rival Dev Hub",
        sourceDomain: "windriver.com/blog",
        sourceUrl: "https://www.windriver.com/blog",
        freshness: "6h ago",
        ageDays: 0,
        headline: "Wind River pitches Studio Linux for regulated edge, gaps remain on updates",
        highlights: [
          {
            claim: "Studio Linux positioned for aerospace and industrial safety workloads",
            breakdown: [
              "Marketing leans on cert pedigree from VxWorks heritage",
              "No mention of transactional/atomic update primitives in the announcement",
            ],
          },
          {
            claim: "Update story still centered on custom images, not signed deltas",
            breakdown: [
              "Contrast: Ubuntu Core snaps ship signed, delta-compressed, safe-rollback by default",
              "Fleet operators quantify Wind River update overhead in engineer-weeks per rollout",
            ],
          },
          {
            claim: "Pricing model gated by direct sales, slowing pilot velocity",
            breakdown: [
              "No self-serve on-ramp; hardware partners waiting weeks on quotes",
              "Canonical's Ubuntu Core + free tier remains the fastest path to a working pilot",
            ],
          },
        ],
      },
      {
        tag: "Yocto Project",
        sourceType: "Rival Dev Hub",
        sourceDomain: "lists.yoctoproject.org",
        sourceUrl: "https://lists.yoctoproject.org",
        freshness: "1 day ago",
        ageDays: 1,
        headline: "Meta-layer maintenance burden dominates recent OpenEmbedded discussions",
        highlights: [
          {
            claim: "Vendors report growing engineering cost to keep BSPs current",
            breakdown: [
              "Each kernel or toolchain bump cascades through custom meta-layers",
              "Small teams openly asking whether to abandon Yocto for a curated distro",
            ],
          },
          {
            claim: "CVE-backport workflow remains manual for most downstream builds",
            breakdown: [
              "No standard 'commercial steward' equivalent to Ubuntu Pro / ESM",
              "CRA compliance path unclear for products shipping bespoke Yocto images",
            ],
          },
          {
            claim: "Ubuntu Core increasingly cited as the 'we're done building an OS' option",
            breakdown: [
              "Snap-based delivery removes per-BSP kernel churn from vendor's plate",
              "Landscape + brand-store noted as the missing fleet-management layer Yocto lacks",
            ],
          },
        ],
      },
      {
        tag: "BalenaOS",
        sourceType: "Infra Outlet",
        sourceDomain: "balena.io/blog",
        sourceUrl: "https://blog.balena.io",
        freshness: "2 days ago",
        ageDays: 2,
        headline: "Balena tightens free-tier device caps, mid-scale fleets re-evaluate",
        highlights: [
          {
            claim: "Free tier device limit reduced; overage priced per-device per-month",
            breakdown: [
              "Hobbyist and lab fleets pushed onto paid tiers earlier than before",
              "Community threads asking for a self-hosted control-plane alternative",
            ],
          },
          {
            claim: "Balena's container model still runs atop an unmanaged host OS",
            breakdown: [
              "Ubuntu Core + snaps offers signed OS + app layer in one supported stack",
              "Landscape provides the fleet control-plane without per-device pricing",
            ],
          },
          {
            claim: "OEM conversations shifting toward vertically integrated Canonical stack",
            breakdown: [
              "Preference for one vendor across silicon enablement, OS, and updates",
              "Canonical's silicon partner program named as a differentiator on recent bids",
            ],
          },
        ],
      },
      {
        tag: "Microsoft Windows IoT",
        sourceType: "Infra Outlet",
        sourceDomain: "learn.microsoft.com",
        sourceUrl: "https://learn.microsoft.com/en-us/windows/iot",
        freshness: "3 days ago",
        ageDays: 3,
        headline: "Windows IoT Enterprise LTSC 2024 lands in industrial edge refresh RFPs",
        highlights: [
          {
            claim: "LTSC 2024 gives Microsoft a 10-year support story for industrial edge",
            breakdown: [
              "Directly targets HMIs, kiosks, and factory-floor controllers",
              "Ubuntu Core matches the 10-year lifecycle at a fraction of the footprint",
            ],
          },
          {
            claim: "CAL + licensing complexity still a friction point for OEMs",
            breakdown: [
              "Per-device licensing math opaque next to Ubuntu Core's free base tier",
              "OEMs cite BOM predictability as a Canonical advantage in fixed-price bids",
            ],
          },
          {
            claim: "Update semantics remain reboot-heavy vs. snap atomic rollbacks",
            breakdown: [
              "Field ops teams quantify downtime cost per update window",
              "Ubuntu Core's safe-rollback story lands especially well in 24/7 lines",
            ],
          },
        ],
      },
      {
        tag: "AWS IoT Greengrass",
        sourceType: "Infra Outlet",
        sourceDomain: "aws.amazon.com/blogs/iot",
        sourceUrl: "https://aws.amazon.com/blogs/iot/",
        freshness: "4 days ago",
        ageDays: 4,
        headline: "New Greengrass component model still assumes a customer-supplied base OS",
        highlights: [
          {
            claim: "Greengrass docs quietly recommend Ubuntu as the reference base OS",
            breakdown: [
              "Sample deployments and tutorials standardize on Ubuntu LTS images",
              "Reinforces default-choice status even inside AWS's own IoT narrative",
            ],
          },
          {
            claim: "No first-party answer for signed, atomic OS-layer updates",
            breakdown: [
              "Customers left to bolt on their own update infra beneath Greengrass",
              "Ubuntu Core snaps close that gap without additional tooling",
            ],
          },
          {
            claim: "Hybrid Greengrass + Landscape deployments emerging in the field",
            breakdown: [
              "Landscape managing OS + snaps, Greengrass managing app-tier components",
              "Joint reference architecture would accelerate co-sell conversations",
            ],
          },
        ],
      },
      {
        tag: "Azure IoT",
        sourceType: "Rival Dev Hub",
        sourceDomain: "learn.microsoft.com",
        sourceUrl: "https://learn.microsoft.com/en-us/azure/iot",
        freshness: "5 days ago",
        ageDays: 5,
        headline: "Azure IoT Operations pushes k8s-at-the-edge, raises the OS-layer bar",
        highlights: [
          {
            claim: "Azure IoT Operations assumes a hardened, updatable Linux base",
            breakdown: [
              "Reference stacks call for a signed OS with reliable rollback",
              "Ubuntu Core + MicroK8s is the cleanest match in the published guidance",
            ],
          },
          {
            claim: "Edge Kubernetes narrative widens the addressable Canonical stack",
            breakdown: [
              "MicroK8s + Charmed Kubernetes lift into edge conversations previously OS-only",
              "Landscape adds the multi-cluster fleet view Azure doesn't provide",
            ],
          },
          {
            claim: "CRA + supply-chain requirements strengthen the 'known base' argument",
            breakdown: [
              "Auditors want provenance from silicon through OS to workload",
              "Ubuntu's SBOM + snap signing chain answers that end-to-end",
            ],
          },
        ],
      },
    ],
    pmm: {
      header: "🎯 PORTFOLIO ACTION MOVE:",
      actions: [
        "Lead all Wind River and Windows IoT LTSC displacement bids with Ubuntu Core's 10-year lifecycle + snap atomic updates as the single differentiator, backed by Landscape as the fleet control-plane.",
        "Publish a 'Yocto exit path' migration guide and OEM playbook — position Ubuntu Core + brand store as the end of the meta-layer treadmill, especially for teams facing CRA obligations.",
        "Formalize a joint reference architecture with AWS Greengrass and Azure IoT Operations that names Ubuntu Core + MicroK8s as the recommended base, converting hyperscaler momentum into Canonical co-sell pipeline.",
      ],
    },
  },
};

export default intelligenceData;
