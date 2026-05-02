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

### 

## Studentská verze

V této verzi studenti řeší úkoly, které jste pro ně připravili. Nemají přístup k nastavení ani správě systémů a úkolů, ale mohou vidět všechny úkoly, které jste vytvořili, a pracovat na jejich řešení.

### Nastavení

V proměnných repozitáře GitHubu vytvote proměnnou `NUXT_PUBLIC_APP_MODE` s hodnotou `STUDENT`, anebo v souboru `.env` nastavte:

```env
NUXT_PUBLIC_APP_MODE=STUDENT
```

### 

## Předpřipravený systém s úkoly





---

## Odkazy

1. https://www.cloudflare.com/learning/serverless/glossary/client-side-vs-server-side/

