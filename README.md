# Matematický test – verze 3

Celý balíček: úvodní stránka, schválené rady a 11 matematických úloh. Maximum 12 bodů. Bez přihlašování a bez shromažďování výsledků.

## Jak nahrát aktualizaci na GitHub

1. Rozbalte ZIP. Otevřete repozitář `klementlibor-uhk/timss2023-uvolnene-01`.
2. Přes **Add file → Upload files** nahrajte celý obsah rozbaleného balíčku, včetně složek `assets` a `rady`, do hlavní složky repozitáře. Hlavní `index.html` se nahradí novou úvodní stránkou. Nenahrávejte ZIP ani nadřazenou složku `test-v2`.
3. Potvrďte **Commit changes** a počkejte na dokončení GitHub Pages (zelená fajfka na kartě Actions).
4. Otevřete https://klementlibor-uhk.github.io/timss2023-uvolnene-01/ a obnovte stránku pomocí Ctrl+F5.

Nastavení Pages může zůstat **Deploy from a branch → main → /(root)**. Staré nepoužívané `app.js` a `style.css` můžete ponechat; nové stránky je nenačítají. Originální ZIP verze 1 si uchovejte pro případ návratu. Aktualizace nahrazuje hlavní `index.html` a `scoring.js`.

## Spuštění bez GitHubu

Otevřete rozbalený `index.html` ve webovém prohlížeči. Vše funguje jako statické soubory, bez instalace či sestavování.

## Funkce a pravidla

- Úvodní stránka obsahuje název publikace, zdroj, tlačítko Spustit test a Rady pro vyplnění testu.
- Na konci rad jsou volby Projít rady znovu, Zpět na úvodní stránku a Spustit test.
- Čas se měří až po otevření samotného testu. Úvod a rady se nezapočítávají. Během testu se počítá i doba v jiné záložce. Při odevzdání se čas zastaví a zobrazí ve výsledku v minutách a sekundách.
- Žák může novou otázku otevřít jen bezprostředně následující šipkou. Vyplnění není podmínkou. Mezi již otevřenými otázkami se pohybuje libovolně pomocí koleček vlevo. Barevně se rozlišují aktuální a vyplněné otázky; barva neprozrazuje správnost.
- Číselná klávesnice se otevírá při kliknutí do číselného pole. Je přesouvatelná, umožňuje mazání a zlomek s čitatelem nad vodorovnou čarou a jmenovatelem pod ní. Podporuje i běžnou klávesnici.
- U džusu ME61182 se uznávají např. 1,25, 1.25, 5/4, 1 1/4, 10/8 i odpovídající zlomek z grafické klávesnice. Nulový nebo chybějící jmenovatel se neuznává.
- Znak násobení je viditelný křížek ×. Obrázky šneků se přetahují na zahnutou cestičku; alternativa je vybrat šneka a kliknout na bod. Význam obou původních matematických zadání je zachován.
- Pravítko je pouze ve cvičném kroku rad. V samotném testu není.
- Výsledek obsahuje body z 12, procenta, motivační slovní hodnocení a dobu řešení. Dále umožňuje tisk, prohlížení odpovědí a nový pokus.

## Bodování

Úlohy 1–10 nejvýše po 1 bodu. ME61256 se hodnotí pouze podle Ano/Ne; vysvětlení zůstává k prohlížení. U tabulky úhlů i šneků je bod jen za všechny části správně. ME61211: část A za 1 bod a část B za 1 bod. Nevyplněné či nesprávné odpovědi mají 0 bodů. Hodnocení je motivační, nikoli oficiální škála TIMSS.

Odpovědi se uchovávají při přecházení mezi otázkami v otevřeném pokusu. Obnovení nebo zavření stránky pokus vymaže. Výsledky se nikam neodesílají. Správné odpovědi jsou součástí klientského kódu; test je určen pro procvičování.

Zdroj úloh: uživatelem dodané MAT_Test1_ME2.pdf, uvolněné úlohy TIMSS 2023. Podrobné uvedení zdroje je na úvodní stránce. Vlastní rozhraní neobsahuje původní loga. Šneci pocházejí ze schválených grafických návrhů.

## Vzhled verze 3

Modré ovládací prvky v testu i radách. Úvodní stránka má jemně modré pozadí, schváleného šneka a výrazné kruhové označení Test číslo 1. Druhý test zatím není součástí balíčku.

Výsledek používá kompaktní dvousloupcový přehled. Správně je označeno zeleně, Nesprávně červeně. Poslední úloha za 1 ze 2 bodů má označení Částečně správně a zvláštní značku pro části A a B. Na úlohu lze kliknout pro prohlédnutí. Na úzké obrazovce nebo při zvětšení textu je přehled jednosloupcový a může vyžadovat rolování, aby zůstal čitelný.
