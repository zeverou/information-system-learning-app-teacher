import { Component } from "~/model/Component";

export const tlacitkoUlozitJidloKomponenta = new Component({
  id: "btn-ulozit-jidlo",
  name: "Tlačítko – Uložit jídlo",
  tags: ["jídla"],
  description: "Tlačítko pro uložení nového jídla.",

  html: `
<button id="system-btn_ulozit_jidlo" class="btn-uspech" stav_tlacitka>Uložit jídlo</button>
`,

  css: `
.btn-uspech { background: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
.btn-uspech:disabled { background: #9ca3af; cursor: not-allowed; opacity: 0.65; }
`,

  js: `const je_nazev_validni = vstup_nazev_jidla.trim().length > 0;
const stav_tlacitka = je_nazev_validni ? "" : "disabled";`,
  sql: {},
  sql_click: {
    vlozitJidlo: `INSERT INTO jidla (jmeno, doba_podavani) VALUES ('vstup_nazev_jidla', 'vstup_doba_podavani')`
  },
});
