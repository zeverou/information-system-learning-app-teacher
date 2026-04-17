import { Component } from "~/model/Component";

export const tlacitkoUlozitVedoucihoKomponenta = new Component({
  id: "btn-ulozit-vedouciho",
  name: "Tlačítko – Uložit vedoucího",
  tags: ["vedoucí"],
  description: "Tlačítko pro uložení nového vedoucího.",

  html: `
<button id="system-btn_ulozit_vedouciho" class="btn-uspech" stav_tlacitka>Uložit vedoucího</button>
`,

  css: `
.btn-uspech { background: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
.btn-uspech:disabled { background: #9ca3af; cursor: not-allowed; opacity: 0.65; }
`,

  js: `const je_jmeno_validni = vstup_jmeno_vedouciho.trim().split(" ").filter(Boolean).length === 2;
const je_validni_email = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(vstup_email_vedouciho);
const je_cislo_validni = /^\\+?[0-9\\s]{9,20}$/.test(vstup_telefon_vedouciho);
const je_adresa_validni = /^\\S.+\\s+\\d+[a-zA-Z]?\\s*,\\s*\\S.+\\s*,\\s*\\d{3}\\s?\\d{2}$/.test(vstup_adresa_vedouciho.trim());
const je_vek_validni = Number(vstup_vek_vedouciho) >= 18 && Number(vstup_vek_vedouciho) <= 99;
const stav_tlacitka = je_jmeno_validni && je_validni_email && je_cislo_validni && je_adresa_validni && je_vek_validni ? "" : "disabled";`,
  sql: {},
  sql_click: {
    vlozitVedouciho: `INSERT INTO vedouci (jmeno, email, telefon, adresa, vek) VALUES ('vstup_jmeno_vedouciho', 'vstup_email_vedouciho', 'vstup_telefon_vedouciho', 'vstup_adresa_vedouciho', vstup_vek_vedouciho)`
  },
});
