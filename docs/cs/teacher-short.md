# Stručná příručka pro učitele

Tento návod popisuje nejjednodušší způsob použití aplikace: učitel vezme předpřipravený systém, upraví nebo vytvoří úkoly a potom nasadí studentskou verzi aplikace, kterou pošle studentům. Není potřeba vytvářet celý informační systém od začátku, typický postup je upravit připravený systém `Školní tábor Pálava` podle vlastní výuky.

## 1 Základní myšlenka

Aplikace má dvě verze:

- `TEACHER`: učitelská verze, ve které připravujete systém a úkoly.
- `STUDENT`: studentská verze, ve které studenti úkoly řeší.

Pro běžné použití stačí pracovat s učitelskou verzí, upravit úkoly v předpřipraveném systému a poté nasadit studentskou verzi. Studenti pak otevřou odkaz, vstoupí do systému a řeší úkoly postupně podle úrovní.

## 2 Příprava aplikace pro úpravy

Nejprve si stáhněte projekt do počítače:

```bash
git clone https://github.com/sol239/information-system-learning-app.git
cd information-system-learning-app
npm install
```

V souboru `.env` nastavte učitelský režim:

```env
NUXT_PUBLIC_APP_MODE=TEACHER
```

Poté spusťte aplikaci:

```bash
npm run dev
```

Aplikace bude dostupná v prohlížeči, obvykle na adrese `http://localhost:3000/information-system-learning-app`. Pokud je port obsazený, terminál vypíše jinou adresu.

## 3 Úprava předpřipraveného systému

Po otevření učitelské verze přejděte na stránku se systémy. Zde můžete přidat systém a vybrat předpřipravený systém `Školní tábor Pálava`. Tento systém je připravený jako ukázka a dá se upravit pro vlastní výuku.

Po vstupu do systému uvidíte vlevo samotný informační systém a vpravo učitelské ovládání. Pro úpravu úkolů použijte tlačítko `Návrhář`, které otevře stránku `/designer`.

Na stránce návrháře můžete:

- upravit existující úkoly,
- vytvořit nový úkol,
- smazat nepotřebné úkoly,
- nastavit úrovně úkolů,
- vybrat stránky, které student při úkolu uvidí,
- nastavit bodování, zpětnou vazbu a kontroly splnění.

Hotový systém si můžete stáhnout jako `.zip` pomocí tlačítka `Stáhnout systém`. Tento ZIP lze později znovu nahrát nebo použít jako připravený systém pro studentskou verzi.

## 4 Jak fungují úkoly

Každý úkol má dvě části: **Aktivitu** a **Dokončení**.

**Aktivita** je první část úkolu. Student zde typicky hledá problém, vybírá správné vysvětlení nebo opravuje komponentu systému.

Typy aktivit:

- `Výběr komponent`: student označí komponenty, které podle něj způsobují problém.
- `Vybrat možnost`: student vybere správnou odpověď nebo vysvětlení.
- `Oprava komponent`: student upraví chybnou komponentu, například její HTML, CSS, JavaScript nebo SQL.

**Dokončení** je druhá část úkolu. Kontroluje, zda student opravdu splnil cíl úkolu, například něco zjistil, správně odpověděl nebo změnil stav databáze.

Typy dokončení:

- `Po dokončení aktivity`: úkol skončí po splnění aktivity.
- `Po aktualizaci databáze`: aplikace ověří stav databáze pomocí SQL dotazu.
- `Výběr možností`: student vybere správné možnosti.
- `Napsat správně`: student napíše přesnou odpověď.

Při tvorbě úkolu je důležité napsat studentovi jasné zadání, nastavit správnou kontrolu a přidat zpětnou vazbu, aby po vyřešení věděl, co bylo cílem.

## 5 Nasazení studentské verze

Nejjednodušší způsob nasazení je přes GitHub Pages. Doporučený praktický postup je mít samostatný veřejný repozitář pro studentskou verzi, například `information-system-learning-app-student`.

V nastavení repozitáře na GitHubu:

1. V části `Settings` -> `Pages` nastavte `Source` na `GitHub Actions`.
2. V části `Settings` -> `Secrets and variables` -> `Actions` -> `Variables` vytvořte proměnné:

```env
NUXT_PUBLIC_APP_MODE=STUDENT
NUXT_APP_BASE_URL=/nazev-repozitare
```

Například:

```env
NUXT_PUBLIC_APP_MODE=STUDENT
NUXT_APP_BASE_URL=/information-system-learning-app-student
```

Do složky `public/systems` vložte připravený systém. Může to být buď adresář systému, nebo `.zip` soubor. Poté zkontrolujte, že je uvedený v manifestu systémů, aby ho aplikace při spuštění našla.

Příklad:

```json
{
  "systems": [
    "skolni-tabor-palava"
  ]
}
```

Nakonec změny nahrajte do GitHub repozitáře. Po doběhnutí GitHub Actions bude studentská verze dostupná na adrese:

```text
https://<vase-github-uzivatelske-jmeno>.github.io/<nazev-repozitare>/
```

Tento odkaz pošlete studentům.

## 6 Doporučený jednoduchý workflow

1. Spusťte aplikaci lokálně v režimu `TEACHER`.
2. Otevřete předpřipravený systém `Školní tábor Pálava`.
3. Upravte nebo vytvořte úkoly v návrháři.
4. Vyzkoušejte si úkoly přepnutím do studentského pohledu.
5. Stáhněte připravený systém jako `.zip`.
6. Vložte systém do studentské verze v `public/systems`.
7. Nastavte `NUXT_PUBLIC_APP_MODE=STUDENT`.
8. Nahrajte změny na GitHub a počkejte na nasazení.
9. Pošlete studentům odkaz na GitHub Pages.

Tento postup je nejrychlejší, protože nevyžaduje tvorbu systému od nuly. Učitel se soustředí hlavně na úkoly: co mají studenti najít, opravit nebo ověřit.
