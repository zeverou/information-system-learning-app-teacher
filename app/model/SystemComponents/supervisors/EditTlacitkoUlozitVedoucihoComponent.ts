import { Component } from "~/model/Component";

export const editTlacitkoUlozitVedoucihoKomponenta = new Component({
  id: "edit-btn-ulozit-vedouciho",
  name: "Tlačítko – Upravit vedoucího",
  tags: ["vedoucí"],
  description: "Tlačítko pro uložení změn existujícího vedoucího. Vyžaduje generalVariable: idVedouciho.",

  html: `
<button id="system-edit_btn_ulozit_vedouciho" class="btn-uspech" stav_tlacitka>Upravit vedoucího</button>
`,

  css: `
.btn-uspech { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
.btn-uspech:disabled { background: #9ca3af; cursor: not-allowed; opacity: 0.65; }
`,

  js: `const je_jmeno_validni = edit_vstup_jmeno_vedouciho.trim().split(" ").filter(Boolean).length === 2;
const je_validni_email = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(edit_vstup_email_vedouciho);
const je_cislo_validni = /^\\+?[0-9\\s]{9,20}$/.test(edit_vstup_telefon_vedouciho);
const je_adresa_validni = /^\\S.+\\s+\\d+[a-zA-Z]?\\s*,\\s*\\S.+\\s*,\\s*\\d{3}\\s?\\d{2}$/.test(edit_vstup_adresa_vedouciho.trim());
const je_vek_validni = Number(edit_vstup_vek_vedouciho) >= 18 && Number(edit_vstup_vek_vedouciho) <= 99;
const stav_tlacitka = je_jmeno_validni && je_validni_email && je_cislo_validni && je_adresa_validni && je_vek_validni ? "" : "disabled";`,
  sql: {},
  sql_click: {
    upravitVedouciho: `UPDATE vedouci SET jmeno = 'edit_vstup_jmeno_vedouciho', email = 'edit_vstup_email_vedouciho', telefon = 'edit_vstup_telefon_vedouciho', adresa = 'edit_vstup_adresa_vedouciho', vek = edit_vstup_vek_vedouciho WHERE id_vedouciho = idVedouciho`
  },
});
