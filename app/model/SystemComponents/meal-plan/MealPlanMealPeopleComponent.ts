import { Component } from "~/model/Component";

export const jidelnicekLideJidlaKomponenta = new Component({
  id: "jidelnicek-lide-jidla",
  name: "Jídelníček – Účastníci u jídla",
  tags: ["jídelníček"],
  description: `Účastníci, kteří měli jídlo v daný den. Vyžaduje generalVariables: idJidla, datumDne.`,
  html: `
<div id="jidelnicek-sekce-ucastniku">
  <div id="jidelnicek-hlavicka-ucastniku">
    <span id="jidelnicek-ikona-ucastniku">🧑‍🤝‍🧑</span>
    <span id="jidelnicek-titulek-ucastniku">Účastníci (pocet_ucastniku_jidla)</span>
  </div>
  <ul id="jidelnicek-seznam-ucastniku-jidla-idJidla-datumDne"></ul>
</div>
`,
  css: `
#jidelnicek-sekce-ucastniku {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

#jidelnicek-hlavicka-ucastniku {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

#jidelnicek-sekce-ucastniku ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

#jidelnicek-sekce-ucastniku li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.avatar-ucastnika-jidelnicku {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background-color: #dbeafe;
  color: #1d4ed8;
  flex-shrink: 0;
}

.jmeno-ucastnika-jidelnicku {
  font-size: 13px;
  font-weight: 600;
  color: #1d4ed8;
}
`,
  js: `
  const jmenaUcastnikuJidla = typeof jmena_ucastniku_jidla === 'undefined'
    ? []
    : (Array.isArray(jmena_ucastniku_jidla) ? jmena_ucastniku_jidla : [jmena_ucastniku_jidla]);

  let pocet_ucastniku_jidla = jmenaUcastnikuJidla.length;

  const inicialyUcastnikuJidla = [];
  for (let i = 0; i < jmenaUcastnikuJidla.length; i++) {
    const jmeno = (jmenaUcastnikuJidla[i] ?? '').trim();
    const castiJmena = jmeno.split(/\\s+/).filter(Boolean);
    const prvniCast = castiJmena[0] ?? '';
    const posledniCast = castiJmena.length > 1 ? castiJmena[castiJmena.length - 1] : '';

    if (prvniCast && posledniCast) {
      inicialyUcastnikuJidla.push((prvniCast.charAt(0) + posledniCast.charAt(0)).toUpperCase());
      continue;
    }

    if (prvniCast) {
      inicialyUcastnikuJidla.push(prvniCast.slice(0, 2).toUpperCase());
      continue;
    }

    inicialyUcastnikuJidla.push('');
  }

  const seznamUcastnikuJidla = document.querySelector('#jidelnicek-seznam-ucastniku-jidla-' + idJidla + '-' + datumDne);
  if (seznamUcastnikuJidla) {
    seznamUcastnikuJidla.innerHTML = '';

    jmenaUcastnikuJidla.forEach(function(text, index) {
      const li = document.createElement('li');

      const avatar = document.createElement('span');
      avatar.className = 'avatar-ucastnika-jidelnicku';
      avatar.textContent = inicialyUcastnikuJidla[index] ?? '';

      const jmeno = document.createElement('span');
      jmeno.className = 'jmeno-ucastnika-jidelnicku';
      jmeno.textContent = text;

      li.appendChild(avatar);
      li.appendChild(jmeno);
      seznamUcastnikuJidla.appendChild(li);
    });
  }`,
  js_click: ``,
  sql: {
    "jidelnicek-lide-jidla": `SELECT u.jmeno AS jmena_ucastniku_jidla
FROM ucastnici u
JOIN turnusy_ucastnici tu ON u.id_ucastnika = tu.id_ucastnika
JOIN turnusy t ON t.id_turnusu = tu.id_turnusu
WHERE DATE('datumDne') BETWEEN DATE(t.datum_od) AND DATE(t.datum_do)
  AND EXISTS (
    SELECT 1
    FROM kniha_jidel kj
    WHERE kj.id_jidla = idJidla
      AND DATE(kj.datum) = DATE('datumDne')
  )
ORDER BY u.jmeno`
  },
  sql_click: {}
});

export const jidelnicekVedouciJidlaKomponenta = new Component({
  id: "jidelnicek-vedouci-jidla",
  name: "Jídelníček – Vedoucí u jídla",
  tags: ["jídelníček"],
  description: `Vedoucí, kteří měli jídlo v daný den. Vyžaduje generalVariables: idJidla, datumDne.`,
  html: `
<div id="jidelnicek-sekce-vedoucich">
  <div id="jidelnicek-hlavicka-vedoucich">
    <span id="jidelnicek-ikona-vedoucich">👥</span>
    <span id="jidelnicek-titulek-vedoucich">Vedoucí (pocet_vedoucich_jidla)</span>
  </div>
  <ul id="jidelnicek-seznam-vedoucich-jidla-idJidla-datumDne"></ul>
</div>
`,
  css: `
#jidelnicek-sekce-vedoucich {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

#jidelnicek-hlavicka-vedoucich {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

#jidelnicek-sekce-vedoucich ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

#jidelnicek-sekce-vedoucich li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.avatar-vedouciho-jidelnicku {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background-color: #ede9fe;
  color: #7c3aed;
  flex-shrink: 0;
}

.jmeno-vedouciho-jidelnicku {
  font-size: 13px;
  font-weight: 600;
  color: #7c3aed;
}
`,
  js: `
  const jmenaVedoucichJidla = typeof jmena_vedoucich_jidla === 'undefined'
    ? []
    : (Array.isArray(jmena_vedoucich_jidla) ? jmena_vedoucich_jidla : [jmena_vedoucich_jidla]);

  let pocet_vedoucich_jidla = jmenaVedoucichJidla.length;

  const inicialyVedoucichJidla = [];
  for (let i = 0; i < jmenaVedoucichJidla.length; i++) {
    const jmeno = (jmenaVedoucichJidla[i] ?? '').trim();
    const castiJmena = jmeno.split(/\\s+/).filter(Boolean);
    const prvniCast = castiJmena[0] ?? '';
    const posledniCast = castiJmena.length > 1 ? castiJmena[castiJmena.length - 1] : '';

    if (prvniCast && posledniCast) {
      inicialyVedoucichJidla.push((prvniCast.charAt(0) + posledniCast.charAt(0)).toUpperCase());
      continue;
    }

    if (prvniCast) {
      inicialyVedoucichJidla.push(prvniCast.slice(0, 2).toUpperCase());
      continue;
    }

    inicialyVedoucichJidla.push('');
  }

  const seznamVedoucichJidla = document.querySelector('#jidelnicek-seznam-vedoucich-jidla-' + idJidla + '-' + datumDne);
  if (seznamVedoucichJidla) {
    seznamVedoucichJidla.innerHTML = '';

    jmenaVedoucichJidla.forEach(function(text, index) {
      const li = document.createElement('li');

      const avatar = document.createElement('span');
      avatar.className = 'avatar-vedouciho-jidelnicku';
      avatar.textContent = inicialyVedoucichJidla[index] ?? '';

      const jmeno = document.createElement('span');
      jmeno.className = 'jmeno-vedouciho-jidelnicku';
      jmeno.textContent = text;

      li.appendChild(avatar);
      li.appendChild(jmeno);
      seznamVedoucichJidla.appendChild(li);
    });
  }`,
  js_click: ``,
  sql: {
    "jidelnicek-vedouci-jidla": `SELECT DISTINCT v.jmeno AS jmena_vedoucich_jidla
FROM vedouci v
JOIN jidla_vedouci jv ON v.id_vedouciho = jv.id_vedouciho
JOIN jidla prirazene_jidlo ON prirazene_jidlo.id_jidla = jv.id_jidla
JOIN jidla zobrazene_jidlo ON zobrazene_jidlo.id_jidla = idJidla
WHERE DATE(jv.datum_podavani) = DATE('datumDne')
  AND prirazene_jidlo.doba_podavani = zobrazene_jidlo.doba_podavani
ORDER BY v.jmeno`
  },
  sql_click: {}
});
