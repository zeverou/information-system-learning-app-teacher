# Příručka pro učitele

Tato příručka slouží k tomu, jak aplikaci používat, konfigurovat, spustit i nasadit, aby k ní měli přístup studenti.

### Technické informace o aplikaci

Jedná se o webovou aplikaci postavenou na frameworku Nuxt.js, který je založen na JavaScriptu a běží v prohlížeči uživatele. Aplikace je navržena tak, aby byla snadno použitelná pro učitele i studenty, a umožňuje přizpůsobení obsahu a funkcí podle potřeb výuky. 

## Jak aplikaci spustit

Jedná se o webovou aplikaci, která běží přímo v prohlížeči uživatele (client-side aplikace [1]). Níže uvedu jak aplikaci spustit lokálně, ale i jak ji nasadit na server, aby k ní měli přístup studenti.

## 1. Lokální spuštění

#### Technické požadavky:

- Node.js (doporučuji nějakou novou verzi, např. 18+)
- NPM (mělo by být součástí Node.js)
- Git (pro klonování repozitáře)
- Textový editor (doporučuji Visual Studio Code)

#### 1. Naklonujte repozitář

Klonování repozitáře je prostě stahnutí kódu z GitHubu (to je služba pro hostování kódu) do vašeho počítače. Otevřete terminál a spusťte:

```bash
git clone https://github.com/sol239/information-system-learning-app
```

Alternativně můžete repozitář stáhnout jako ZIP soubor a rozbalit ho na výše uvedené adrese.

#### 2. Nainstalujte závislosti
Přejděte do složky s projektem a nainstalujte potřebné knihovny:

```bash
cd information-system-learning-app
npm install
```

#### 3. Nastavte režim aplikace (režimy aplikace jsou popsané v sekci X.X.X)

V souboru `.env` nastavte `NUXT_PUBLIC_APP_MODE` na `TEACHER` pokud chcete spustit učitelskou verzi aplikace, Jinak nastavte `STUDENT` pro studentskou verzi.

```env
NUXT_PUBLIC_APP_MODE=TEACHER
```


#### 4. Spusťte vývojový server

Tohle je krok, kdy se aplikace spustí a bude dostupná ve vašem prohlížeči, pouze pro vás (ne pro studenty). Spusťte:

```bash
npm run dev
```

Aplikace bude pravděpodobně dostupná na adrese `http://localhost:3000/information-system-learning-app`. Můžete ji otevřít v prohlížeči a začít s ní pracovat.
Je možné, že port 3000 je již obsazený, v takovém případě se aplikace spustí na jiném portu (např. 3001) a v terminálu uvidíte zprávu, na jaké adrese je aplikace dostupná. Viz. screenshot níže.

![spusteni vyvojoveho serveru - konzole](image.png)

## 2. Online nasazení

Pro maximální jednoduchost doporučuji použít pro nasazení službu Pages od GitHubu, která umožňuje snadno hostovat statické webové stránky přímo z vašeho repozitáře. Alternativně lze použít i třeba jiné služby jako [Vercel](https://vercel.com/docs/frameworks/full-stack/nuxt), anebo si aplikaci nasadit na vlastní [server](https://nuxt.com/docs/4.x/getting-started/deployment). Všechny možné příručky pro nasazení jsou dostupné v oficiální [dokumentaci](https://nuxt.com/deploy)

## Nasazení pomocí GitHub Pages

Je možné zvolit dva způsoby nasazení:

1. Dva repozitáře pro učitelskou a studentskou verzi (složitější nastavení, ale poté už není potřeba nic měnit).

2. Jeden repozitář pro obě verze (jednodušší nastavení, ale pro přepnutí mezi režimy je potřeba změnit nastavení a znovu spustit workflow pro nasazení).

V obout případech je potřeba mít účet na GitHubu. Pokud nemáte účet na [GitHubu](https://github.com/), vytvořte si ho.

### 1. Dva repozitáře

1. [Vytvořte](https://github.com/new) dva repozitáře, například `information-system-learning-app-teacher` a `information-system-learning-app-student`.

2. Ujistěte se, že oba repozitáře jsou veřejné (public).

3. Přejděte do nastavení `Settings` každého repozitáře, jděte do sekce `Pages` a v sekci `Source` zvolte `GitHub Actions`. Pokud to nenajdete, tak byste to měli mít na adrese: `https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>/settings/pages`


4. Přejděte v nastavení repozitáře do sekce `Secrets and variables`, zvolte podsekci `Actions`, zvolte `Variables` místo `Secrets` a klikněte na `New repository variable`.
    - Vytvořte proměnnou: `NUXT_PUBLIC_APP_MODE` s hodnotu `TEACHER` pro učitelskou verzi aplikace, anebo `STUDENT` pro studentskou verzi. 
    - Vytvořte proměnnou: `NUXT_APP_BASE_URL` s hodnotou `/<nazev-repozitare>`, například `/information-system-learning-app-student`.

Například pro repozitář `information-system-learning-app-student` by to mělo vypadat takto:

TODO: vložit screenshot

Pokud tuhle stránky s nastavením nenajdete, tak byste ji měli mít na adrese: `https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>/settings/variables/actions`

5. Naklonujte si repozitář výukové aplikace a přepněte se do něj:

```bash
git clone https://github.com/sol239/information-system-learning-app.git
cd information-system-learning-app
```

6. Přidejte oba repozitáře jako vzdálené (remote) repozitáře:

```bash
# git remote add teacher https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>.git
# Například:
git remote add teacher https://github.com/zeverou/information-system-learning-app-teacher.git
git remote add student https://github.com/zeverou/information-system-learning-app-student.git
git branch -M main
git push teacher main
git push student main
```

7. Stránky by poté měly být dostupné na adresách `https://<vase-github-uzivatelske-jmeno>.github.io/<nazev-repozitare>/`. To si můžete ověřit na adrese: `https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>/deployments/github-pages`

### 2. Jeden repozitář

1. [Vytvořte](https://github.com/new) jeden repozitář, například `information-system-learning-app`.

2. Ujistěte se, že repozitář je veřejný (public).

3. Přejděte do nastavení `Settings` každého repozitáře, jděte do sekce `Pages` a v sekci `Source` zvolte `GitHub Actions`. Pokud to nenajdete, tak byste to měli mít na adrese: `https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>/settings/pages`

4. Přejděte v nastavení repozitáře do sekce `Secrets and variables`, zvolte podsekci `Actions`, zvolte `Variables` místo `Secrets` a klikněte na `New repository variable`.
    - Vytvořte proměnnou: `NUXT_PUBLIC_APP_MODE` s hodnotu `TEACHER` pro učitelskou verzi aplikace, anebo `STUDENT` pro studentskou verzi. 
    - Vytvořte proměnnou: `NUXT_APP_BASE_URL` s hodnotou `/<nazev-repozitare>`, například `/information-system-learning-app`.


5. Naklonujte si repozitář výukové aplikace a přepněte se do něj:

```bash
git clone https://github.com/sol239/information-system-learning-app.git
cd information-system-learning-app
```

6. Přidejte repozitář jako vzdálený (remote) repozitář:

```bash
# git remote add teacher https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>.git
# Například:
git remote add dual https://github.com/zeverou/information-system-learning-app.git
git branch -M main
git push dual main
```

7. Stránka by poté měla být dostupná na adrese `https://<vase-github-uzivatelske-jmeno>.github.io/<nazev-repozitare>/`. To si můžete ověřit na adrese: `https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>/deployments/github-pages`

#### Jak měnit verze aplikace

Při každé změně verze apliakce musíte:

1. Změnit nastavení `NUXT_PUBLIC_APP_MODE` v proměnné prostředí (jak je popsáno výše).
2. Znovu spustit workflow pro nasazení, to můžete provést na stránce: `https://github.com/<vase-github-uzivatelske-jmeno>/<nazev-repozitare>/actions/workflows/deploy.yml` kliknutím na `Run workflow` a zvolit větev `main` a poté kliknout na `Run workflow` pro spuštění.

#### Fork repozitáře s aplikací

Pro verzi s jedním repozitářem, můžete také použít funkci `Fork` na GitHubu, která vám umožní vytvořit kopii repozitáře pod vaším účtem. Poté vám stačí provést kroky 3, 4 a je potřeba provést `Run workflow` pro nasazení, jak je popsáno výše.

---

## Verze aplikace

Aplikace má dvě verze: učitelskou a studentskou. Režim se nastavuje pomocí proměnné prostředí `NUXT_PUBLIC_APP_MODE` v proměnných github repozitáře, nebo v souboru `.env` pro lokální spuštění. Pokud se proměnné v proměnných GitHub repozitáře nenajdou, tak se použijí proměnné z `.env` souboru.

## Učitelská verze

V této verzi máte přístup ke správě vašich systémů a úkolů. Můžete přidávat nové systémy, přidávat úkoly, upravovat je a mazat. Tato verze je určena pro vás jako učitele, abyste mohli připravit materiály pro své studenty. Umožnuje také, přepínání mezi verzemi, abyste si mohli prohlédnout, jak bude aplikace vypadat pro studenty.

### Nastavení

V proměnných repozitáře GitHubu vytvote proměnnou `NUXT_PUBLIC_APP_MODE` s hodnotou `TEACHER`, anebo v souboru `.env` nastavte:

```env
NUXT_PUBLIC_APP_MODE=TEACHER
``` 

### První spuštění

Při otevření odkazu webové stránky budete přesměrování na adresu `/systems`, kde jako učitel uvidítě všechny systémy, které máte k dispozici, a můžete přidávat nové systémy pomocí tlačítka `Přidat nový systém`. Jakmile na stránce budete mít nějaké systémy, tak u nich uvidiíte tlačítko `Tužky`, které vám umožní upravit systém - upravit jeho ID, název a popis, a tlačítko `Koše`, které vám umožní systém smazat. Dále každý systém má tlačítko `Vstoupit do systému`, které vás přesměruje do systému.

TODO: vložit screenshot

### Přidání systému

Po kliknutí se vám otevře okno pro nahrání nového systému, buď můžete nahrát `.zip` souboru reprezentující systém, anebo zvolit nějaký systém z nabídky předpřipravených systémů, více o předpřipravených systémech v sekci TODO.

TODO: vložit screenshot

### Orientace systému

Po vstupu do systému uvidíte vaši, že vaše obrazovka je rozdělena na dvě části vertikální čárou. 
- **Část vlevo**: reprezentuje samotný systém, se kterým budou studenti pracovat. Můžete zde vidět nahoře stránky, na které se dá vstupovat, a pod nimi se nachází různé komponenty.
- **Část vpravo**: nahoře můžete vidět opět různé možnosti, které jsou popsané v sekci Možnosti učitelské verze TODO. Pod nimi jsou úkoly, dostupné v daném systému. Můžete zde přidávat nové úkoly pomocí tlačítka `Vytvořit úkol`, a u každého úkolu se nachází tlačítko `Koše`, které vám umožní úkol smazat. Na každý úkol jde kliknout a tím jej vybrat. Poté co na něj kliknete, tak ho uvidítě v nabídce modře ohraničený a v systému vlevo uvidítě, tmavě červěně ohraničené komponenty, které jsou k úkolu přiřazené.

TODO: vložit screenshot

### Možnosti učitelské verze

V právé části obrazovky se nachází několik možností - tlačítek, které vám umožňují různé akce:

- **Ikona oka**: umožňuje vám vidět přesně, kde komponenty systému začínajjí a končí díky modrému ohraničení, také vám umožňuje vidět název komponenty. Při kliknutí na název komponenty se komponenta přidá do úkolu, to je popsané více v sekci TODO.
- **Návrhář**: přesměruje vás na stránku `/designer`, kde můžete přidávat a upravovaat úkoly, více o této stránce v sekci TODO.
- **Obnovit systém**: otevře okno, které vám umožňuje obnovit databázi, komponenty a systém samotný do původního stavu, více o obnovování systému v sekci TODO.
- **Opustit systém**: opustí systém a přesměruje vás zpět na stránku se systémy `/systems`.
- **Změnit verzi**: umožňuje vám přepnout mezi učitelskou a studentskou verzí.

## Tvorba úkolů (stránka návrháře `/designer`)

V pravém horním rohu jsou tlačítka: 
- `Stáhnout systém`: otevře okno, které vám umožní stáhnout systém ve formátu `.zip`, který můžete později nahrát jako nový systém, nebo ho použít v předpřipravených systémech.
- `Zpět do systému`: přesměruje vás zpět do systému, kde jste byli předtím.

Níže uvidíte položky:

### Počet úrovní

Úkoly mohou být seskupeny do úrovní (např. úroveň 1, úroveň 2, atd.). Tato položka vám umožňuje nastavit počet úrovní, které chcete mít ve vašem systému. Student prvně řeší úkoly z úrovně 1, a jakmile je všechny vyřeší, tak se odemknou úkoly z úrovně 2, a tak dále.

### Tlačítka `Náhled studenta/editoru`, `Nový úkol` a `Možnosti`

- `Náhled studenta/editoru`: umožňuje vám přepnout mezi zobrazením úkolů tak, jak je vidí studenti, a zobrazením pro editaci úkolů.
- `Nový úkol`: po kliknutí se vytvoří nový úkol, který se přidá do první úrovně.
- `Možnosti`: otevře nabídku, která okbsahuje možnosti:
    - `Přidat úkol z JSON`: umožňuje vám přidat úkol z JSON formátu.
    - `Stáhnout úkol jako JSON`: umožňuje vám stáhnout úkol ve formátu JSON, který můžete později použít pro přidání úkolu z JSON.
    Tyhle možnosti tu jsou hlavně pro případ, kdybyste chtěli si třeba stáhnout reprezentaci úkolu, tak abyste mohli říct nějakému nástroji umělé inteligence, aby vám ji upravil.

### Úkoly

Zde vidíte za sebou štítky s názvy úkolů, které máte v systému. kliknutím na ikonu `Koše` můžete úkol smazat.

### Sekce Detail úkolu

#### Název

Zde můžete upravit název úkolu.

#### Popis

Zde můžete upravit popis úkolu.

#### Viditelné stránky

Zde můžete zvolit, které stránky budou pro studenty viditelné, během daného úkolu. To znamená, že když student bude řešit úkol, tak uvidí pouze ty stránky, které zde zvolíte a nemůže vstupovat na ostatní stránky, dokud nevyřeší všechny úkoly z aktuální úrovně. Úkoly v jedné úrovni musí mít stejné viditelné stránky, pokud dojde k tomu, že úkoly ve stejné úrovni mají různé viditelné stránky, tak se vám zobrazí varování, které musíte vyřešit.

#### Povolit SQL dotazy

Zda studenti mohou během řešení úkolu na stránce `/database` spouštět SQL dotazy, nebo ne.

### Sekce Úroveň

#### Úroveň

Zde můžete zvolit úroveň, do které chcete úkol zařadit.

#### Úkoly v této úrovni

Zde vidíte všechny úkoly, které jsou v zvolené úrovni.

### Sekce Bodování

#### Odměna bodů

Zde můžete nastavit, kolik bodů student získá za vyřešení úkolu.

#### Penalizace za selhání

Zde můžete nastavit, kolik bodů student ztratí, když se pokusí úkol vyřešit, ale neuspěje.

### Sekce Vybrané komponenty

Zde vidíte seznam všech komponent, které jsou přiřazené k úkolu. Komponenty se přidávají kliknutím na modrý název komponenty v systému, anebo lze přidat komponentu ručně pomocí tlačítka `Přidat komponentu`, kde můžete vložit její JSON reprezentaci, to je opět užitečné v případě, že chcete použít nějaký nástroj umělé inteligence pro úpravu komponenty.

Každé komponenta obsahuje 3 tlačítka:

- `Kopírovat`: umožňuje vám zkopírovat komponentu jako JSON, který můžete použít v nástrojích umělé inteligence.
- `Koš`: umožňuje vám odebrat komponentu z úkolu.
- `Tužka`: umožňuje vám upravit komponentu, po kliknutí se vám otevře okno s úpravou komponenty, o tom více v sekci TODO.

### Sekce Aktivita (více o aktivitách v sekci TODO)

#### Název aktivity

Zde můžete nastavit název aktivity.

#### Typ aktivity

Zde můžete zvolit typ aktivity úkolu. Pokud zvolíte `Výběr možností`, tak se vám zobrazí pole, pro vytváření možností, které student může vybírat, zelená fajka znamená, že možnost je správná, a červený křížek znamená, že možnost je nesprávná.

#### Popis aktivity

Zde můžete upravit popis aktivity.

#### Nahradit chybné komponenty původními po dokončení aktivity

Zda se mají po dokončení aktivity přiřazené (např. nějak upravené) komponenty nahradit původními (výchozími) komponentami.

#### Zkontrolovat opravu (při zvolení typu aktivity `Oprava komponent`)

Pokud tuto možnost nezvolíte, tak student už bude moct pracovat na **Dokončení úkolu** bez toho, aniž by musel nejdříve opravit komponenty, avšak to se mu nepovede, pokud je úkol navržen, tak aby to bez konkrétní opravy nešlo. Tahle možnost tu je proto, že některé opravy by zkontrolovat nešly.
Pokud zvolíte, že chcete zkontrolovat opravu, tak se vám zobrazí pole `Podmínky kontroly opravy` pro nastavení kontroly opravy - zvolíte komponentu a déte kontrolu zda má obsahovat / nemá obsahovat nějakou hodnotu.

### Sekce Dokončení (více o dokončení úkolu v sekci TODO)

#### Název dokončení

Zde můžete nastavit název dokončení úkolu.

#### Popis dokončení

Zde můžete upravit popis dokončení úkolu.

#### Typ dokončení

Zde můžete zvolit typ dokončení úkolu. Pokud zvolíte `Výběr možností`, tak se vám zobrazí pole, pro vytváření možností, které student může vybírat, zelená fajka znamená, že možnost je správná, a červený křížek znamená, že možnost je nesprávná. Pokud zvolíte `Napsat správně`, tak se vám zobrazí pole pro napsaní správné odpovědi, kterou student musí napsat, aby úkol dokončil. Pokud zvolíte `Po aktualizaci databáze`, tak se úkol vyhodnotí jako dokončený, pokud dotaz, který zadáte níže, vrátí nějaký výsledek.

### Zpětná vazba

Umožňuje vám nastavit zpětnou vazbu, kterou studenti uvidí po vyřešení úkolu.

## Studentská verze

V této verzi studenti řeší úkoly, které jste pro ně připravili. Nemají přístup k nastavení ani správě systémů a úkolů, ale mohou vidět všechny úkoly, které jste vytvořili, a pracovat na jejich řešení.

### Nastavení

V proměnných repozitáře GitHubu vytvote proměnnou `NUXT_PUBLIC_APP_MODE` s hodnotou `STUDENT`, anebo v souboru `.env` nastavte:

```env
NUXT_PUBLIC_APP_MODE=STUDENT
```

### První spuštění

## Předpřipravený systém s úkoly




## Úkoly

Tahle část se zabývá tím, ajké úkoly lze vytvářet, jak je navrhnout a jak fungují pro studenty.

## Odkazy

1. https://www.cloudflare.com/learning/serverless/glossary/client-side-vs-server-side/

