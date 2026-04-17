import { Component } from "~/model/Component";

export const editTlacitkoUlozitUcastnikaKomponenta = new Component({
  id: "edit-btn-ulozit-ucastnika",
  name: "Tlačítko – Upravit účastníka",
  tags: ["účastníci"],
  description: "Tlačítko pro uložení změn existujícího účastníka. Vyžaduje generalVariable: idUcastnika.",

  html: `
<button id="system-edit_btn_ulozit_ucastnika" class="btn-uspech" stav_tlacitka>Upravit účastníka</button>
`,

  css: `
.btn-uspech { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; }
.btn-uspech:disabled { background: #9ca3af; cursor: not-allowed; opacity: 0.65; }
`,

  js: `const je_jmeno_validni = edit_vstup_jmeno_ucastnika.trim().split(" ").filter(Boolean).length === 2;
const je_validni_email = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(edit_vstup_email_ucastnika);
const je_cislo_validni = /^\\+?[0-9\\s]{9,20}$/.test(edit_vstup_telefon_ucastnika);
const je_adresa_validni = /^\\S.+\\s+\\d+[a-zA-Z]?\\s*,\\s*\\S.+\\s*,\\s*\\d{3}\\s?\\d{2}$/.test(edit_vstup_adresa_ucastnika.trim());
const je_vek_validni = Number(edit_vstup_vek_ucastnika) >= 6 && Number(edit_vstup_vek_ucastnika) <= 15;
const stav_tlacitka = je_jmeno_validni && je_validni_email && je_cislo_validni && je_adresa_validni && je_vek_validni ? "" : "disabled";`,
  sql: {},
  sql_click: {
    upravitUcastnika: `UPDATE ucastnici SET jmeno = 'edit_vstup_jmeno_ucastnika', email = 'edit_vstup_email_ucastnika', telefon = 'edit_vstup_telefon_ucastnika', adresa = 'edit_vstup_adresa_ucastnika', vek = edit_vstup_vek_ucastnika WHERE id_ucastnika = idUcastnika`
  },
});
