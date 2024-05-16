const day = 24 * 60 * 60;
const week = 7 * day;
const month = 30 * day;
const tge = 1711447200;//26.03.2024 10 AM GMT
const custom1 = 1715335200;//10.05.2024 10 AM GMT

module.exports = {
    100: {
        "name": "Equity",
        "tgePercent": 0,
        "cliffDuration": 6 * month,
        "vestingDuration": 60 * month,
        "initTimestamp": tge
    },
    200: {
        "name": "Service Providers 1-2, Direct Angels",
        "tgePercent": 1,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    201: {
        "name": "Service Providers 1-2, Direct Angels",
        "tgePercent": 1,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    202: {
        "name": "Service Providers 1-2, Direct Angels",
        "tgePercent": 1,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    203: {
        "name": "Service Providers 1-2, Direct Angels",
        "tgePercent": 1,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    204: {
        "name": "Service Providers 1-2, Direct Angels",
        "tgePercent": 1,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    205: {
        "name": "Service Providers 1-2, Direct Angels",
        "tgePercent": 1,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    206: {
        "name": "Service Providers 1-2, Direct Angels",
        "tgePercent": 1,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    300: {
        "name": "Corporate and Advisors",
        "tgePercent": 0,
        "cliffDuration": 3 * month,
        "vestingDuration": 18 * month,
        "initTimestamp": tge
    },
    301: {
        "name": "Corporate and Advisors 2 - Special Vesting",
        "tgePercent": 100 / 9,
        "cliffDuration": 1 * month,
        "vestingDuration": 12 * month,
        "initTimestamp": tge
    },
    302: {
        "name": "Corporate and Advisors 2 - Special Vesting",
        "tgePercent": 100,
        "cliffDuration": 0 * month,
        "vestingDuration": 0 * month,
        "initTimestamp": tge + 1 * month
    },
    400: {
        "name": "Community and Marketing",
        "tgePercent": 2.5,
        "cliffDuration": 0 * month,
        "vestingDuration": 24 * month,
        "initTimestamp": tge
    },
    500: {
        "name": "Development",
        "tgePercent": 0,
        "cliffDuration": 6 * month,
        "vestingDuration": 48 * month,
        "initTimestamp": tge
    },
    600: {
        "name": "Treasury",
        "tgePercent": 0,
        "cliffDuration": 0 * month,
        "vestingDuration": 48 * month,
        "initTimestamp": tge
    },
    700: {
        "name": "Team",
        "tgePercent": 0,
        "cliffDuration": 12 * month,
        "vestingDuration": 60 * month,
        "initTimestamp": tge
    },
    800: {
        "name": "Community and Web 3 Marketing (B)",
        "tgePercent": 2.5,
        "cliffDuration": 0 * month,
        "vestingDuration": 24 * month,
        "initTimestamp": tge
    },
    900: {
        "name": "Seed (VCs)",
        "tgePercent": 0,
        "cliffDuration": 5 * month,
        "vestingDuration": 28 * month,
        "initTimestamp": tge
    },
    1000: {
        "name": "Private 1 and Private 2 (VCs)",
        "tgePercent": 0,
        "cliffDuration": 3 * month,
        "vestingDuration": 24 * month,
        "initTimestamp": tge
    },
    1100: {
        "name": "Private 3 (VCs)",
        "tgePercent": 0,
        "cliffDuration": 2 * month,
        "vestingDuration": 18 * month,
        "initTimestamp": tge
    }
}
