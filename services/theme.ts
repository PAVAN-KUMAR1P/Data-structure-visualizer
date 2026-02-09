/**
 * 🌿 Soft Mint Learning Theme
 * Philosophy: "Learning without stress"
 * 
 * This theme is designed to:
 * - Reduce visual anxiety
 * - Slow the user down cognitively
 * - Make algorithms feel approachable, not intimidating
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1️⃣ BACKGROUND & CANVAS (Mental Calm Layer)
// ═══════════════════════════════════════════════════════════════════════════════

export const BACKGROUND = '#F0FDFA';  // Soft Mint - associated with clarity and freshness
export const CANVAS = '#FFFFFF';       // Pure White - mimics classroom boards

// ═══════════════════════════════════════════════════════════════════════════════
// 2️⃣ TEXT & STRUCTURE (Authority Without Harshness)
// ═══════════════════════════════════════════════════════════════════════════════

export const TEXT_PRIMARY = '#064E3B';   // Deep Green - grounded and trustworthy
export const TEXT_SECONDARY = '#0F766E'; // Teal 700 - for subtitles
export const TEXT_MUTED = '#5EEAD4';     // Teal 300 - for hints
export const ACCENT = '#2DD4BF';         // Mint Teal - interactive but not aggressive

// ═══════════════════════════════════════════════════════════════════════════════
// 3️⃣ SEMANTIC ALGORITHM COLORS (MOST IMPORTANT)
// ═══════════════════════════════════════════════════════════════════════════════

/** 🔵 Active Node - "The algorithm is currently thinking about this node" */
export const ACTIVE = '#0EA5E9';         // Sky Blue - focus, logic, attention

/** 🟢 Visited Node - "This step is completed and correct" */
export const VISITED = '#22C55E';        // Soft Green - success, confirmation

/** 🟡 Highlight / Path - "Watch this path carefully" */
export const HIGHLIGHT = '#FBBF24';      // Warm Yellow - attracts attention without danger

/** 🔴 Error - "This action is invalid" */
export const ERROR = '#F87171';          // Soft Red - correction, not panic

/** ⚪ Default / Unvisited Node */
export const DEFAULT_NODE = '#E2E8F0';   // Slate 200 - neutral, waiting

// ═══════════════════════════════════════════════════════════════════════════════
// 4️⃣ NODE STYLES (Complete style objects for visualizers)
// ═══════════════════════════════════════════════════════════════════════════════

export const NODE_STYLES = {
    default: {
        fill: '#FFFFFF',
        stroke: '#94A3B8',      // Slate 400
        text: TEXT_PRIMARY,
        shadow: 'rgba(148, 163, 184, 0.3)',
        label: '',
    },
    active: {
        fill: '#F0F9FF',        // Sky 50
        stroke: ACTIVE,
        text: '#0369A1',        // Sky 700
        shadow: 'rgba(14, 165, 233, 0.4)',
        label: 'CURRENT',
    },
    visited: {
        fill: '#F0FDF4',        // Green 50
        stroke: VISITED,
        text: '#15803D',        // Green 700
        shadow: 'rgba(34, 197, 94, 0.3)',
        label: 'VISITED',
    },
    searching: {
        fill: '#FFFBEB',        // Amber 50
        stroke: HIGHLIGHT,
        text: '#B45309',        // Amber 700
        shadow: 'rgba(251, 191, 36, 0.4)',
        label: 'SEARCHING',
    },
    found: {
        fill: '#DCFCE7',        // Green 100
        stroke: VISITED,
        text: '#166534',        // Green 800
        shadow: 'rgba(34, 197, 94, 0.5)',
        label: 'FOUND',
    },
    processing: {
        fill: '#F0F9FF',        // Sky 50
        stroke: ACTIVE,
        text: '#0369A1',        // Sky 700
        shadow: 'rgba(14, 165, 233, 0.4)',
        label: 'ACTIVE',
    },
    new: {
        fill: '#ECFEFF',        // Cyan 50
        stroke: ACCENT,
        text: '#0E7490',        // Cyan 700
        shadow: 'rgba(45, 212, 191, 0.5)',
        label: 'NEW',
    },
    error: {
        fill: '#FEF2F2',        // Red 50
        stroke: ERROR,
        text: '#B91C1C',        // Red 700
        shadow: 'rgba(248, 113, 113, 0.4)',
        label: 'ERROR',
    },
    runner: {
        fill: '#FFF7ED',        // Orange 50
        stroke: '#F97316',      // Orange 500
        text: '#C2410C',        // Orange 700
        shadow: 'rgba(249, 115, 22, 0.4)',
        label: 'FAST PTR',
    },
    queued: {
        fill: '#FFFBEB',        // Amber 50
        stroke: HIGHLIGHT,
        text: '#B45309',        // Amber 700
        shadow: 'rgba(251, 191, 36, 0.3)',
        label: 'IN QUEUE',
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5️⃣ EDGE / CONNECTOR STYLES
// ═══════════════════════════════════════════════════════════════════════════════

export const EDGE_STYLES = {
    default: {
        stroke: '#CBD5E1',      // Slate 300
        width: 2,
        opacity: 0.8,
    },
    active: {
        stroke: ACTIVE,
        width: 3,
        opacity: 1,
    },
    path: {
        stroke: HIGHLIGHT,
        width: 3,
        opacity: 1,
    },
    visited: {
        stroke: VISITED,
        width: 2,
        opacity: 0.7,
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6️⃣ VOICE MIC STATES
// ═══════════════════════════════════════════════════════════════════════════════

export const MIC_STATES = {
    idle: {
        bg: ACCENT,
        text: '#FFFFFF',
        shadow: 'rgba(45, 212, 191, 0.4)',
    },
    listening: {
        bg: ACTIVE,
        text: '#FFFFFF',
        shadow: 'rgba(14, 165, 233, 0.5)',
    },
    success: {
        bg: VISITED,
        text: '#FFFFFF',
        shadow: 'rgba(34, 197, 94, 0.5)',
    },
    error: {
        bg: ERROR,
        text: '#FFFFFF',
        shadow: 'rgba(248, 113, 113, 0.5)',
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7️⃣ QUEUE / STACK VISUALIZATION (For BFS/DFS)
// ═══════════════════════════════════════════════════════════════════════════════

export const DATA_STRUCTURE_CONTAINER = {
    background: '#ECFEFF',      // Cyan 50
    border: ACCENT,
    text: TEXT_PRIMARY,
    activeItem: ACTIVE,
};

// ═══════════════════════════════════════════════════════════════════════════════
// 8️⃣ UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export const UI = {
    card: {
        background: '#FFFFFF',
        border: '#E2E8F0',       // Slate 200
        shadow: 'rgba(148, 163, 184, 0.15)',
    },
    button: {
        primary: {
            bg: ACCENT,
            text: '#FFFFFF',
            hover: '#14B8A6',    // Teal 500
        },
        secondary: {
            bg: '#F1F5F9',       // Slate 100
            text: TEXT_PRIMARY,
            hover: '#E2E8F0',    // Slate 200
        },
    },
    input: {
        bg: '#FFFFFF',
        border: '#CBD5E1',       // Slate 300
        focus: ACCENT,
        text: TEXT_PRIMARY,
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 9️⃣ ANIMATION DURATIONS (For consistency)
// ═══════════════════════════════════════════════════════════════════════════════

export const ANIMATION = {
    nodePulse: '0.8s',
    nodeFadeIn: '0.4s',
    glowFade: '0.6s',
    errorShake: '0.3s',
    hoverScale: 1.04,
    activeScale: 1.08,
};
