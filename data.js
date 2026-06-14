/**
 * data.js — Monika Makeovers
 * All package definitions and pricing defaults.
 * Edit this file to update services or default rates.
 */

const PKGS = {
  bridal: {
    label: "Bridal Package",
    color: "#993556",
    bg: "#fbeaf0",
    fields: [
      { k: "look",   l: "Bridal look",        d: 18000 },
      { k: "trial",  l: "Pre-bridal trial",    d: 5000  },
      { k: "draping",l: "Draping",             d: 800   },
    ],
    qty: false,
    guestField: false,
    artistField: false,
  },
  hd: {
    label: "HD Guest Makeup",
    color: "#2b6070",
    bg: "#e0f0f3",
    fields: [
      { k: "full",      l: "Full look (HD)",        d: 7500 },
      { k: "mkp",       l: "Only makeup (HD)",       d: 6000 },
      { k: "hair",      l: "Hairstyle",              d: 1500 },
      { k: "drape",     l: "Draping",                d: 800  },
      { k: "mkpDrape",  l: "Makeup + Draping",       d: 6500 },
      { k: "hairDrape", l: "Hair + Draping",          d: 2000 },
    ],
    qty: true,
    note: "False eyelashes & lenses included.",
    guestField: false,
    artistField: false,
  },
  basic: {
    label: "Basic Guest Makeup",
    color: "#854F0B",
    bg: "#faeeda",
    fields: [
      { k: "full",      l: "Full look (Basic)",      d: 4500 },
      { k: "mkp",       l: "Only makeup (Basic)",    d: 3000 },
      { k: "hair",      l: "Hairstyle",              d: 1500 },
      { k: "drape",     l: "Draping",                d: 800  },
      { k: "mkpDrape",  l: "Makeup + Draping",       d: 3500 },
      { k: "hairDrape", l: "Hair + Draping",          d: 2000 },
    ],
    qty: true,
    guestField: false,
    artistField: false,
  },
  special: {
    label: "Special Guest Price",
    color: "#3a7d8c",
    bg: "#e0f0f3",
    fields: [
      { k: "special", l: "Special look", d: 0 },
    ],
    qty: true,
    guestField: false,
    artistField: false,
  },
  salon: {
    label: "Salon Package",
    color: "#534AB7",
    bg: "#eeedfe",
    fields: [
      { k: "pkg", l: "Package price (total)", d: 0 },
    ],
    qty: false,
    guestField: true,
    artistField: false,
  },
  artist: {
    label: "Per Artist Rate",
    color: "#3B6D11",
    bg: "#eaf3de",
    fields: [
      { k: "rate", l: "Rate per artist", d: 0 },
    ],
    qty: false,
    guestField: false,
    artistField: true,
  },
};

/* Contact info shown in receipt footer — edit to customise */
const CONTACT = {
  phone1: "+91-8107654303",
  phone2: "+91-9886008604",
  tagline: "Thank you for choosing us ✦",
};
