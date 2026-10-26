/* Project data — edit this file to update the site. */
window.PROJECTS = [
  {
    id: "deb2rpm",
    name: "deb2rpm",
    repo: "deb2rpm-gui",
    owner: "fakerdoeslinux",
    tagline: "Convert Debian packages to Fedora RPMs, natively.",
    description:
      "A native Qt6 app and CLI that turns .deb packages into installable Fedora RPMs — drag, drop, convert, install.",
    about:
      "deb2rpm wraps the usual alien, fakeroot, and rpm-build pipeline in a proper desktop app. Drop in a Debian package, queue up a batch, or drive everything from the terminal. Builds stay rootless, and the finished RPMs can go straight into dnf with one click.",
    icon: "deb2rpm",
    language: "Python",
    languageColor: "#3572A5",
    license: "MIT",
    branch: "main",
    pushedAt: "2026-10-25T01:29:33Z",
    stars: 0,
    forks: 0,
    tags: ["PyQt6", "Qt6", "alien", "RPM"],
    highlights: [
      "Drag and drop .deb files from Dolphin, Nautilus, or a browser",
      "Queue several packages and convert them in one batch",
      "Rootless builds via fakeroot — no sudo needed to convert",
      "Keep versions and maintainer scripts, or sanitize permissions",
      "Optional one-click dnf install through Polkit",
      "Full CLI mode for headless systems and scripts"
    ],
    commandLabel: "Install",
    command:
      "git clone https://github.com/fakerdoeslinux/deb2rpm-gui.git\ncd deb2rpm-gui\n./install.sh",
    note:
      "Needs alien, fakeroot, rpm-build, and python3-pyqt6. The app offers to install anything that is missing.",
    primaryLabel: "View on GitHub",
    liveUrl: null
  },
  {
    id: "voicefx",
    name: "VoiceFX",
    repo: "voicefx-voicemod-for-linux",
    owner: "fakerdoeslinux",
    tagline: "Real-time voice effects, natively on PipeWire.",
    description:
      "A GTK voice changer for Fedora with clean, robot, radio, and echo effects, a soundboard, and its own PipeWire virtual microphone.",
    about:
      "VoiceFX processes your microphone in real time and publishes its own PipeWire devices: one for monitoring, one as a virtual mic for Discord or any other call app. Change effects mid-call, fire off soundboard clips, and let VoiceFX restore your original routing when you stop. It is an independent project, not affiliated with Voicemod.",
    icon: "voicefx",
    language: "Python",
    languageColor: "#3572A5",
    license: "MIT",
    branch: "main",
    pushedAt: "2026-10-24T05:40:38Z",
    stars: 1,
    forks: 0,
    tags: ["GTK", "PipeWire", "GStreamer", "Soundboard"],
    highlights: [
      "Four live effects: clean, robot, radio, and echo",
      "Creates VoiceFX_Output and VoiceFX_Microphone on its own",
      "Soundboard with play, stop, and loop for WAV and other formats",
      "Routes an open call's microphone, then restores it on stop",
      "Keeps running in the tray when the window is closed",
      "Packaged as an RPM for Fedora 44, with a CLI processor"
    ],
    commandLabel: "Install",
    command:
      "sudo dnf install https://github.com/fakerdoeslinux/voicefx-voicemod-for-linux/releases/download/v0.7.0/voicemod-for-linux-0.7.0-1.fc44.noarch.rpm",
    note:
      "Independent and unofficial — not a port of Voicemod, and not affiliated with it. Use headphones to avoid feedback.",
    primaryLabel: "View on GitHub",
    liveUrl: null
  },
  {
    id: "veltris",
    name: "Veltris",
    repo: "veltris",
    owner: "fakerhog15",
    tagline: "A fast Puyo-style puzzler for the browser.",
    description:
      "Chain four or more blocks, stack combos, and chase a high score in a sharp Puyo-style puzzler with retro CRT filters. No install.",
    about:
      "Veltris is a one-canvas puzzle game written in plain JavaScript. Blocks fall in pairs; line up four or more to pop them, then let the cascade build chains and multiply your score. Three difficulty levels change how many colors appear and how fast pieces drop, while WebGPU and WebGL display filters add CRT and RF looks when you want them.",
    icon: "veltris",
    language: "JavaScript",
    languageColor: "#F1E05A",
    license: null,
    branch: "main",
    pushedAt: "2026-10-14T06:06:50Z",
    stars: 0,
    forks: 0,
    tags: ["Canvas", "WebGPU", "WebGL", "Puzzle"],
    highlights: [
      "Match four or more blocks and chain clears for big scores",
      "Easy, medium, and hard modes with 4, 6, or 14 colors",
      "Next-three queue, hold slot, and ghost piece",
      "WebGPU (Vulkan) and WebGL CRT / RF display filters",
      "SNES-style synth sound effects",
      "Touch controls for mobile play"
    ],
    commandLabel: "Play",
    command: "https://fakerhog15.github.io/veltris/",
    note:
      "Runs entirely in the browser. Add ?mode=easy, ?mode=medium, or ?mode=hard to its URL to pick a difficulty up front.",
    primaryLabel: "Play now",
    liveUrl: "https://fakerhog15.github.io/veltris/"
  },
  {
    id: "appimage",
    name: "AppImage Installer",
    repo: "appimage-installer",
    owner: "fakerdoeslinux",
    tagline: "Give any AppImage a proper home on your desktop.",
    description:
      "A tiny user-local installer that copies an AppImage into your home directory and creates an app-menu launcher — no root.",
    about:
      "A single shell script with a graphical file picker. AppImage Installer copies an AppImage into ~/.local/opt/appimages, writes a .desktop launcher into ~/.local/share/applications, and adds itself to the app menu the first time it runs. Nothing system-wide, no root, and nothing to uninstall beyond the files it created.",
    icon: "appimage",
    language: "Shell",
    languageColor: "#89E051",
    license: null,
    branch: "master",
    pushedAt: "2026-10-24T03:13:02Z",
    stars: 0,
    forks: 0,
    tags: ["Shell", "KDE", "Dolphin", "No root"],
    highlights: [
      "Point-and-click file picker on KDE, with zenity elsewhere",
      "Installs per-user under ~/.local — no root required",
      "Creates an app-menu launcher for every AppImage",
      "Adds itself to the app menu on the first launch",
      "Plain shell in one readable file",
      "Uninstall by deleting the files it created"
    ],
    commandLabel: "Install",
    command:
      "git clone https://github.com/fakerdoeslinux/appimage-installer.git\ncd appimage-installer\n./install-appimage.sh",
    note:
      "No downloads: it installs AppImages you already have. Get those from a source you trust.",
    primaryLabel: "View on GitHub",
    liveUrl: null
  }
];
