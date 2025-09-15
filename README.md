# Aplikace pro hledání chyb v informačních systémech

> [!IMPORTANT]  
> Aplikace je dostupná na webové stránce: [https://sol239.github.io/information-system-learning-app/](https://sol239.github.io/information-system-learning-app/)

## Přehled

Tato aplikace je navržena pro studenty, kteří se učí o informačních systémech a jejich chybách. Umožňuje uživatelům procházet různé informační systémy, identifikovat chyby a opravovat je. Naimplementovaný informační systém, ve kterém se chyby hledají je zjednodušený model systému pro správu letního tábora.

### Technologie

Aplikace je postavena pomocí JavaScript frameworku Nuxt3 a využívá komponenty z knihovny NuxtUI. Aplikace funguje kompletně na straně klienta a využívá sql.js databázi.

## Instalace a spuštění

Plnohodnotná verze aplikace je dostupná na výše uvedené webové stránce. Pokud chcete aplikaci spustit lokálně, postupujte podle následujících kroků:

```bash
# Naklonování repozitáře
git clone https://github.com/sol239/information-system-learning-app.git

cd information-system-learning-app

# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev

# Pak otevřete prohlížeč a přejděte na adresu http://localhost:3001
# Tedy na port, který je uveden ve výstupu příkazu npm run dev
```
Pokud byste chtěli aplikaci deploynout na vlastní server, postupujte podle kroků zde: https://nuxt.com/docs/3.x/getting-started/deployment.

Nebo je aplikaci možné deploynout skrze Github Pages. Github Action pro to potřebná je v `.github/workflows/deploy.yml`.
Stačí v Github repozitáři povolit Github Pages.

---

## Jak používat aplikaci

Zde je jednoduchý návod jak aplikaci používat. Podrobná příručka pro učitele je dosupná v souboru [docs/cs/teacher.md](./docs/cs/teacher.md). Příručka pro studenta je dostupná na webové stránce - po vstoupení do systému v kolonce `Student` v navigačním menu.

### Učitel

1. **Úprava informačního systému** - V souboru `assets/data/information_system_*`/config.json` můžete upravit konfiguraci informačního systému, včetně úkolů pro studenty.

2. **Přidání nových úkolů** - V souboru `assets/data/information_system_*`/csv můžete upravovat data informačního systému.

3. **Další kroky jsou popsány v souboru** [docs/cs/teacher.md](./docs/cs/teacher.md).

> [!NOTE]  
> V příručce pro učitele je také exemplární vyřešení ukázkových úkolů.

### Student

0. **Nastavení** - V kolonce `Nastavení` v navigačním menu můžete upravit jazyk aplikace a podívat se na klávesové zkratky.

1. **Vstup do systému** - Otevřete aplikaci a vyberte informační systém (v kolonce `Systém`), který chcete prozkoumat.

2. **Stránky systému** 
    - V kolonce `Nástěnka` můžete vidět statistiky o informačním systému.
    - V kolonce `Turnusy` můžete vidět a spravovat turnusy.
    - V kolonce `Účastníci` můžete vidět a spravovat účastníky.
    - V kolonce `Vedoucí` můžete vidět a spravovat vedoucí.
    - V kolonce `Jídla` můžete vidět a spravovat jídla.
    - V kolonce `Jídelníček` můžete vidět a spravovat jídelníček.

3. **Další kolonky**
    - V kolonce `Student` můžete vidět nápovědu pro práci s aplikací.
    - V kolonce `Nastavení` můžete upravit jazyk aplikace a podívat se na klávesové zkratky.
    - V kolonce `Obnovit systém` můžete obnovit systém do výchozího stavu.
        - `Obnovit komponenty`: obnoví se původní vzhled komponent a i jejich fungování.
        - `Obnovit úkoly`: obnoví se původní úkoly, které má student splnit. vyresetuje se skóre.
    - V kolonce `Databáze` můžete vidět všechna data v informačním systému ve formě tabulek. Lze také spouštět SQL dotazy nad databází.
    - V kolonce `Zapnout/Vypnout zvýraznění` - Zapne nebo vypne zvýraznění komponent v systému. Zvýrazní se všechny komponenty. Ty pak lze vybrat pro vyřešení úkolů - nalezeních chybné komponenty.
    - V kolonce `Zapnout/Vypnout úpravy` - Zapne nebo vypne možnost úprav komponent v systému. Některé úkoly vyžadují úpravu komponent.


4. **Hledání a oprava chyb** - V pravém dolnom rohu je tlačítko `Úkoly` (pokud student vybral nějaký úkol, tak se název tlačítka změní na název úkolu), kded můžete vidět seznam úkolů, které máte splnit. Kliknutím na úkol se zobrazí podrobnosti a můžete začít hledat chyby v systému.

## TBD (BP)

- Vytvoření product tour (interaktivní návod, jak ovládat aplikaci) pomocí nějaké knihovny např. Intro.js, pro studenta i učitele.
- Aktuálně tabulky jsou napsány v angličtině, ale lze v sql dotazech používat české názvy tabulek, existuje most na přeložení názvů tabulek do češtiny. Ale nejde to s názvy sloupců, tj. je potřeba používat anglicé názvy sloupců.
- Editace komponent: byllo by dobré mít nějaký seznam proměnných dané stránky/komponeny, který by užiateli byli zobrazeny. Mohl by je pak např. používat v JS/html/sql kódu
- Grafický editor pro tvorbu úkolů / vytváření chyb v komponentách
- Vytvoření úvodních úkolů, které mají dávat nějaký hlubší smysl, ne jen reprezentativní ukázky.
- Optimalizace pro mobilní zařízení.
- Unit a E2E testy.
- Celkové zlepšení chodu aplikace a zlepšení dosavadních funkcionalit, např.
    - Obnovení databáze z navigačního menu - nyní se to dá pouze z kolonky `Databáze`.
    - Více možností pro editaci komponent. Více komponent.
    - Zrychlení aplikace a loading animace.
    - Kontrola vyřešení úkolů dokáže zkontrolovat zda upravený SQL dotaz je správný, ale nedokáže to pro JS a HTML. To lze jen zatím zkontrolovat podle tohom zda byla např. přidána nějaká entita.
    - Dynamciké zobrazování/kontrola podůkolů. Např. úkolem bude upravit několik uživatelů, to se musí nějak dynamicky zobrazit. Viz. TODO 1.1
- Pokud není vybraný úkol, tak nějaké animace aby uživatel si vybral nějaký úkol.
- Úkol typu, že má uživatel přímo odpovědět na otázku. Např. zjistit nějaký počet.
- Úkol typu, že má uživatel opovědět na otázku z možností.
- Počet bodů za úkoly.
- Odeslání výsledku.
- Import systému z uložiště. (Uložení někde v localStorage, atd.)
- Nějaké sortotování pro účastníky, jídla, atd.
- Více modikikovatelného kódu pro komponenty.

## Kontakt

Pokud máte jakékoli dotazy nebo potřebujete pomoc, neváhejte mě kontaktovat na emailu: david.valek17@gmail.com
