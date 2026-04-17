import { Component } from "~/model/Component";

export const celkovyPocetJidelKomponenta = new Component({
  id: "celkovy-pocet-jidel",
  name: "Celkový počet jídel",
  tags: ["jídla"],
  description: `Zobrazuje celkový počet jídel ve widgetu nástrojové lišty.`,
  html: `
<div id="widget-poctu-jidel">
  <span id="ikona-poctu-jidel">🍴</span>
  <span id="popisek-poctu-jidel">Celkový počet jídel: celkovy_pocet_jidel</span>
</div>
`,
  css: `
#widget-poctu-jidel {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  color: #15803d;
  font-size: 13px;
  font-weight: 600;
}

#ikona-poctu-jidel {
  font-size: 15px;
}
`,
  js: ``,
  js_click: ``,
  sql: {
    "celkovy-pocet-jidel": `SELECT COUNT(*) AS celkovy_pocet_jidel FROM jidla`
  },
  sql_click: {}
});
