# Příručka pro učitele

Tato příručka slouží k tomu, jak aplikaci používat, konfigurovat, spustit i nasadit, aby k ní měli přístup studenti.

### Technické informace o aplikaci

Jedná se o webovou aplikaci postavenou na frameworku Nuxt.js, který je založen na JavaScriptu a běží v prohlížeči uživatele. Aplikace je navržena tak, aby byla snadno použitelná pro učitele i studenty, a umožňuje přizpůsobení obsahu a funkcí podle potřeb výuky. 

## Jak aplikaci spustit

Jedná se o webovou aplikaci, která běží přímo v prohlížeči uživatele (client-side aplikace [1]). Níže uvedu jak aplikaci spustit lokálně, ale i jak ji nasadit na server, aby k ní měli přístup studenti.

### Lokální spuštění

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

Pozn. .env soubor neexistuje, takže ho musíte vytvořit. Můžete do něj zkopírovat obsah souboru `.env.example` a upravit podle potřeby. Tento soubor by měl být umístěn v kořenovém adresáři projektu.

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

---

## Režimy aplikace

Aplikace má dva režimy: učitelský (TEACHER) a studentský (STUDENT). Režim se nastavuje pomocí proměnné prostředí `NUXT_PUBLIC_APP_MODE` v souboru `.env`.

### Učitelský režim (TEACHER)

#### Nastavení

V souboru `.env` nastavte:

```env
NUXT_PUBLIC_APP_MODE=TEACHER
```

V tomto režimu máte přístup ke správě vašich systémů a úkolů. Můžete přidávat nové systémy, přidávat úkoly, upravovat je a mazat. Tento režim je určen pro vás jako učitele, abyste mohli připravit materiály pro své studenty.

### Studentský režim (STUDENT)

#### Nastavení

V souboru `.env` nastavte:

```env
NUXT_PUBLIC_APP_MODE=STUDENT
```


### Odkazy

1. https://www.cloudflare.com/learning/serverless/glossary/client-side-vs-server-side/

